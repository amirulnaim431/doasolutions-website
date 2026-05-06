<?php
/**
 * Ensure the DOA Solutions child theme is used on code-managed deployments.
 *
 * @package DOA_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function doa_solutions_child_theme_exists() {
	return is_dir( WP_CONTENT_DIR . '/themes/doa-astra-child' );
}

function doa_solutions_template_override( $template ) {
	return doa_solutions_child_theme_exists() ? 'astra' : $template;
}
add_filter( 'pre_option_template', 'doa_solutions_template_override' );

function doa_solutions_stylesheet_override( $stylesheet ) {
	return doa_solutions_child_theme_exists() ? 'doa-astra-child' : $stylesheet;
}
add_filter( 'pre_option_stylesheet', 'doa_solutions_stylesheet_override' );

function doa_solutions_static_about_template( $template ) {
	$request_path = trim( (string) parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ), '/' );
	$request_path = preg_replace( '#^domains/[^/]+/public_html/#', '', $request_path );

	if ( in_array( $request_path, array( 'about', 'about-us' ), true ) && doa_solutions_child_theme_exists() ) {
		$about_template = WP_CONTENT_DIR . '/themes/doa-astra-child/about.php';

		if ( file_exists( $about_template ) ) {
			status_header( 200 );
			return $about_template;
		}
	}

	return $template;
}
add_filter( 'template_include', 'doa_solutions_static_about_template', 99 );
