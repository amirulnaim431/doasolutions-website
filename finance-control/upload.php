<?php
session_start();

header( 'Content-Type: application/json' );

if ( empty( $_SESSION['doa_finance_user'] ) ) {
	http_response_code( 401 );
	echo wp_json_encode_fallback( array( 'error' => 'Not authenticated.' ) );
	exit;
}

if ( empty( $_FILES['statement'] ) || UPLOAD_ERR_OK !== $_FILES['statement']['error'] ) {
	http_response_code( 400 );
	echo wp_json_encode_fallback( array( 'error' => 'No valid statement file uploaded.' ) );
	exit;
}

$file = $_FILES['statement'];
$max_bytes = 10 * 1024 * 1024;

if ( $file['size'] > $max_bytes ) {
	http_response_code( 413 );
	echo wp_json_encode_fallback( array( 'error' => 'Statement file is larger than 10MB.' ) );
	exit;
}

$extension = strtolower( pathinfo( $file['name'], PATHINFO_EXTENSION ) );
$allowed    = array( 'csv', 'xlsx', 'xls', 'pdf' );

if ( ! in_array( $extension, $allowed, true ) ) {
	http_response_code( 415 );
	echo wp_json_encode_fallback( array( 'error' => 'Only CSV, Excel, and PDF statements are supported.' ) );
	exit;
}

$upload_dir = __DIR__ . DIRECTORY_SEPARATOR . 'uploads';

if ( ! is_dir( $upload_dir ) ) {
	mkdir( $upload_dir, 0755, true );
}

$safe_original = preg_replace( '/[^a-zA-Z0-9._-]+/', '-', basename( $file['name'] ) );
$stored_name   = date( 'Ymd-His' ) . '-' . bin2hex( random_bytes( 6 ) ) . '-' . $safe_original;
$target        = $upload_dir . DIRECTORY_SEPARATOR . $stored_name;

if ( ! move_uploaded_file( $file['tmp_name'], $target ) ) {
	http_response_code( 500 );
	echo wp_json_encode_fallback( array( 'error' => 'Could not store uploaded statement.' ) );
	exit;
}

echo wp_json_encode_fallback(
	array(
		'ok'           => true,
		'originalName' => $file['name'],
		'storedName'   => $stored_name,
		'size'         => $file['size'],
		'uploadedAt'   => date( 'c' ),
		'uploadedBy'   => $_SESSION['doa_finance_user']['username'],
	)
);

function wp_json_encode_fallback( $data ) {
	if ( function_exists( 'wp_json_encode' ) ) {
		return wp_json_encode( $data );
	}

	return json_encode( $data );
}
