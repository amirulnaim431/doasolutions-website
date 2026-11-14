<?php
require_once dirname( __DIR__, 3 ) . '/back-office/bootstrap.php';
doa_start();
$user = doa_require_user( true );
if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
	doa_verify_write();
}
session_write_close();
header( 'Content-Type: application/json; charset=utf-8' );

$username = $user['username'];
$method   = $_SERVER['REQUEST_METHOD'];
$data_dir = dirname( __DIR__, 2 ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'sales-documents';
$path     = $data_dir . DIRECTORY_SEPARATOR . 'company.json';

if ( ! is_dir( $data_dir ) ) {
	mkdir( $data_dir, 0755, true );
}

if ( in_array( $method, array( 'GET', 'POST' ), true ) ) {
	$lock = fopen( $data_dir . '/company.lock', 'c' );
	if ( ! $lock || ! flock( $lock, LOCK_EX ) ) {
		doa_json( array( 'error' => 'Sales Documents storage is unavailable.' ), 503 );
	}
	$exists = is_file( $path );
	$current = $exists ? file_get_contents( $path ) : json_encode( default_sales_document_state( $user['name'] ) );
	if ( $current === false || ! is_array( json_decode( $current, true ) ) ) {
		doa_json( array( 'error' => 'The shared Sales Documents file could not be read.' ), 503 );
	}
	$version = $exists ? hash( 'sha256', $current ) : 'new-company';
	if ( 'GET' === $method ) {
		header( 'ETag: "' . $version . '"' );
		echo $current;
		exit;
	}
	if ( ! hash_equals( '"' . $version . '"', $_SERVER['HTTP_IF_MATCH'] ?? '' ) ) {
		doa_json( array( 'error' => 'Sales Documents changed in another session. Export unsaved changes before reloading.' ), 409 );
	}
	$raw = file_get_contents( 'php://input', false, null, 0, 12000001 );
	$data = json_decode( $raw, true );
	if ( strlen( $raw ) > 12000000 || ! is_array( $data ) ) {
		doa_json( array( 'error' => 'Invalid or oversized Sales Documents request.' ), 400 );
	}
	foreach ( array( 'settings', 'clients', 'items', 'documents' ) as $field ) {
		if ( ! is_array( $data[$field] ?? null ) ) {
			doa_json( array( 'error' => 'A required Sales Documents field is missing.' ), 422 );
		}
	}
	$safe = array_intersect_key( $data, array_flip( array( 'settings', 'clients', 'items', 'documents', 'activeDocumentId' ) ) );
	$safe['savedAt'] = date( 'c' );
	$safe['savedBy'] = $username;
	$updated = json_encode( $safe, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES );
	if ( $updated === false ) {
		doa_json( array( 'error' => 'Invalid Sales Documents data.' ), 422 );
	}
	$tmp = tempnam( $data_dir, 'company-' );
	if ( ! $tmp || file_put_contents( $tmp, $updated ) !== strlen( $updated ) || ! rename( $tmp, $path ) ) {
		if ( $tmp && is_file( $tmp ) ) {
			unlink( $tmp );
		}
		doa_json( array( 'error' => 'Could not save Sales Documents.' ), 503 );
	}
	header( 'ETag: "' . hash( 'sha256', $updated ) . '"' );
	doa_json( array( 'ok' => true, 'savedAt' => $safe['savedAt'] ) );
}

http_response_code( 405 );
echo json_encode( array( 'error' => 'Method not allowed.' ) );

function default_sales_document_state( $staff_name ) {
	$settings = array(
		'companyName'      => 'DOA Solutions',
		'registration'     => '202503146827 (003736059-H)',
		'address'          => 'Business address placeholder',
		'email'            => 'hello@doasolutions.com.my',
		'phone'            => '',
		'website'          => 'doasolutions.com.my',
		'quotationPrefix'  => 'QT',
		'invoicePrefix'    => 'INV',
		'quotationNext'    => 1,
		'invoiceNext'      => 1,
		'validityDays'     => 14,
		'paymentDays'      => 14,
		'quotationTerms'   => 'This quotation is valid until the stated valid-until date. Any additional scope will be quoted separately.',
		'invoiceNotes'     => 'Please use the invoice number as payment reference.',
		'footer'           => 'This is a computer-generated document. No signature is required.',
		'bankAccounts'     => array(
			array(
				'bank'        => 'Bank placeholder',
				'holder'      => 'DOA Solutions',
				'number'      => 'Account number placeholder',
				'duitnow'     => '',
				'instruction' => 'Please include invoice number as payment reference.',
			),
		),
	);

	$items = array(
		array( 'id' => 'item-system-development', 'name' => 'System Design & Development', 'description' => 'Custom system planning, interface design and development work.', 'category' => 'Development', 'unit' => 'project', 'priceCents' => 0, 'taxRate' => 0, 'active' => true ),
		array( 'id' => 'item-deployment', 'name' => 'Deployment & Configuration', 'description' => 'Production deployment, configuration and handover preparation.', 'category' => 'Deployment', 'unit' => 'service', 'priceCents' => 0, 'taxRate' => 0, 'active' => true ),
		array( 'id' => 'item-support', 'name' => 'Monthly System Support & Maintenance', 'description' => 'Monthly support, monitoring and small fixes.', 'category' => 'Support', 'unit' => 'month', 'priceCents' => 0, 'taxRate' => 0, 'active' => true ),
	);

	$issue_date = date( 'Y-m-d' );
	$draft_id   = 'doc-r-yang-draft';
	$client     = array(
		'id'           => 'client-r-yang',
		'name'         => 'R-Yang',
		'registration' => '',
		'contact'      => '',
		'email'        => '',
		'phone'        => '',
		'address'      => 'Client billing address placeholder',
		'tax'          => '',
		'notes'        => 'Shared draft client record.',
	);

	return array(
		'settings'         => $settings,
		'clients'          => array( $client ),
		'items'            => $items,
		'documents'        => array(
			array(
				'id'                    => $draft_id,
				'type'                  => 'quotation',
				'status'                => 'Draft',
				'number'                => 'DRAFT-R-YANG',
				'issueDate'             => $issue_date,
				'validUntilDate'        => date( 'Y-m-d', strtotime( '+14 days' ) ),
				'dueDate'               => date( 'Y-m-d', strtotime( '+14 days' ) ),
				'projectTitle'          => 'R-Yang Facilities Operations System',
				'clientReference'       => '',
				'preparedBy'            => $staff_name,
				'currency'              => 'MYR',
				'client'                => $client,
				'items'                 => array(
					array( 'id' => 'line-r-yang-ops', 'serviceItemId' => 'item-system-development', 'name' => 'Facilities Operations Dashboard', 'description' => 'Draft scope for R-Yang daily operations, site tracking, attendance, issues, inspections and reporting.', 'quantity' => '1', 'unit' => 'project', 'unitPriceCents' => 0, 'discountCents' => 0, 'taxRate' => 0 ),
				),
				'documentDiscountCents' => 0,
				'adjustmentCents'       => 0,
				'amountPaidCents'       => 0,
				'installmentPlan'       => array( 'enabled' => false, 'label' => '', 'totalAmountCents' => 0, 'total' => 12, 'current' => 1, 'amountCents' => 0, 'paidToDateCents' => 0, 'nextDueDate' => '', 'notes' => '' ),
				'paymentSchedule'       => 'Payment schedule to be confirmed.',
				'scopeTerms'            => $settings['quotationTerms'],
				'projectTimeline'       => 'Timeline to be confirmed after scope confirmation.',
				'acceptanceNote'        => 'Acceptance details are recorded for administration only.',
				'acceptedBy'            => '',
				'acceptanceDesignation' => '',
				'acceptanceDate'        => '',
				'poNumber'              => '',
				'paymentInstructions'   => $settings['invoiceNotes'],
				'paymentReferenceReminder' => 'Please include the invoice number in the payment reference.',
				'latePaymentNote'       => 'Please contact DOA Solutions if payment timing requires discussion.',
				'additionalNotes'       => '',
				'bankAccountId'         => 'bank-0',
				'payments'              => array(),
				'history'               => array( array( 'action' => 'R-Yang draft created', 'by' => $staff_name, 'at' => date( 'c' ) ) ),
				'sourceQuotationId'     => '',
			),
		),
		'activeDocumentId' => $draft_id,
	);
}
