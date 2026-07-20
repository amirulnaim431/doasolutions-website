<?php
/**
 * Clear Hazirah's project workspace while preserving the account, preferences,
 * and reusable categories.
 *
 * Usage:
 * DOA_HAZIRAH_CONFIRM_CLEAR=yes php clear-workspace.php
 */

if ( PHP_SAPI !== 'cli' ) {
	exit( 1 );
}

if ( 'yes' !== getenv( 'DOA_HAZIRAH_CONFIRM_CLEAR' ) ) {
	fwrite( STDERR, "Set DOA_HAZIRAH_CONFIRM_CLEAR=yes to confirm.\n" );
	exit( 1 );
}

$root = dirname( __DIR__, 4 );
require_once $root . '/wp-load.php';
require_once dirname( __DIR__ ) . '/includes/class-doa-hazirah-db.php';

global $wpdb;
$user = get_user_by( 'login', 'hazi' );
if ( ! $user ) {
	fwrite( STDERR, "Hazirah account was not found.\n" );
	exit( 1 );
}

$projects_table = DOA_Hazirah_DB::table( 'projects' );
$project_ids    = array_map(
	'intval',
	$wpdb->get_col(
		$wpdb->prepare(
			"SELECT id FROM {$projects_table} WHERE user_id=%d",
			$user->ID
		)
	)
);

$wpdb->query( 'START TRANSACTION' );

if ( $project_ids ) {
	$placeholders = implode( ',', array_fill( 0, count( $project_ids ), '%d' ) );
	foreach ( array( 'reminders', 'milestones' ) as $table_name ) {
		$wpdb->query(
			$wpdb->prepare(
				'DELETE FROM ' . DOA_Hazirah_DB::table( $table_name ) . " WHERE project_id IN ($placeholders)",
				$project_ids
			)
		);
	}

	$dependency_args = array_merge( $project_ids, $project_ids );
	$wpdb->query(
		$wpdb->prepare(
			'DELETE FROM ' . DOA_Hazirah_DB::table( 'dependencies' ) . " WHERE project_id IN ($placeholders) OR depends_on_project_id IN ($placeholders)",
			$dependency_args
		)
	);
}

$wpdb->delete( DOA_Hazirah_DB::table( 'activities' ), array( 'user_id' => $user->ID ), array( '%d' ) );
$wpdb->delete( $projects_table, array( 'user_id' => $user->ID ), array( '%d' ) );
$wpdb->query( 'COMMIT' );

fwrite( STDOUT, sprintf( "Cleared %d project records. Categories and account settings were preserved.\n", count( $project_ids ) ) );

