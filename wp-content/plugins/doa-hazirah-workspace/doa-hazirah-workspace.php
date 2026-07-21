<?php
/**
 * Plugin Name: DOA Hazirah Workspace
 * Description: Private annual project and work monitoring workspace for Hazirah.
 * Version: 1.1.2
 * Author: DOA Solutions
 * Text Domain: doa-hazirah
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'DOA_HAZIRAH_VERSION', '1.1.2' );
define( 'DOA_HAZIRAH_FILE', __FILE__ );
define( 'DOA_HAZIRAH_DIR', plugin_dir_path( __FILE__ ) );
define( 'DOA_HAZIRAH_URL', plugin_dir_url( __FILE__ ) );
define( 'DOA_HAZIRAH_SLUG', 'honeydew-planner' );
// One-time portable WordPress hash for the temporary password supplied by the owner.
// The plaintext credential is never stored in the repository and WordPress will
// transparently upgrade this legacy-compatible hash after a successful sign-in.
define( 'DOA_HAZIRAH_INITIAL_PASSWORD_HASH', '$P$FWkCyKilcPxygcal3XUetcexilg11g1' );

require_once DOA_HAZIRAH_DIR . 'includes/class-doa-hazirah-db.php';
require_once DOA_HAZIRAH_DIR . 'includes/class-doa-hazirah-api.php';

final class DOA_Hazirah_Workspace {
	private static $instance;

	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'init', array( $this, 'register_capability' ) );
		add_action( 'template_redirect', array( $this, 'route_workspace' ), 0 );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'rest_api_init', array( 'DOA_Hazirah_API', 'register_routes' ) );
		add_filter( 'robots_txt', array( $this, 'block_robots' ), 10, 2 );
		add_filter( 'show_admin_bar', array( $this, 'hide_workspace_admin_bar' ) );
	}

	public static function activate() {
		DOA_Hazirah_DB::install();
		self::add_capability();
		$initial_password = getenv( 'DOA_HAZIRAH_INITIAL_PASSWORD' );
		if ( is_string( $initial_password ) && '' !== $initial_password ) {
			DOA_Hazirah_DB::seed_user( $initial_password );
		}
		flush_rewrite_rules();
	}

	public static function deactivate() {
		flush_rewrite_rules();
	}

	public static function add_capability() {
		foreach ( array( 'administrator', 'editor', 'subscriber' ) as $role_name ) {
			$role = get_role( $role_name );
			if ( $role ) {
				$role->add_cap( 'use_hazirah_workspace' );
			}
		}
	}

	public function register_capability() {
		if ( get_option( 'doa_hazirah_db_version' ) !== DOA_HAZIRAH_VERSION ) {
			DOA_Hazirah_DB::install();
			self::add_capability();
		}
	}

	public static function workspace_url( $view = '' ) {
		$url = home_url( '/' . DOA_HAZIRAH_SLUG . '/' );
		return $view ? add_query_arg( 'view', sanitize_key( $view ), $url ) : $url;
	}

	private function is_workspace_request() {
		$path = trim( (string) wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH ), '/' );
		return DOA_HAZIRAH_SLUG === $path;
	}

	public function hide_workspace_admin_bar( $show ) {
		return $this->is_workspace_request() ? false : $show;
	}

	public function route_workspace() {
		if ( ! $this->is_workspace_request() ) {
			return;
		}

		// Keep the private workspace visually separate from WordPress administration.
		show_admin_bar( false );

		nocache_headers();
		header( 'X-Robots-Tag: noindex, nofollow, noarchive', true );
		header( 'Referrer-Policy: same-origin', true );
		header( 'X-Frame-Options: SAMEORIGIN', true );
		header( "Content-Security-Policy: frame-ancestors 'self'", true );

		if ( isset( $_GET['hazirah_logout'] ) ) {
			check_admin_referer( 'doa_hazirah_logout' );
			wp_logout();
			wp_safe_redirect( self::workspace_url() );
			exit;
		}

		if ( 'POST' === ( $_SERVER['REQUEST_METHOD'] ?? '' ) && isset( $_POST['doa_hazirah_login'] ) ) {
			$this->handle_login();
		}

		if ( ! is_user_logged_in() || ! current_user_can( 'use_hazirah_workspace' ) ) {
			$this->render_login();
			exit;
		}

		$this->render_app();
		exit;
	}

	private function rate_limit_key( $username ) {
		$ip = sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ?? 'unknown' ) );
		return 'doa_hazi_login_' . md5( strtolower( $username ) . '|' . $ip );
	}

	private function handle_login() {
		$error = '';
		if ( ! isset( $_POST['doa_hazirah_login_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['doa_hazirah_login_nonce'] ) ), 'doa_hazirah_login' ) ) {
			$error = 'Your login session expired. Please refresh and try again.';
		} else {
			$username = sanitize_user( wp_unslash( $_POST['username'] ?? '' ) );
			$key      = $this->rate_limit_key( $username );
			$attempts = (int) get_transient( $key );

			if ( $attempts >= 5 ) {
				$error = 'Too many login attempts. Please wait 15 minutes and try again.';
			} else {
				$user = wp_signon(
					array(
						'user_login'    => $username,
						'user_password' => (string) wp_unslash( $_POST['password'] ?? '' ),
						'remember'      => ! empty( $_POST['remember'] ),
					),
					is_ssl()
				);

				if ( is_wp_error( $user ) || ! user_can( $user, 'use_hazirah_workspace' ) ) {
					set_transient( $key, $attempts + 1, 15 * MINUTE_IN_SECONDS );
					if ( ! is_wp_error( $user ) ) {
						wp_logout();
					}
					$error = 'The username or password is not correct.';
				} else {
					delete_transient( $key );
					wp_set_current_user( $user->ID );
					wp_set_auth_cookie( $user->ID, ! empty( $_POST['remember'] ), is_ssl() );
					wp_safe_redirect( self::workspace_url() );
					exit;
				}
			}
		}

		set_transient( 'doa_hazirah_login_error_' . wp_get_session_token(), $error, MINUTE_IN_SECONDS );
	}

	private function render_login() {
		$error = get_transient( 'doa_hazirah_login_error_' . wp_get_session_token() );
		delete_transient( 'doa_hazirah_login_error_' . wp_get_session_token() );
		status_header( 200 );
		include DOA_HAZIRAH_DIR . 'templates/login.php';
	}

	private function render_app() {
		status_header( 200 );
		include DOA_HAZIRAH_DIR . 'templates/app.php';
	}

	public function enqueue_assets() {
		if ( ! $this->is_workspace_request() || ! is_user_logged_in() || ! current_user_can( 'use_hazirah_workspace' ) ) {
			return;
		}

		wp_enqueue_style( 'doa-hazirah-fonts', 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap', array(), null );
		wp_enqueue_style( 'doa-hazirah', DOA_HAZIRAH_URL . 'assets/workspace.css', array(), DOA_HAZIRAH_VERSION );
		wp_enqueue_script( 'doa-hazirah', DOA_HAZIRAH_URL . 'assets/workspace.js', array(), DOA_HAZIRAH_VERSION, true );

		$user = wp_get_current_user();
		wp_localize_script(
			'doa-hazirah',
			'DOAHazirah',
			array(
				'api'                => esc_url_raw( rest_url( 'doa-hazirah/v1/' ) ),
				'nonce'              => wp_create_nonce( 'wp_rest' ),
				'workspaceUrl'       => self::workspace_url(),
				'iconSprite'         => esc_url_raw( DOA_HAZIRAH_URL . 'assets/icons/hazirah-icons.svg' ),
				'logoutUrl'          => wp_nonce_url( add_query_arg( 'hazirah_logout', '1', self::workspace_url() ), 'doa_hazirah_logout' ),
				'currentUser'        => array(
					'id'          => $user->ID,
					'name'        => $user->display_name,
					'initials'    => mb_strtoupper( mb_substr( $user->display_name ?: $user->user_login, 0, 1 ) ),
					'forceChange' => (bool) get_user_meta( $user->ID, 'doa_hazirah_force_password_change', true ),
				),
				'today'              => wp_date( 'Y-m-d' ),
				'year'               => (int) get_user_meta( $user->ID, 'doa_hazirah_default_year', true ) ?: (int) wp_date( 'Y' ),
				'statusLabels'       => DOA_Hazirah_DB::statuses(),
				'priorityLabels'     => DOA_Hazirah_DB::priorities(),
			)
		);
	}

	public function block_robots( $output, $public ) {
		return $output . "\nDisallow: /" . DOA_HAZIRAH_SLUG . "/\n";
	}
}

register_activation_hook( __FILE__, array( 'DOA_Hazirah_Workspace', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'DOA_Hazirah_Workspace', 'deactivate' ) );
DOA_Hazirah_Workspace::instance();
