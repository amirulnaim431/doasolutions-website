<?php
session_start();

header( 'Content-Type: application/json' );
header( 'Cache-Control: no-store' );

if ( empty( $_SESSION['doa_finance_user'] ) ) {
	http_response_code( 401 );
	echo json_encode( array( 'error' => 'Not authenticated.' ) );
	exit;
}

$username = preg_replace( '/[^a-zA-Z0-9_-]+/', '', $_SESSION['doa_finance_user']['username'] ?? 'user' );
$method   = $_SERVER['REQUEST_METHOD'];
$data_dir = dirname( __DIR__, 2 ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'sales-documents';
$path     = $data_dir . DIRECTORY_SEPARATOR . 'company.json';

if ( ! is_dir( $data_dir ) ) {
	mkdir( $data_dir, 0755, true );
}

if ( 'GET' === $method ) {
	if ( is_file( $path ) ) {
		readfile( $path );
		exit;
	}

	$default = default_sales_document_state( $_SESSION['doa_finance_user']['name'] ?? 'DOA Staff' );
	file_put_contents( $path, json_encode( $default, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ), LOCK_EX );
	echo json_encode( $default );
	exit;
}

if ( 'POST' === $method ) {
	$raw  = file_get_contents( 'php://input' );
	$data = json_decode( $raw, true );

	if ( ! is_array( $data ) ) {
		http_response_code( 400 );
		echo json_encode( array( 'error' => 'Invalid JSON payload.' ) );
		exit;
	}

	$safe = array(
		'settings'         => is_array( $data['settings'] ?? null ) ? $data['settings'] : array(),
		'clients'          => is_array( $data['clients'] ?? null ) ? array_values( $data['clients'] ) : array(),
		'items'            => is_array( $data['items'] ?? null ) ? array_values( $data['items'] ) : array(),
		'documents'        => is_array( $data['documents'] ?? null ) ? array_values( $data['documents'] ) : array(),
		'activeDocumentId' => is_string( $data['activeDocumentId'] ?? null ) ? $data['activeDocumentId'] : null,
		'savedAt'          => date( 'c' ),
		'savedBy'          => $username,
	);

	file_put_contents( $path, json_encode( $safe, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ), LOCK_EX );
	echo json_encode( array( 'ok' => true, 'savedAt' => $safe['savedAt'] ) );
	exit;
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
