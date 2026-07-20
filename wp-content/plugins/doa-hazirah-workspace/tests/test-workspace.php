<?php

class DOA_Hazirah_Workspace_Test extends WP_UnitTestCase {
	private $user_id;

	public function set_up() {
		parent::set_up();
		DOA_Hazirah_DB::install();
		DOA_Hazirah_Workspace::add_capability();
		$this->user_id = self::factory()->user->create(
			array(
				'user_login'   => 'workspace-test',
				'user_pass'    => 'correct-test-password',
				'display_name' => 'Hazirah Test',
				'role'         => 'subscriber',
			)
		);
		$user = get_user_by( 'id', $this->user_id );
		$user->add_cap( 'use_hazirah_workspace' );
		wp_set_current_user( $this->user_id );
	}

	private function request( $method, $route, $body = array() ) {
		$request = new WP_REST_Request( $method, $route );
		if ( $body ) {
			$request->set_header( 'content-type', 'application/json' );
			$request->set_body( wp_json_encode( $body ) );
		}
		return rest_do_request( $request );
	}

	private function project_data( $overrides = array() ) {
		return array_merge(
			array(
				'title'       => 'Test annual project',
				'owner'       => 'Hazirah Test',
				'start_date'  => '2026-08-01',
				'due_date'    => '2026-08-15',
				'status'      => 'planned',
				'priority'    => 'high',
				'progress'    => 10,
				'milestones'  => array(),
				'depends_on'  => array(),
			),
			$overrides
		);
	}

	private function owned_project( $id ) {
		global $wpdb;
		return $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . DOA_Hazirah_DB::table( 'projects' ) . ' WHERE id=%d AND user_id=%d',
				$id,
				get_current_user_id()
			),
			ARRAY_A
		);
	}

	public function test_login_success_and_failure() {
		$this->assertInstanceOf( WP_User::class, wp_authenticate( 'workspace-test', 'correct-test-password' ) );
		$this->assertWPError( wp_authenticate( 'workspace-test', 'wrong-password' ) );
	}

	public function test_protected_api_rejects_guest() {
		wp_set_current_user( 0 );
		$response = $this->request( 'GET', '/doa-hazirah/v1/bootstrap' );
		$this->assertSame( 401, $response->get_status() );
	}

	public function test_logout_clears_current_user() {
		wp_logout();
		$this->assertFalse( is_user_logged_in() );
	}

	public function test_project_creation_edit_and_date_adjustment() {
		$created = $this->request( 'POST', '/doa-hazirah/v1/projects', $this->project_data() );
		$this->assertSame( 201, $created->get_status() );
		$id = $created->get_data()['id'];

		$updated = $this->request(
			'PUT',
			'/doa-hazirah/v1/projects/' . $id,
			$this->project_data(
				array(
					'title'      => 'Updated annual project',
					'start_date' => '2026-08-04',
					'due_date'   => '2026-08-20',
					'progress'   => 45,
				)
			)
		);
		$this->assertSame( 200, $updated->get_status() );
		$project = $this->owned_project( $id );
		$this->assertSame( '2026-08-04', $project['start_date'] );
		$this->assertSame( '2026-08-20', $project['due_date'] );
	}

	public function test_invalid_date_range_is_rejected() {
		$response = $this->request(
			'POST',
			'/doa-hazirah/v1/projects',
			$this->project_data( array( 'start_date' => '2026-09-20', 'due_date' => '2026-09-01' ) )
		);
		$this->assertSame( 422, $response->get_status() );
		$this->assertSame( 'invalid_date_range', $response->get_data()['code'] );
	}

	public function test_completion_reopening_archiving_and_restoration() {
		$created = $this->request( 'POST', '/doa-hazirah/v1/projects', $this->project_data() );
		$id      = $created->get_data()['id'];
		foreach ( array( 'complete', 'reopen', 'archive', 'restore' ) as $action ) {
			$response = $this->request( 'POST', "/doa-hazirah/v1/projects/$id/action", array( 'action' => $action ) );
			$this->assertSame( 200, $response->get_status() );
		}
	}

	public function test_cross_year_project_returns_warning_and_filter_finds_it() {
		$created = $this->request(
			'POST',
			'/doa-hazirah/v1/projects',
			$this->project_data( array( 'start_date' => '2026-12-15', 'due_date' => '2027-01-20' ) )
		);
		$warnings = $created->get_data()['warnings'];
		$this->assertContains( 'cross_year', wp_list_pluck( $warnings, 'type' ) );

		$response = $this->request( 'GET', '/doa-hazirah/v1/projects?year=2027' );
		$this->assertNotEmpty( $response->get_data()['projects'] );
	}

	public function test_password_change_requires_current_password() {
		$wrong = $this->request(
			'PUT',
			'/doa-hazirah/v1/settings/password',
			array(
				'current_password' => 'wrong-password',
				'new_password'     => 'a-new-secure-password',
				'confirm_password' => 'a-new-secure-password',
			)
		);
		$this->assertSame( 422, $wrong->get_status() );

		$valid = $this->request(
			'PUT',
			'/doa-hazirah/v1/settings/password',
			array(
				'current_password' => 'correct-test-password',
				'new_password'     => 'a-new-secure-password',
				'confirm_password' => 'a-new-secure-password',
			)
		);
		$this->assertSame( 200, $valid->get_status() );
	}
}
