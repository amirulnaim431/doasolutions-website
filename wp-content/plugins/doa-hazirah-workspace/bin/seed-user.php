<?php
/**
 * Secure server-side account seeder.
 *
 * Usage:
 * DOA_HAZIRAH_INITIAL_PASSWORD="..." php wp-content/plugins/doa-hazirah-workspace/bin/seed-user.php
 */

if ( PHP_SAPI !== 'cli' ) {
	exit( 1 );
}

$root = dirname( __DIR__, 4 );
require_once $root . '/wp-load.php';

$password = getenv( 'DOA_HAZIRAH_INITIAL_PASSWORD' );
if ( false === $password || '' === $password ) {
	fwrite( STDERR, "Set DOA_HAZIRAH_INITIAL_PASSWORD before running this seeder.\n" );
	exit( 1 );
}

require_once dirname( __DIR__ ) . '/includes/class-doa-hazirah-db.php';
DOA_Hazirah_DB::install();
$result = DOA_Hazirah_DB::seed_user( $password );
if ( is_wp_error( $result ) ) {
	fwrite( STDERR, $result->get_error_message() . "\n" );
	exit( 1 );
}

fwrite( STDOUT, "Hazirah account and sample workspace data are ready.\n" );
