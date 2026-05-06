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

