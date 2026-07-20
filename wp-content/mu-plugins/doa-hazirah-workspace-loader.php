<?php
/**
 * Plugin Name: DOA Hazirah Workspace Loader
 * Description: Loads the private Hazirah workspace automatically on deployed environments.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$workspace_plugin = WP_PLUGIN_DIR . '/doa-hazirah-workspace/doa-hazirah-workspace.php';
if ( file_exists( $workspace_plugin ) ) {
	require_once $workspace_plugin;
}

