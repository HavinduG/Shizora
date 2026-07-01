<?php
/**
 * Plugin Name: Shizora Leads
 * Plugin URI: https://shizora.com
 * Description: Captures contact form submissions from the Shizora Next.js frontend, saves them as a Custom Post Type, and sends email notifications.
 * Version: 1.0.0
 * Author: Shizora
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// 1. Register Custom Post Type for Leads
function shizora_leads_register_post_type() {
    $labels = array(
        'name'                  => 'Leads',
        'singular_name'         => 'Lead',
        'menu_name'             => 'Leads',
        'name_admin_bar'        => 'Leads',
        'add_new'               => 'Add New',
        'add_new_item'          => 'Add New Lead',
        'new_item'              => 'New Lead',
        'edit_item'             => 'Edit Lead',
        'view_item'             => 'View Lead',
        'all_items'             => 'All Leads',
        'search_items'          => 'Search Leads',
        'not_found'             => 'No leads found.',
    );

    $args = array(
        'labels'             => $labels,
        'public'             => false, // We don't need front-end pages for these
        'publicly_queryable' => false,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => false,
        'rewrite'            => false,
        'capability_type'    => 'post',
        'has_archive'        => false,
        'hierarchical'       => false,
        'menu_position'      => 30,
        'menu_icon'          => 'dashicons-email-alt',
        'supports'           => array('title'), // We will use custom meta boxes for the data
        'show_in_rest'       => false, // We will build a custom REST endpoint
    );

    register_post_type('shizora_lead', $args);
}
add_action('init', 'shizora_leads_register_post_type');

// 2. Add Custom Columns to the Leads Admin List
function shizora_leads_set_custom_columns($columns) {
    unset($columns['date']); // Remove default date to re-order
    $columns['lead_email'] = 'Email';
    $columns['lead_subject'] = 'Subject';
    $columns['date'] = 'Date';
    return $columns;
}
add_filter('manage_shizora_lead_posts_columns', 'shizora_leads_set_custom_columns');

function shizora_leads_custom_column($column, $post_id) {
    switch ($column) {
        case 'lead_email':
            echo esc_html(get_post_meta($post_id, '_lead_email', true));
            break;
        case 'lead_subject':
            echo esc_html(get_post_meta($post_id, '_lead_subject', true));
            break;
    }
}
add_action('manage_shizora_lead_posts_custom_column', 'shizora_leads_custom_column', 10, 2);

// 3. Add Meta Boxes to view Lead details in Admin
function shizora_leads_add_meta_boxes() {
    add_meta_box(
        'shizora_lead_details',
        'Lead Details',
        'shizora_lead_details_callback',
        'shizora_lead',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'shizora_leads_add_meta_boxes');

function shizora_lead_details_callback($post) {
    $email = get_post_meta($post->ID, '_lead_email', true);
    $subject = get_post_meta($post->ID, '_lead_subject', true);
    $message = get_post_meta($post->ID, '_lead_message', true);
    
    echo '<table class="form-table">';
    echo '<tr><th><label>Email</label></th><td>' . esc_html($email) . '</td></tr>';
    echo '<tr><th><label>Subject</label></th><td>' . esc_html($subject) . '</td></tr>';
    echo '<tr><th><label>Message</label></th><td>' . nl2br(esc_html($message)) . '</td></tr>';
    echo '</table>';
}

// 4. Create Settings Page for Email Configuration
function shizora_leads_settings_menu() {
    add_submenu_page(
        'edit.php?post_type=shizora_lead',
        'Lead Settings',
        'Settings',
        'manage_options',
        'shizora-leads-settings',
        'shizora_leads_settings_page'
    );
}
add_action('admin_menu', 'shizora_leads_settings_menu');

function shizora_leads_register_settings() {
    register_setting('shizora_leads_options_group', 'shizora_leads_notification_email');
}
add_action('admin_init', 'shizora_leads_register_settings');

function shizora_leads_settings_page() {
    ?>
    <div class="wrap">
        <h1>Shizora Leads Settings</h1>
        <form method="post" action="options.php">
            <?php settings_fields('shizora_leads_options_group'); ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Notification Email Address</th>
                    <td>
                        <input type="email" name="shizora_leads_notification_email" value="<?php echo esc_attr(get_option('shizora_leads_notification_email', get_option('admin_email'))); ?>" class="regular-text" />
                        <p class="description">This email will receive notifications when a new lead is submitted.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// 5. Create Custom REST API Endpoint
function shizora_leads_register_rest_route() {
    register_rest_route('shizora/v1', '/leads', array(
        'methods' => 'POST',
        'callback' => 'shizora_leads_handle_submission',
        'permission_callback' => '__return_true', // Publicly accessible for frontend form
    ));
}
add_action('rest_api_init', 'shizora_leads_register_rest_route');

function shizora_leads_handle_submission($request) {
    $parameters = $request->get_json_params();
    
    $name = sanitize_text_field($parameters['name']);
    $email = sanitize_email($parameters['email']);
    $subject = sanitize_text_field($parameters['subject']);
    $message = sanitize_textarea_field($parameters['message']);

    if (empty($name) || empty($email) || empty($message)) {
        return new WP_Error('missing_fields', 'Name, email, and message are required.', array('status' => 400));
    }

    // Insert Post
    $post_id = wp_insert_post(array(
        'post_title'    => $name . ' - ' . date('Y-m-d H:i:s'),
        'post_type'     => 'shizora_lead',
        'post_status'   => 'publish',
    ));

    if (is_wp_error($post_id)) {
        return new WP_Error('db_error', 'Could not save lead.', array('status' => 500));
    }

    // Save Meta Data
    update_post_meta($post_id, '_lead_email', $email);
    update_post_meta($post_id, '_lead_subject', $subject);
    update_post_meta($post_id, '_lead_message', $message);

    // Send Email
    $to = get_option('shizora_leads_notification_email', get_option('admin_email'));
    $email_subject = "New Shizora Lead: " . $subject;
    $body = "You have received a new inquiry from the Shizora website.\n\n";
    $body .= "Name: " . $name . "\n";
    $body .= "Email: " . $email . "\n";
    $body .= "Subject: " . $subject . "\n\n";
    $body .= "Message:\n" . $message . "\n";
    
    $headers = array('Content-Type: text/plain; charset=UTF-8');
    $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';

    wp_mail($to, $email_subject, $body, $headers);

    return rest_ensure_response(array('success' => true, 'message' => 'Lead saved and email sent.'));
}