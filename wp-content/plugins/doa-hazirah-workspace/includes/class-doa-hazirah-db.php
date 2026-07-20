<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class DOA_Hazirah_DB {
	public static function table( $name ) {
		global $wpdb;
		return $wpdb->prefix . 'doa_hazirah_' . $name;
	}

	public static function statuses() {
		return array(
			'planned'     => 'Planned',
			'in_progress' => 'In Progress',
			'waiting'     => 'Waiting',
			'review'      => 'Review',
			'completed'   => 'Completed',
			'on_hold'     => 'On Hold',
			'cancelled'   => 'Cancelled',
		);
	}

	public static function priorities() {
		return array(
			'low'    => 'Low',
			'medium' => 'Medium',
			'high'   => 'High',
			'urgent' => 'Urgent',
		);
	}

	public static function install() {
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		$charset = $wpdb->get_charset_collate();

		$sql = array();
		$sql[] = 'CREATE TABLE ' . self::table( 'categories' ) . " (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(120) NOT NULL,
			color varchar(20) NOT NULL DEFAULT '#6c5ce7',
			created_at datetime NOT NULL,
			PRIMARY KEY  (id),
			UNIQUE KEY name (name)
		) $charset;";
		$sql[] = 'CREATE TABLE ' . self::table( 'projects' ) . " (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			user_id bigint(20) unsigned NOT NULL,
			category_id bigint(20) unsigned DEFAULT NULL,
			title varchar(220) NOT NULL,
			description text DEFAULT NULL,
			owner varchar(120) NOT NULL,
			client_department varchar(180) DEFAULT NULL,
			start_date date NOT NULL,
			due_date date NOT NULL,
			status varchar(30) NOT NULL DEFAULT 'planned',
			priority varchar(20) NOT NULL DEFAULT 'medium',
			progress tinyint(3) unsigned NOT NULL DEFAULT 0,
			notes longtext DEFAULT NULL,
			completed_date date DEFAULT NULL,
			archived_at datetime DEFAULT NULL,
			created_at datetime NOT NULL,
			updated_at datetime NOT NULL,
			PRIMARY KEY  (id),
			KEY user_id (user_id),
			KEY category_id (category_id),
			KEY dates (start_date,due_date),
			KEY status (status),
			KEY archived_at (archived_at)
		) $charset;";
		$sql[] = 'CREATE TABLE ' . self::table( 'milestones' ) . " (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			project_id bigint(20) unsigned NOT NULL,
			name varchar(180) NOT NULL,
			milestone_date date NOT NULL,
			is_completed tinyint(1) NOT NULL DEFAULT 0,
			notes text DEFAULT NULL,
			created_at datetime NOT NULL,
			updated_at datetime NOT NULL,
			PRIMARY KEY  (id),
			KEY project_id (project_id)
		) $charset;";
		$sql[] = 'CREATE TABLE ' . self::table( 'dependencies' ) . " (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			project_id bigint(20) unsigned NOT NULL,
			depends_on_project_id bigint(20) unsigned NOT NULL,
			created_at datetime NOT NULL,
			PRIMARY KEY  (id),
			UNIQUE KEY project_dependency (project_id,depends_on_project_id),
			KEY depends_on (depends_on_project_id)
		) $charset;";
		$sql[] = 'CREATE TABLE ' . self::table( 'activities' ) . " (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			project_id bigint(20) unsigned DEFAULT NULL,
			user_id bigint(20) unsigned NOT NULL,
			action varchar(80) NOT NULL,
			old_value longtext DEFAULT NULL,
			new_value longtext DEFAULT NULL,
			created_at datetime NOT NULL,
			PRIMARY KEY  (id),
			KEY project_id (project_id),
			KEY user_id (user_id),
			KEY created_at (created_at)
		) $charset;";
		$sql[] = 'CREATE TABLE ' . self::table( 'reminders' ) . " (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			project_id bigint(20) unsigned NOT NULL,
			remind_at datetime NOT NULL,
			channel varchar(30) NOT NULL DEFAULT 'in_app',
			is_sent tinyint(1) NOT NULL DEFAULT 0,
			created_at datetime NOT NULL,
			PRIMARY KEY  (id),
			KEY project_id (project_id),
			KEY remind_at (remind_at)
		) $charset;";

		foreach ( $sql as $statement ) {
			dbDelta( $statement );
		}

		self::seed_categories();
		update_option( 'doa_hazirah_db_version', DOA_HAZIRAH_VERSION, false );
		if ( defined( 'DOA_HAZIRAH_INITIAL_PASSWORD_HASH' ) ) {
			self::seed_user_hash( DOA_HAZIRAH_INITIAL_PASSWORD_HASH );
		}
	}

	private static function seed_categories() {
		global $wpdb;
		$table = self::table( 'categories' );
		$count = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table}" );
		if ( $count ) {
			return;
		}
		foreach (
			array(
				array( 'Finance', '#7c5ce7' ),
				array( 'People & Culture', '#ef6f8e' ),
				array( 'Operations', '#2f80ed' ),
				array( 'Digital', '#00a67e' ),
				array( 'Compliance', '#f2a93b' ),
			) as $category
		) {
			$wpdb->insert(
				$table,
				array(
					'name'       => $category[0],
					'color'      => $category[1],
					'created_at' => current_time( 'mysql' ),
				),
				array( '%s', '%s', '%s' )
			);
		}
	}

	public static function seed_user( $password ) {
		$password = (string) $password;
		if ( strlen( $password ) < 4 ) {
			return new WP_Error( 'weak_seed_password', 'A valid initial password is required.' );
		}

		$user = get_user_by( 'login', 'hazi' );
		if ( ! $user ) {
			$user_id = wp_create_user( 'hazi', $password );
			if ( is_wp_error( $user_id ) ) {
				return $user_id;
			}
			$user = get_user_by( 'id', $user_id );
		} else {
			wp_set_password( $password, $user->ID );
			$user = get_user_by( 'id', $user->ID );
		}

		wp_update_user(
			array(
				'ID'           => $user->ID,
				'display_name' => 'Hazirah',
				'first_name'   => 'Hazirah',
				'role'         => 'subscriber',
			)
		);
		$user->add_cap( 'use_hazirah_workspace' );
		update_user_meta( $user->ID, 'doa_hazirah_force_password_change', 1 );
		update_user_meta( $user->ID, 'doa_hazirah_default_year', (int) wp_date( 'Y' ) );
		update_user_meta( $user->ID, 'doa_hazirah_default_reminder', 7 );
		return $user->ID;
	}

	public static function seed_user_hash( $password_hash ) {
		global $wpdb;
		$user = get_user_by( 'login', 'hazi' );
		if ( ! $user ) {
			$user_id = wp_insert_user(
				array(
					'user_login'   => 'hazi',
					'user_pass'    => wp_generate_password( 32, true, true ),
					'display_name' => 'Hazirah',
					'first_name'   => 'Hazirah',
					'role'         => 'subscriber',
				)
			);
			if ( is_wp_error( $user_id ) ) {
				return $user_id;
			}
			$wpdb->update(
				$wpdb->users,
				array( 'user_pass' => (string) $password_hash ),
				array( 'ID' => $user_id ),
				array( '%s' ),
				array( '%d' )
			);
			clean_user_cache( $user_id );
			$user = get_user_by( 'id', $user_id );
			update_user_meta( $user_id, 'doa_hazirah_force_password_change', 1 );
		}
		$user->add_cap( 'use_hazirah_workspace' );
		update_user_meta( $user->ID, 'doa_hazirah_default_year', (int) get_user_meta( $user->ID, 'doa_hazirah_default_year', true ) ?: (int) wp_date( 'Y' ) );
		update_user_meta( $user->ID, 'doa_hazirah_default_reminder', (int) get_user_meta( $user->ID, 'doa_hazirah_default_reminder', true ) ?: 7 );
		return $user->ID;
	}

	public static function log_activity( $project_id, $user_id, $action, $old_value = null, $new_value = null ) {
		global $wpdb;
		$wpdb->insert(
			self::table( 'activities' ),
			array(
				'project_id' => $project_id ?: null,
				'user_id'    => $user_id,
				'action'     => $action,
				'old_value'  => null === $old_value ? null : wp_json_encode( $old_value ),
				'new_value'  => null === $new_value ? null : wp_json_encode( $new_value ),
				'created_at' => current_time( 'mysql' ),
			),
			array( '%d', '%d', '%s', '%s', '%s', '%s' )
		);
	}

	public static function project_conflicts( $project ) {
		global $wpdb;
		$warnings = array();
		if ( $project['due_date'] < $project['start_date'] ) {
			$warnings[] = array( 'type' => 'invalid_dates', 'message' => 'The due date cannot be earlier than the start date.' );
			return $warnings;
		}
		if ( in_array( $project['priority'], array( 'high', 'urgent' ), true ) ) {
			$table = self::table( 'projects' );
			$id    = isset( $project['id'] ) ? (int) $project['id'] : 0;
			$count = (int) $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(*) FROM {$table} WHERE user_id=%d AND id<>%d AND archived_at IS NULL AND priority IN ('high','urgent') AND status NOT IN ('completed','cancelled') AND start_date<=%s AND due_date>=%s",
					$project['user_id'],
					$id,
					$project['due_date'],
					$project['start_date']
				)
			);
			if ( $count ) {
				$warnings[] = array( 'type' => 'overlap', 'message' => sprintf( '%d high-priority item overlaps these dates.', $count ), 'count' => $count );
			}
		}
		if ( substr( $project['start_date'], 0, 4 ) !== substr( $project['due_date'], 0, 4 ) ) {
			$warnings[] = array( 'type' => 'cross_year', 'message' => 'This project crosses into another calendar year.' );
		}
		if ( $project['due_date'] < wp_date( 'Y-m-d' ) && ! in_array( $project['status'], array( 'completed', 'cancelled' ), true ) ) {
			$warnings[] = array( 'type' => 'overdue', 'message' => 'This project is overdue and is not marked complete.' );
		}
		if ( ! empty( $project['id'] ) ) {
			$milestone_count = (int) $wpdb->get_var(
				$wpdb->prepare(
					'SELECT COUNT(*) FROM ' . self::table( 'milestones' ) . ' WHERE project_id=%d AND (milestone_date<%s OR milestone_date>%s)',
					(int) $project['id'],
					$project['start_date'],
					$project['due_date']
				)
			);
			if ( $milestone_count ) {
				$warnings[] = array(
					'type'    => 'milestone_range',
					'message' => sprintf( '%d milestone is outside the project date range.', $milestone_count ),
					'count'   => $milestone_count,
				);
			}

			$dependency_count = (int) $wpdb->get_var(
				$wpdb->prepare(
					'SELECT COUNT(*) FROM ' . self::table( 'dependencies' ) . ' d
					INNER JOIN ' . self::table( 'projects' ) . ' prerequisite ON prerequisite.id=d.depends_on_project_id
					WHERE d.project_id=%d AND prerequisite.status<>%s AND prerequisite.due_date>%s',
					(int) $project['id'],
					'completed',
					$project['start_date']
				)
			);
			if ( $dependency_count ) {
				$warnings[] = array(
					'type'    => 'dependency',
					'message' => sprintf( 'This start date conflicts with %d unfinished prerequisite.', $dependency_count ),
					'count'   => $dependency_count,
				);
			}
		}
		return $warnings;
	}
}
