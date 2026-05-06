<?php
/* DOA Demo forced front-page template */
defined('ABSPATH') || exit;

?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo esc_html(get_bloginfo('name')); ?></title>
  <?php wp_head(); ?>
</head>
<body class="doa-demo-standalone">
  <?php do_action('doa_demo_render_home'); ?>
  <?php wp_footer(); ?>
</body>
</html>