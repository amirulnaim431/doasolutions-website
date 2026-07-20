<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class DOA_Hazirah_API {
	const NS = 'doa-hazirah/v1';

	public static function register_routes() {
		register_rest_route(
			self::NS,
			'/bootstrap',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'bootstrap' ),
				'permission_callback' => array( __CLASS__, 'can_access' ),
			)
		);
		register_rest_route(
			self::NS,
			'/projects',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( __CLASS__, 'projects' ),
					'permission_callback' => array( __CLASS__, 'can_access' ),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( __CLASS__, 'create_project' ),
					'permission_callback' => array( __CLASS__, 'can_access' ),
				),
			)
		);
		register_rest_route(
			self::NS,
			'/projects/(?P<id>\d+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( __CLASS__, 'update_project' ),
					'permission_callback' => array( __CLASS__, 'can_access' ),
				),
			)
		);
		register_rest_route(
			self::NS,
			'/projects/(?P<id>\d+)/action',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'project_action' ),
				'permission_callback' => array( __CLASS__, 'can_access' ),
			)
		);
		register_rest_route(
			self::NS,
			'/settings/profile',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( __CLASS__, 'profile' ),
				'permission_callback' => array( __CLASS__, 'can_access' ),
			)
		);
		register_rest_route(
			self::NS,
			'/settings/password',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( __CLASS__, 'password' ),
				'permission_callback' => array( __CLASS__, 'can_access' ),
			)
		);
	}

	public static function can_access() {
		return is_user_logged_in() && current_user_can( 'use_hazirah_workspace' );
	}

	private static function json_error( $message, $status = 400, $code = 'invalid_request' ) {
		return new WP_Error( $code, $message, array( 'status' => $status ) );
	}

	private static function project_rows( $request = null ) {
		global $wpdb;
		$user_id  = get_current_user_id();
		$projects = DOA_Hazirah_DB::table( 'projects' );
		$where    = array( $wpdb->prepare( 'p.user_id = %d', $user_id ) );
		$params   = $request instanceof WP_REST_Request ? $request->get_params() : array();

		if ( empty( $params['include_archived'] ) ) {
			$where[] = 'p.archived_at IS NULL';
		}
		if ( ! empty( $params['year'] ) ) {
			$year    = max( 2000, min( 2100, (int) $params['year'] ) );
			$where[] = $wpdb->prepare( '(p.start_date IS NULL OR p.due_date IS NULL OR (p.start_date <= %s AND p.due_date >= %s))', "$year-12-31", "$year-01-01" );
		}
		if ( ! empty( $params['status'] ) && isset( DOA_Hazirah_DB::statuses()[ $params['status'] ] ) ) {
			$where[] = $wpdb->prepare( 'p.status = %s', sanitize_key( $params['status'] ) );
		}
		if ( ! empty( $params['priority'] ) && isset( DOA_Hazirah_DB::priorities()[ $params['priority'] ] ) ) {
			$where[] = $wpdb->prepare( 'p.priority = %s', sanitize_key( $params['priority'] ) );
		}
		if ( ! empty( $params['search'] ) ) {
			$like    = '%' . $wpdb->esc_like( sanitize_text_field( $params['search'] ) ) . '%';
			$where[] = $wpdb->prepare( '(p.title LIKE %s OR p.description LIKE %s OR p.client_department LIKE %s)', $like, $like, $like );
		}

		$sql  = "SELECT p.* FROM {$projects} p
			WHERE " . implode( ' AND ', $where ) . ' ORDER BY p.start_date ASC, p.priority DESC';
		$rows = $wpdb->get_results( $sql, ARRAY_A );
		if ( ! $rows ) {
			return array();
		}
		$ids          = array_map( 'intval', wp_list_pluck( $rows, 'id' ) );
		$placeholders = implode( ',', array_fill( 0, count( $ids ), '%d' ) );
		$stages       = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT id,project_id,stage_key,stage_name,start_date,end_date,is_completed,sort_order FROM ' . DOA_Hazirah_DB::table( 'stages' ) . " WHERE project_id IN ($placeholders) ORDER BY sort_order",
				$ids
			),
			ARRAY_A
		);
		foreach ( $rows as &$row ) {
			$row['id']          = (int) $row['id'];
			$row['progress']    = (int) $row['progress'];
			$row['archived']    = null !== $row['archived_at'];
			$row['start_date']  = empty( $row['start_date'] ) || '0000-00-00' === $row['start_date'] ? '' : $row['start_date'];
			$row['due_date']    = empty( $row['due_date'] ) || '0000-00-00' === $row['due_date'] ? '' : $row['due_date'];
			$row['stages']      = array_values( array_map(
				static function ( $stage ) {
					$stage['id']           = (int) $stage['id'];
					$stage['project_id']   = (int) $stage['project_id'];
					$stage['is_completed'] = (bool) $stage['is_completed'];
					$stage['sort_order']   = (int) $stage['sort_order'];
					$stage['start_date']   = $stage['start_date'] ?: '';
					$stage['end_date']     = $stage['end_date'] ?: '';
					return $stage;
				},
				array_filter( $stages, fn( $item ) => (int) $item['project_id'] === $row['id'] )
			) );
			if ( ! $row['stages'] ) {
				$order = 0;
				foreach ( DOA_Hazirah_DB::stages() as $key => $name ) {
					$row['stages'][] = array(
						'id'           => 0,
						'project_id'   => $row['id'],
						'stage_key'    => $key,
						'stage_name'   => $name,
						'start_date'   => '',
						'end_date'     => '',
						'is_completed' => false,
						'sort_order'   => $order++,
					);
				}
			}
			$row['warnings']    = DOA_Hazirah_DB::project_conflicts( array_merge( $row, array( 'user_id' => $user_id ) ) );
		}
		unset( $row );
		return $rows;
	}

	public static function bootstrap( WP_REST_Request $request ) {
		global $wpdb;
		$user       = wp_get_current_user();
		$projects   = self::project_rows( $request );
		$today      = wp_date( 'Y-m-d' );
		$month_end  = wp_date( 'Y-m-t' );
		$summary    = array(
			'active'         => count( array_filter( $projects, fn( $p ) => ! in_array( $p['status'], array( 'completed', 'cancelled' ), true ) ) ),
			'due_this_month' => count( array_filter( $projects, fn( $p ) => ! empty( $p['due_date'] ) && $p['due_date'] >= $today && $p['due_date'] <= $month_end && 'completed' !== $p['status'] ) ),
			'upcoming'       => count( array_filter( $projects, fn( $p ) => ! empty( $p['start_date'] ) && $p['start_date'] > $today && 'completed' !== $p['status'] ) ),
			'completed'      => count( array_filter( $projects, fn( $p ) => 'completed' === $p['status'] ) ),
			'overdue'        => count( array_filter( $projects, fn( $p ) => ! empty( $p['due_date'] ) && $p['due_date'] < $today && ! in_array( $p['status'], array( 'completed', 'cancelled' ), true ) ) ),
		);
		$activity = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT a.id,a.project_id,a.action,a.old_value,a.new_value,a.created_at,p.title,u.display_name
				FROM ' . DOA_Hazirah_DB::table( 'activities' ) . ' a
				LEFT JOIN ' . DOA_Hazirah_DB::table( 'projects' ) . ' p ON p.id=a.project_id
				LEFT JOIN ' . $wpdb->users . ' u ON u.ID=a.user_id
				WHERE a.user_id=%d ORDER BY a.created_at DESC LIMIT 20',
				$user->ID
			),
			ARRAY_A
		);
		return rest_ensure_response(
			array(
				'projects'   => $projects,
				'summary'    => $summary,
				'activity'   => $activity,
				'settings'   => array(
					'display_name'     => $user->display_name,
					'default_year'     => (int) get_user_meta( $user->ID, 'doa_hazirah_default_year', true ) ?: (int) wp_date( 'Y' ),
					'reminder_days'    => (int) get_user_meta( $user->ID, 'doa_hazirah_default_reminder', true ) ?: 7,
					'force_password'   => (bool) get_user_meta( $user->ID, 'doa_hazirah_force_password_change', true ),
				),
			)
		);
	}

	public static function projects( WP_REST_Request $request ) {
		return rest_ensure_response( array( 'projects' => self::project_rows( $request ) ) );
	}

	private static function clean_stages( WP_REST_Request $request ) {
		$data     = $request->get_json_params();
		$incoming = isset( $data['stages'] ) && is_array( $data['stages'] ) ? $data['stages'] : array();
		$by_key   = array();
		foreach ( $incoming as $stage ) {
			$key = sanitize_key( $stage['stage_key'] ?? '' );
			if ( isset( DOA_Hazirah_DB::stages()[ $key ] ) ) {
				$by_key[ $key ] = $stage;
			}
		}

		$clean = array();
		$order = 0;
		foreach ( DOA_Hazirah_DB::stages() as $key => $name ) {
			$stage = $by_key[ $key ] ?? array();
			$start = sanitize_text_field( $stage['start_date'] ?? '' );
			$end   = sanitize_text_field( $stage['end_date'] ?? '' );
			if ( $start && ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $start ) ) {
				return self::json_error( sprintf( 'Please choose a valid start date for %s.', $name ) );
			}
			if ( $end && ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $end ) ) {
				return self::json_error( sprintf( 'Please choose a valid deadline for %s.', $name ) );
			}
			if ( $start && $end && $end < $start ) {
				return self::json_error( sprintf( '%s cannot end before it starts.', $name ), 422, 'invalid_stage_range' );
			}
			$clean[] = array(
				'stage_key'    => $key,
				'stage_name'   => $name,
				'start_date'   => $start ?: null,
				'end_date'     => $end ?: null,
				'is_completed' => ! empty( $stage['is_completed'] ) ? 1 : 0,
				'sort_order'   => $order++,
			);
		}
		return $clean;
	}

	private static function clean_project( WP_REST_Request $request, $existing = null, $stages = array() ) {
		$statuses   = DOA_Hazirah_DB::statuses();
		$priorities = DOA_Hazirah_DB::priorities();
		$data       = $request->get_json_params();
		$title      = sanitize_text_field( $data['title'] ?? ( $existing['title'] ?? '' ) );
		$status     = sanitize_key( $data['status'] ?? ( $existing['status'] ?? 'planned' ) );
		$priority   = sanitize_key( $data['priority'] ?? ( $existing['priority'] ?? 'medium' ) );
		$starts     = array_values( array_filter( wp_list_pluck( $stages, 'start_date' ) ) );
		$ends       = array_values( array_filter( wp_list_pluck( $stages, 'end_date' ) ) );
		$start      = $starts ? min( $starts ) : null;
		$due        = $ends ? max( $ends ) : null;
		$completed  = count( array_filter( $stages, fn( $stage ) => ! empty( $stage['is_completed'] ) ) );
		$progress   = (int) round( ( $completed / max( 1, count( DOA_Hazirah_DB::stages() ) ) ) * 100 );

		if ( '' === $title ) {
			return self::json_error( 'Please add a project title.' );
		}
		if ( ! isset( $statuses[ $status ] ) || ! isset( $priorities[ $priority ] ) ) {
			return self::json_error( 'Please choose a valid status and priority.' );
		}
		return array(
			'title'             => $title,
			'description'       => sanitize_textarea_field( $data['description'] ?? ( $existing['description'] ?? '' ) ),
			'category_id'       => null,
			'owner'             => sanitize_text_field( $data['owner'] ?? ( $existing['owner'] ?? wp_get_current_user()->display_name ) ),
			'client_department' => sanitize_text_field( $data['client_department'] ?? ( $existing['client_department'] ?? '' ) ),
			'start_date'        => $start,
			'due_date'          => $due,
			'status'            => $status,
			'priority'          => $priority,
			'progress'          => $progress,
			'notes'             => sanitize_textarea_field( $data['notes'] ?? ( $existing['notes'] ?? '' ) ),
			'completed_date'    => 'completed' === $status ? sanitize_text_field( $data['completed_date'] ?? wp_date( 'Y-m-d' ) ) : null,
		);
	}

	private static function get_owned_project( $id ) {
		global $wpdb;
		return $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . DOA_Hazirah_DB::table( 'projects' ) . ' WHERE id=%d AND user_id=%d',
				absint( $id ),
				get_current_user_id()
			),
			ARRAY_A
		);
	}

	public static function create_project( WP_REST_Request $request ) {
		global $wpdb;
		$stages = self::clean_stages( $request );
		if ( is_wp_error( $stages ) ) {
			return $stages;
		}
		$project = self::clean_project( $request, null, $stages );
		if ( is_wp_error( $project ) ) {
			return $project;
		}
		$project['user_id']    = get_current_user_id();
		$project['created_at'] = current_time( 'mysql' );
		$project['updated_at'] = current_time( 'mysql' );
		$result                = $wpdb->insert( DOA_Hazirah_DB::table( 'projects' ), $project );
		if ( false === $result ) {
			return self::json_error( 'The project could not be saved. Please try again.', 500, 'database_error' );
		}
		$id = (int) $wpdb->insert_id;
		self::sync_stages( $id, $stages );
		DOA_Hazirah_DB::log_activity( $id, get_current_user_id(), 'Project created', null, $project );
		return new WP_REST_Response( array( 'message' => 'Project created.', 'id' => $id, 'warnings' => DOA_Hazirah_DB::project_conflicts( array_merge( $project, array( 'id' => $id ) ) ) ), 201 );
	}

	public static function update_project( WP_REST_Request $request ) {
		global $wpdb;
		$existing = self::get_owned_project( $request['id'] );
		if ( ! $existing ) {
			return self::json_error( 'Project not found.', 404, 'not_found' );
		}
		$stages = self::clean_stages( $request );
		if ( is_wp_error( $stages ) ) {
			return $stages;
		}
		$project = self::clean_project( $request, $existing, $stages );
		if ( is_wp_error( $project ) ) {
			return $project;
		}
		$project['updated_at'] = current_time( 'mysql' );
		$wpdb->query( 'START TRANSACTION' );
		$result = $wpdb->update( DOA_Hazirah_DB::table( 'projects' ), $project, array( 'id' => (int) $existing['id'], 'user_id' => get_current_user_id() ) );
		if ( false === $result ) {
			$wpdb->query( 'ROLLBACK' );
			return self::json_error( 'The project could not be updated.', 500, 'database_error' );
		}
		self::sync_stages( (int) $existing['id'], $stages );
		$changed = array();
		foreach ( $project as $key => $value ) {
			if ( array_key_exists( $key, $existing ) && (string) $existing[ $key ] !== (string) $value ) {
				$changed[ $key ] = array( 'from' => $existing[ $key ], 'to' => $value );
			}
		}
		DOA_Hazirah_DB::log_activity( (int) $existing['id'], get_current_user_id(), isset( $changed['start_date'] ) || isset( $changed['due_date'] ) ? 'Dates changed' : 'Project updated', $existing, $project );
		$wpdb->query( 'COMMIT' );
		$project['id']      = (int) $existing['id'];
		$project['user_id'] = get_current_user_id();
		return rest_ensure_response( array( 'message' => 'Changes saved.', 'warnings' => DOA_Hazirah_DB::project_conflicts( $project ) ) );
	}

	private static function sync_stages( $project_id, $stages ) {
		global $wpdb;
		$wpdb->delete( DOA_Hazirah_DB::table( 'stages' ), array( 'project_id' => $project_id ), array( '%d' ) );
		foreach ( $stages as $stage ) {
			$wpdb->insert(
				DOA_Hazirah_DB::table( 'stages' ),
				array_merge(
					$stage,
					array(
						'project_id' => $project_id,
						'created_at' => current_time( 'mysql' ),
						'updated_at' => current_time( 'mysql' ),
					)
				)
			);
		}
	}

	public static function project_action( WP_REST_Request $request ) {
		global $wpdb;
		$project = self::get_owned_project( $request['id'] );
		if ( ! $project ) {
			return self::json_error( 'Project not found.', 404, 'not_found' );
		}
		$data   = $request->get_json_params();
		$action = sanitize_key( $data['action'] ?? '' );
		$now    = current_time( 'mysql' );
		$update = array( 'updated_at' => $now );
		$label  = '';
		switch ( $action ) {
			case 'complete':
				$update += array( 'status' => 'completed', 'progress' => 100, 'completed_date' => wp_date( 'Y-m-d' ) );
				$wpdb->update(
					DOA_Hazirah_DB::table( 'stages' ),
					array( 'is_completed' => 1, 'updated_at' => $now ),
					array( 'project_id' => (int) $project['id'] )
				);
				$label   = 'Project completed';
				break;
			case 'reopen':
				$update += array( 'status' => 'in_progress', 'progress' => 80, 'completed_date' => null );
				$wpdb->update(
					DOA_Hazirah_DB::table( 'stages' ),
					array( 'is_completed' => 0, 'updated_at' => $now ),
					array( 'project_id' => (int) $project['id'], 'stage_key' => 'report' )
				);
				$label   = 'Project reopened';
				break;
			case 'archive':
				$update['archived_at'] = $now;
				$label                 = 'Project archived';
				break;
			case 'restore':
				$update['archived_at'] = null;
				$label                 = 'Project restored';
				break;
			case 'duplicate':
				$copy               = $project;
				$copy['title']      = $project['title'] . ' (Copy)';
				$copy['status']     = 'planned';
				$copy['progress']   = 0;
				$copy['completed_date'] = null;
				$copy['archived_at'] = null;
				$copy['created_at'] = $now;
				$copy['updated_at'] = $now;
				unset( $copy['id'] );
				$wpdb->insert( DOA_Hazirah_DB::table( 'projects' ), $copy );
				$new_id = (int) $wpdb->insert_id;
				$source_stages = $wpdb->get_results(
					$wpdb->prepare(
						'SELECT stage_key,stage_name,start_date,end_date,sort_order FROM ' . DOA_Hazirah_DB::table( 'stages' ) . ' WHERE project_id=%d ORDER BY sort_order',
						(int) $project['id']
					),
					ARRAY_A
				);
				foreach ( $source_stages as $stage ) {
					$wpdb->insert(
						DOA_Hazirah_DB::table( 'stages' ),
						array_merge(
							$stage,
							array(
								'project_id'   => $new_id,
								'is_completed' => 0,
								'created_at'   => $now,
								'updated_at'   => $now,
							)
						)
					);
				}
				DOA_Hazirah_DB::log_activity( $new_id, get_current_user_id(), 'Project duplicated', $project['id'], $new_id );
				return new WP_REST_Response( array( 'message' => 'Project duplicated.', 'id' => $new_id ), 201 );
			default:
				return self::json_error( 'Unknown project action.' );
		}
		$wpdb->update( DOA_Hazirah_DB::table( 'projects' ), $update, array( 'id' => (int) $project['id'], 'user_id' => get_current_user_id() ) );
		DOA_Hazirah_DB::log_activity( (int) $project['id'], get_current_user_id(), $label, $project, $update );
		return rest_ensure_response( array( 'message' => $label . '.' ) );
	}

	public static function profile( WP_REST_Request $request ) {
		$data = $request->get_json_params();
		$name = sanitize_text_field( $data['display_name'] ?? '' );
		$year = max( 2000, min( 2100, (int) ( $data['default_year'] ?? wp_date( 'Y' ) ) ) );
		$days = max( 0, min( 90, (int) ( $data['reminder_days'] ?? 7 ) ) );
		if ( '' === $name ) {
			return self::json_error( 'Display name is required.' );
		}
		$user_id = get_current_user_id();
		wp_update_user( array( 'ID' => $user_id, 'display_name' => $name ) );
		update_user_meta( $user_id, 'doa_hazirah_default_year', $year );
		update_user_meta( $user_id, 'doa_hazirah_default_reminder', $days );
		return rest_ensure_response( array( 'message' => 'Profile settings saved.' ) );
	}

	public static function password( WP_REST_Request $request ) {
		$data    = $request->get_json_params();
		$current = (string) ( $data['current_password'] ?? '' );
		$new     = (string) ( $data['new_password'] ?? '' );
		$confirm = (string) ( $data['confirm_password'] ?? '' );
		$user    = wp_get_current_user();
		if ( ! wp_check_password( $current, $user->user_pass, $user->ID ) ) {
			return self::json_error( 'Your current password is not correct.', 422, 'wrong_password' );
		}
		if ( strlen( $new ) < 10 ) {
			return self::json_error( 'Use at least 10 characters for the new password.', 422, 'weak_password' );
		}
		if ( $new !== $confirm ) {
			return self::json_error( 'The new passwords do not match.', 422, 'password_mismatch' );
		}
		wp_set_password( $new, $user->ID );
		delete_user_meta( $user->ID, 'doa_hazirah_force_password_change' );
		wp_set_current_user( $user->ID );
		wp_set_auth_cookie( $user->ID, true, is_ssl() );
		return rest_ensure_response( array( 'message' => 'Password changed successfully.', 'nonce' => wp_create_nonce( 'wp_rest' ) ) );
	}

}

