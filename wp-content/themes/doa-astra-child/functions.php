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
			'doa-solutions-home',
			$base . '/assets/doa-home.js',
			array(),
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
