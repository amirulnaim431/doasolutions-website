<?php
/** Local font and immutable delivery assets for the custom DOA templates. */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function doa_performance_asset( $key, $fallback ) {
	static $manifest = null;
	$assets = __DIR__ . '/assets/';
	if ( null === $manifest ) {
		$file     = $assets . 'dist/manifest.json';
		$manifest = is_readable( $file ) ? json_decode( file_get_contents( $file ), true ) : array();
	}
	$relative = $manifest[ $key ] ?? $fallback;
	return is_file( $assets . $relative ) ? $relative : $fallback;
}

function doa_performance_fonts() {
	static $fonts = null;
	if ( null === $fonts ) {
		$file  = __DIR__ . '/assets/fonts/manifest.json';
		$fonts = is_readable( $file ) ? json_decode( file_get_contents( $file ), true ) : array();
	}
	return is_array( $fonts ) ? $fonts : array();
}

function doa_performance_preload_fonts() {
	if ( ! doa_solutions_is_cinematic_request() ) {
		return;
	}
	$seen = array();
	foreach ( doa_performance_fonts() as $font ) {
		if ( empty( $font['preload'] ) || isset( $seen[ $font['file'] ] ) ) {
			continue;
		}
		$seen[ $font['file'] ] = true;
		printf( '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n", esc_url( get_stylesheet_directory_uri() . '/assets/fonts/' . $font['file'] ) );
	}
}
add_action( 'wp_head', 'doa_performance_preload_fonts', 2 );

function doa_performance_inline_fonts() {
	$file = __DIR__ . '/assets/' . doa_performance_asset( 'fontCss', 'doa-fonts.css' );
	if ( ! is_readable( $file ) ) {
		return '';
	}
	// The built font sheet lives in dist; inline URLs need an absolute asset base.
	return str_replace( '../fonts/', esc_url( get_stylesheet_directory_uri() . '/assets/fonts/' ), file_get_contents( $file ) );
}

function doa_performance_images() {
	static $images = null;
	if ( null === $images ) {
		$file   = __DIR__ . '/assets/images/manifest.json';
		$images = is_readable( $file ) ? json_decode( file_get_contents( $file ), true ) : array();
	}
	return is_array( $images ) ? $images : array();
}

function doa_performance_image( $family, $width ) {
	foreach ( doa_performance_images()[ $family ] ?? array() as $image ) {
		if ( (int) $image['width'] === (int) $width ) {
			return get_stylesheet_directory_uri() . '/assets/images/' . $image['file'];
		}
	}
	$fallback = 'logo' === $family ? 'doa-logo-mark-transparent.webp' : 'doa-scattered-workdesk.webp';
	return get_stylesheet_directory_uri() . '/assets/images/' . $fallback;
}

function doa_performance_image_srcset( $family ) {
	$sources = array();
	foreach ( doa_performance_images()[ $family ] ?? array() as $image ) {
		$sources[] = get_stylesheet_directory_uri() . '/assets/images/' . $image['file'] . ' ' . (int) $image['width'] . 'w';
	}
	return implode( ', ', $sources );
}
