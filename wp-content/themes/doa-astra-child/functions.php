<?php
/**
 * DOA Solutions child theme setup.
 *
 * @package DOA_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
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

	if ( is_front_page() ) {
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
	if ( is_front_page() ) {
		$classes[] = 'doa-cinematic-home';
	}

	return $classes;
}
add_filter( 'body_class', 'doa_solutions_body_classes' );

