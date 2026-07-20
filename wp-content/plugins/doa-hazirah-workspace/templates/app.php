<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex,nofollow,noarchive">
	<title>Hazirah's Workspace · DOA Solutions</title>
	<?php wp_head(); ?>
</head>
<body class="doa-hazirah-app">
	<?php
	$hazirah_icon = static function ( $name, $class = '' ) {
		return sprintf(
			'<svg class="ui-icon %1$s" aria-hidden="true" focusable="false"><use href="%2$s#icon-%3$s"></use></svg>',
			esc_attr( $class ),
			esc_url( DOA_HAZIRAH_URL . 'assets/icons/hazirah-icons.svg' ),
			esc_attr( $name )
		);
	};
	?>
	<a class="skip-link" href="#hazi-main">Skip to content</a>
	<div id="hazi-app">
		<aside class="sidebar" id="sidebar">
			<div class="wordmark"><span class="wordmark-mark">D</span><span><strong>DOA</strong><small>Solutions</small></span></div>
			<div class="workspace-label">Hazirah’s workspace</div>
			<nav class="main-nav" aria-label="Workspace">
				<button class="nav-item active" data-view="overview"><span class="nav-icon"><?php echo $hazirah_icon( 'overview' ); ?></span><span>Overview</span></button>
				<button class="nav-item" data-view="projects"><span class="nav-icon"><?php echo $hazirah_icon( 'folder' ); ?></span><span>My Projects</span></button>
				<button class="nav-item" data-view="timeline"><span class="nav-icon"><?php echo $hazirah_icon( 'timeline' ); ?></span><span>Annual Timeline</span></button>
				<button class="nav-item" data-view="calendar"><span class="nav-icon"><?php echo $hazirah_icon( 'calendar' ); ?></span><span>Calendar</span></button>
				<button class="nav-item" data-view="completed"><span class="nav-icon"><?php echo $hazirah_icon( 'completed' ); ?></span><span>Completed</span></button>
				<button class="nav-item" data-view="archive"><span class="nav-icon"><?php echo $hazirah_icon( 'archive' ); ?></span><span>Archive</span></button>
			</nav>
			<div class="sidebar-bottom">
				<button class="nav-item" data-view="settings"><span class="nav-icon"><?php echo $hazirah_icon( 'settings' ); ?></span><span>Settings</span></button>
				<a class="nav-item logout" href="<?php echo esc_url( wp_nonce_url( add_query_arg( 'hazirah_logout', '1', DOA_Hazirah_Workspace::workspace_url() ), 'doa_hazirah_logout' ) ); ?>"><span class="nav-icon"><?php echo $hazirah_icon( 'logout' ); ?></span><span>Logout</span></a>
				<div class="user-chip"><span class="avatar"><?php echo esc_html( mb_strtoupper( mb_substr( wp_get_current_user()->display_name, 0, 1 ) ) ); ?></span><span><strong><?php echo esc_html( wp_get_current_user()->display_name ); ?></strong><small>Workspace owner</small></span></div>
			</div>
		</aside>
		<div class="app-body">
			<header class="topbar">
				<button class="icon-button mobile-menu" id="mobile-menu" aria-label="Open navigation" aria-expanded="false"><?php echo $hazirah_icon( 'more' ); ?></button>
				<div class="top-date" id="top-date"></div>
				<div class="top-actions">
					<label class="global-search"><?php echo $hazirah_icon( 'search' ); ?><span class="sr-only">Search projects</span><input id="global-search" type="search" placeholder="Search anything…"></label>
					<button class="icon-button notification-button" aria-label="Notifications"><?php echo $hazirah_icon( 'bell' ); ?><i></i></button>
					<button class="primary-button add-project-button"><?php echo $hazirah_icon( 'plus' ); ?><span>Add project</span></button>
				</div>
			</header>
			<main id="hazi-main" tabindex="-1">
				<div class="loading-state">
					<div class="loading-flower"><i></i><i></i><i></i><i></i></div>
					<p>Gathering your year…</p>
				</div>
			</main>
		</div>
	</div>
	<div id="toast-region" class="toast-region" aria-live="polite"></div>
	<div id="modal-root"></div>
	<?php wp_footer(); ?>
</body>
</html>

