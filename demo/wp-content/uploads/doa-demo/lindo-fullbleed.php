<?php
if (!defined('ABSPATH')) exit;
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class('doa-lindo-fullbleed'); ?>>
<?php
  // Render the shortcode if your page uses it, otherwise render directly.
  if (shortcode_exists('doa_lindo_booking_demo')) {
    echo do_shortcode('[doa_lindo_booking_demo]');
  } else {
    echo '<div style="padding:24px;font-family:system-ui">Shortcode missing.</div>';
  }
?>
<?php wp_footer(); ?>
</body>
</html>