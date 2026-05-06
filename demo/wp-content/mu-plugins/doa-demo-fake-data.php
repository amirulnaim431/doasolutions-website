<?php
/**
 * Plugin Name: DOA Demo – Shared Fake Data (MU)
 * Description: Central demo data source for Booking, Claims, Membership. PHP + JS accessible.
 * Author: DOA Solutions
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

/**
 * ============================
 * SINGLE SOURCE OF TRUTH
 * ============================
 */

function doa_demo_get_fake_data(): array {

  return [
    'members' => [
      1 => [
        'id' => 1,
        'name' => 'Aisyah M.',
        'tier' => 'Silver',
        'pax' => 2,
        'balance' => 6420,
        'reward' => '20%',
      ],
      2 => [
        'id' => 2,
        'name' => 'Daniel K.',
        'tier' => 'Black',
        'pax' => 4,
        'balance' => 14800,
        'reward' => '25%',
      ],
      3 => [
        'id' => 3,
        'name' => 'Nur Iman',
        'tier' => 'Bronze',
        'pax' => 1,
        'balance' => 900,
        'reward' => '15%',
      ],
    ],

    'bookings' => [
      [
        'member_id' => 1,
        'date' => '2026-01-24',
        'service' => 'Facial Treatment',
        'amount' => 380,
      ],
      [
        'member_id' => 1,
        'date' => '2026-01-10',
        'service' => 'Consultation',
        'amount' => 0,
      ],
      [
        'member_id' => 2,
        'date' => '2026-01-22',
        'service' => 'Body Therapy',
        'amount' => 620,
      ],
      [
        'member_id' => 3,
        'date' => '2026-01-20',
        'service' => 'Consultation',
        'amount' => 0,
      ],
    ],

    'claims' => [
      [
        'claim_id' => 'C-10240',
        'member_id' => 1,
        'type' => 'T&G',
        'status' => 'Submitted',
      ],
      [
        'claim_id' => 'C-10239',
        'member_id' => 2,
        'type' => 'Medical',
        'status' => 'Approved',
      ],
    ],

    'redemptions' => [
      [
        'member_id' => 1,
        'date' => '2026-01-24',
        'item' => 'Facial Treatment',
        'amount' => 380,
      ],
      [
        'member_id' => 3,
        'date' => '2026-01-20',
        'item' => 'Product Usage',
        'amount' => 200,
      ],
    ],
  ];
}

/**
 * Make data available in PHP
 */
$GLOBALS['DOA_DEMO_DATA'] = doa_demo_get_fake_data();

/**
 * Make data available in JS on frontend pages
 */
add_action('wp_head', function () {
  if (is_admin()) return;
  $json = wp_json_encode($GLOBALS['DOA_DEMO_DATA']);
  echo "<script>window.DOA_DEMO_DATA = {$json};</script>";
});
