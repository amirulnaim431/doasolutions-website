<?php
/**
 * DOA Solutions child theme setup.
 *
 * @package DOA_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function doa_solutions_is_about_request() {
	$request_path = trim( (string) parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ), '/' );

	return in_array( $request_path, array( 'about', 'about-us' ), true );
}

function doa_solutions_is_cinematic_request() {
	return is_front_page() || doa_solutions_is_about_request();
}

function doa_solutions_enqueue_assets() {
	$theme = wp_get_theme();
	$base  = get_stylesheet_directory_uri();
	$path  = get_stylesheet_directory();

	wp_enqueue_style(
		'doa-solutions-parent',
		get_template_directory_uri() . '/style.css',
		array(),
		$theme->parent() ? $theme->parent()->get( 'Version' ) : null
	);

	if ( doa_solutions_is_cinematic_request() ) {
		wp_enqueue_style(
			'doa-solutions-home',
			$base . '/assets/doa-home.css',
			array( 'doa-solutions-parent' ),
			filemtime( $path . '/assets/doa-home.css' )
		);

		wp_enqueue_script(
			'doa-gsap',
			$base . '/assets/vendor/gsap.min.js',
			array(),
			filemtime( $path . '/assets/vendor/gsap.min.js' ),
			true
		);

		wp_enqueue_script(
			'doa-scroll-trigger',
			$base . '/assets/vendor/ScrollTrigger.min.js',
			array( 'doa-gsap' ),
			filemtime( $path . '/assets/vendor/ScrollTrigger.min.js' ),
			true
		);

		wp_enqueue_script(
			'doa-solutions-home',
			$base . '/assets/doa-home.js',
			array( 'doa-scroll-trigger' ),
			filemtime( $path . '/assets/doa-home.js' ),
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'doa_solutions_enqueue_assets', 20 );

function doa_solutions_body_classes( $classes ) {
	if ( doa_solutions_is_cinematic_request() ) {
		$classes[] = 'doa-cinematic-home';
	}

	return $classes;
}
add_filter( 'body_class', 'doa_solutions_body_classes' );

/**
 * Keep the private showcase out of every WordPress-managed navigation menu.
 */
function doa_solutions_hide_showcase_menu_items( $items ) {
	return array_values(
		array_filter(
			$items,
			static function ( $item ) {
				$title = strtolower( trim( wp_strip_all_tags( $item->title ?? '' ) ) );
				$url   = strtolower( (string) ( $item->url ?? '' ) );

				return 'showcase' !== $title && false === strpos( $url, '/showcase/' );
			}
		)
	);
}
add_filter( 'wp_nav_menu_objects', 'doa_solutions_hide_showcase_menu_items' );

/**
 * Store homepage contact submissions privately in WordPress.
 */
function doa_solutions_register_enquiries() {
	register_post_type(
		'doa_enquiry',
		array(
			'labels' => array(
				'name'          => 'Project Enquiries',
				'singular_name' => 'Project Enquiry',
				'menu_name'     => 'Project Enquiries',
			),
			'public'              => false,
			'publicly_queryable'  => false,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'exclude_from_search' => true,
			'menu_icon'           => 'dashicons-email-alt2',
			'supports'            => array( 'title', 'editor' ),
		)
	);
}
add_action( 'init', 'doa_solutions_register_enquiries' );

function doa_solutions_submit_enquiry() {
	if ( ! check_ajax_referer( 'doa_contact_submit', 'doa_contact_nonce', false ) ) {
		wp_send_json_error( array( 'message' => 'This form session expired. Please refresh and try again.' ), 403 );
	}

	if ( ! empty( $_POST['website'] ) ) {
		wp_send_json_success( array( 'message' => 'Thank you. Your enquiry has been received.' ) );
	}

	$remote_address = sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ?? 'unknown' ) );
	$rate_key       = 'doa_enquiry_' . md5( $remote_address );
	if ( get_transient( $rate_key ) ) {
		wp_send_json_error( array( 'message' => 'Please wait a moment before sending another enquiry.' ), 429 );
	}

	$name    = sanitize_text_field( wp_unslash( $_POST['name'] ?? '' ) );
	$phone   = sanitize_text_field( wp_unslash( $_POST['phone'] ?? '' ) );
	$company = sanitize_text_field( wp_unslash( $_POST['company'] ?? '' ) );
	$details = sanitize_textarea_field( wp_unslash( $_POST['details'] ?? '' ) );

	if ( strlen( $name ) < 2 || strlen( $phone ) < 6 ) {
		wp_send_json_error( array( 'message' => 'Please provide your name and a valid phone number.' ), 422 );
	}

	$enquiry_id = wp_insert_post(
		array(
			'post_type'    => 'doa_enquiry',
			'post_status'  => 'private',
			'post_title'   => $company ? $name . ' — ' . $company : $name,
			'post_content' => $details,
		),
		true
	);

	if ( is_wp_error( $enquiry_id ) ) {
		wp_send_json_error( array( 'message' => 'We could not save this just now. Please call or email DOA Solutions.' ), 500 );
	}

	update_post_meta( $enquiry_id, '_doa_name', $name );
	update_post_meta( $enquiry_id, '_doa_phone', $phone );
	update_post_meta( $enquiry_id, '_doa_company', $company );
	set_transient( $rate_key, 1, 30 );

	wp_send_json_success( array( 'message' => 'Signal received. We’ll contact you shortly.' ) );
}
add_action( 'wp_ajax_doa_submit_enquiry', 'doa_solutions_submit_enquiry' );
add_action( 'wp_ajax_nopriv_doa_submit_enquiry', 'doa_solutions_submit_enquiry' );

function doa_solutions_enquiry_columns( $columns ) {
	return array(
		'cb'      => $columns['cb'],
		'title'   => 'Name / Company',
		'phone'   => 'Phone',
		'details' => 'Project note',
		'date'    => $columns['date'],
	);
}
add_filter( 'manage_doa_enquiry_posts_columns', 'doa_solutions_enquiry_columns' );

function doa_solutions_enquiry_column_content( $column, $post_id ) {
	if ( 'phone' === $column ) {
		echo esc_html( get_post_meta( $post_id, '_doa_phone', true ) );
	}
	if ( 'details' === $column ) {
		echo esc_html( wp_trim_words( get_post_field( 'post_content', $post_id ), 14 ) );
	}
}
add_action( 'manage_doa_enquiry_posts_custom_column', 'doa_solutions_enquiry_column_content', 10, 2 );
