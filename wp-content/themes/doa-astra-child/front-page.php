<?php
/**
 * Cinematic homepage for DOA Solutions.
 *
 * @package DOA_Solutions
 */

$pain_points = array(
	'Manual booking',
	'Scattered customer records',
	'No live sales visibility',
	'Staff mistakes',
	'Manual workforce tracking',
	'Slow reporting',
	'Repetitive admin work',
);

$modules = array(
	array(
		'title' => 'Booking & Appointment System',
		'meta'  => 'Calendar, slots, reminders',
		'copy'  => 'Replace phone notes and message threads with a clean booking flow your team can trust every day.',
	),
	array(
		'title' => 'Point of Sale & Payment Flow',
		'meta'  => 'Checkout, invoices, counters',
		'copy'  => 'Design fast sales flows for walk-ins, services, products, packages, and repeat customers.',
	),
	array(
		'title' => 'Customer Records & History',
		'meta'  => 'Profiles, notes, visits',
		'copy'  => 'Keep every customer interaction in one place so your team sees context before they act.',
	),
	array(
		'title' => 'Staff & Role Management',
		'meta'  => 'Access, teams, accountability',
		'copy'  => 'Give each role the right tools while protecting sensitive actions and business data.',
	),
	array(
		'title' => 'Human Resources & Workforce Module',
		'meta'  => 'Attendance, leave, records',
		'copy'  => 'Manage staff profiles, attendance, leave requests, approvals, shift history, and payroll-ready summaries in one structured workflow.',
	),
	array(
		'title' => 'Reporting Dashboard',
		'meta'  => 'Sales, workforce, traffic, performance',
		'copy'  => 'Turn daily activity, staff movement, and business performance into live dashboards that reveal what needs attention.',
	),
	array(
		'title' => 'E-commerce / Product Sales',
		'meta'  => 'Catalog, carts, fulfillment',
		'copy'  => 'Connect your digital storefront to the way your operation actually sells and delivers.',
	),
	array(
		'title' => 'Automation & Notifications',
		'meta'  => 'Alerts, follow-ups, workflows',
		'copy'  => 'Let the system handle reminders, leave approvals, status changes, staff nudges, and repetitive admin loops.',
	),
	array(
		'title' => 'Custom Admin Portal',
		'meta'  => 'One workspace for operations',
		'copy'  => 'Bring the moving parts of your business into a focused control room built around your process.',
	),
);

$process = array(
	'Understand your workflow',
	'Design the system map',
	'Build the core modules',
	'Test with real users',
	'Launch safely',
	'Improve continuously',
);

$cases = array(
	'Clinic operations system',
	'Barbershop point of sale, queue, booking and reporting',
	'Human resources attendance, leave and staff management modules',
	'Event merchandise / auction support',
	'Custom business dashboards',
);

get_header();
?>

<main id="primary" class="doa-home">
	<section class="doa-splash" aria-label="<?php esc_attr_e( 'Enter DOA Solutions website', 'doa-solutions' ); ?>">
		<div class="doa-orbit" aria-hidden="true">
			<span></span><span></span><span></span>
		</div>
		<button class="doa-enter" type="button">
			<span class="doa-enter__kicker"><?php esc_html_e( 'Enter system', 'doa-solutions' ); ?></span>
			<span class="doa-enter__brand"><?php esc_html_e( 'DOA Solutions', 'doa-solutions' ); ?></span>
		</button>
	</section>

	<nav class="doa-nav" aria-label="<?php esc_attr_e( 'Primary', 'doa-solutions' ); ?>">
		<a class="doa-nav__brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">DOA Solutions</a>
		<div class="doa-nav__links">
			<a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>"><?php esc_html_e( 'About', 'doa-solutions' ); ?></a>
			<a href="#modules"><?php esc_html_e( 'Modules', 'doa-solutions' ); ?></a>
			<a href="#process"><?php esc_html_e( 'Process', 'doa-solutions' ); ?></a>
			<a href="#contact"><?php esc_html_e( 'Start', 'doa-solutions' ); ?></a>
		</div>
	</nav>

	<section class="doa-section doa-hero" id="top">
		<div class="doa-hero-bg" aria-hidden="true">
			<div class="doa-system-map">
				<svg class="doa-system-map__links" viewBox="0 0 100 100" preserveAspectRatio="none">
					<path class="doa-system-map__link doa-system-map__link--primary" data-route="ops-booking" d="M50 46 C38 36 28 31 16 26" />
					<path class="doa-system-map__link doa-system-map__link--primary" data-route="ops-admin" d="M50 46 C50 34 52 27 55 20" />
					<path class="doa-system-map__link doa-system-map__link--primary" data-route="ops-pos" d="M50 46 C62 34 73 31 86 34" />
					<path class="doa-system-map__link doa-system-map__link--primary" data-route="ops-hr" d="M50 46 C58 52 63 58 67 66" />
					<path class="doa-system-map__link doa-system-map__link--primary" data-route="ops-ecomm" d="M50 46 C70 48 84 55 88 66" />
					<path class="doa-system-map__link doa-system-map__link--primary" data-route="ops-dashboard" d="M50 46 C57 58 60 72 58 86" />
					<path class="doa-system-map__link doa-system-map__link--primary" data-route="ops-crm" d="M50 46 C40 56 35 66 34 78" />
					<path class="doa-system-map__link doa-system-map__link--primary" data-route="ops-automation" d="M50 46 C39 48 31 52 26 58" />
					<path class="doa-system-map__link doa-system-map__link--secondary" data-route="booking-admin" d="M16 26 C28 15 43 14 55 20" />
					<path class="doa-system-map__link doa-system-map__link--secondary" data-route="admin-pos" d="M55 20 C68 17 79 22 86 34" />
					<path class="doa-system-map__link doa-system-map__link--secondary" data-route="pos-ecomm" d="M86 34 C92 47 93 57 88 66" />
					<path class="doa-system-map__link doa-system-map__link--secondary" data-route="ecomm-dashboard" d="M88 66 C80 80 70 87 58 86" />
					<path class="doa-system-map__link doa-system-map__link--secondary" data-route="dashboard-crm" d="M58 86 C50 88 41 84 34 78" />
					<path class="doa-system-map__link doa-system-map__link--secondary" data-route="crm-automation" d="M34 78 C26 74 22 67 26 58" />
					<path class="doa-system-map__link doa-system-map__link--secondary" data-route="automation-booking" d="M26 58 C16 48 13 37 16 26" />
				</svg>
				<div class="doa-system-map__panel doa-system-map__panel--booking"><span>Booking</span><small>Slots</small></div>
				<div class="doa-system-map__panel doa-system-map__panel--pos"><span>Point of Sale</span><small>Sales</small></div>
				<div class="doa-system-map__panel doa-system-map__panel--crm"><span>Customer Records</span><small>History</small></div>
				<div class="doa-system-map__panel doa-system-map__panel--hr"><span>Workforce</span><small>Team</small></div>
				<div class="doa-system-map__panel doa-system-map__panel--ecomm"><span>Online Store</span><small>Orders</small></div>
				<div class="doa-system-map__panel doa-system-map__panel--dashboard"><span>Dashboard</span><small>Reports</small></div>
				<div class="doa-system-map__panel doa-system-map__panel--automation"><span>Automation</span><small>Flows</small></div>
				<div class="doa-system-map__panel doa-system-map__panel--admin"><span>Admin Portal</span><small>Control</small></div>
				<div class="doa-system-map__core">Operations</div>
				<span class="doa-system-map__node doa-system-map__node--a"></span>
				<span class="doa-system-map__node doa-system-map__node--b"></span>
				<span class="doa-system-map__node doa-system-map__node--c"></span>
			</div>
		</div>
		<h1 class="reveal">Build systems that run your business.</h1>
		<p class="doa-hero__copy reveal">We design custom websites, dashboards, booking systems, point-of-sale flows, customer records, workforce modules, and operational tools for growing businesses.</p>
		<div class="doa-scroll-cue" aria-hidden="true">
			<span>Scroll to explore</span>
			<i></i>
		</div>
	</section>

	<div class="doa-vision-rail" aria-hidden="true"></div>

	<section class="doa-section doa-vision" id="vision">
		<div class="doa-section__marker">Vision</div>
		<div class="doa-vision__grid">
			<h2 class="reveal">From manual work to structured digital operations.</h2>
			<div class="doa-vision__story reveal">
				<p>We help businesses move from messy workflows, scattered records, and fragile spreadsheets into systems that make the next action clear.</p>
				<video class="doa-vision__video" autoplay muted loop playsinline preload="metadata">
					<source src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/video/isometric-data-analysis.webm' ); ?>" type="video/webm" />
				</video>
			</div>
		</div>
	</section>

	<section class="doa-section doa-problems">
		<div class="doa-section__marker">Operational drag</div>
		<div class="doa-problem-track" aria-label="<?php esc_attr_e( 'Operational drag examples', 'doa-solutions' ); ?>">
			<div class="doa-problem-grid">
				<?php for ( $loop = 0; $loop < 3; $loop++ ) : ?>
					<div class="doa-problem-set" <?php echo $loop > 0 ? 'aria-hidden="true"' : ''; ?>>
						<?php foreach ( $pain_points as $index => $point ) : ?>
							<div class="doa-problem reveal">
								<p><?php echo esc_html( $point ); ?></p>
							</div>
						<?php endforeach; ?>
					</div>
				<?php endfor; ?>
			</div>
		</div>
		<h2 class="reveal">Your business grew.<br />Your operations didn't.</h2>
	</section>

	<section class="doa-modules" id="modules">
		<div class="doa-modules__sticky">
			<div class="doa-modules__intro">
				<p class="doa-eyebrow">System modules</p>
				<h2>Each module behaves like a product.</h2>
				<p>We compose the right parts into one business operating layer, then tune it around real staff behavior.</p>
			</div>
			<div class="doa-module-stage" aria-live="polite">
				<?php foreach ( $modules as $index => $module ) : ?>
					<article class="doa-module-card<?php echo 0 === $index ? ' is-active' : ''; ?>" data-module-index="<?php echo esc_attr( $index ); ?>">
						<div class="doa-module-card__number"><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></div>
						<p><?php echo esc_html( $module['meta'] ); ?></p>
						<h3><?php echo esc_html( $module['title'] ); ?></h3>
						<div class="doa-module-card__line" aria-hidden="true"></div>
						<p><?php echo esc_html( $module['copy'] ); ?></p>
					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<section class="doa-section doa-process" id="process">
		<div class="doa-section__marker">How we build</div>
		<h2 class="reveal">Serious systems start with the way your business actually works.</h2>
		<div class="doa-process__track">
			<?php foreach ( $process as $index => $step ) : ?>
				<div class="doa-process__step reveal">
					<span><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span>
					<p><?php echo esc_html( $step ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</section>

	<section class="doa-section doa-proof">
		<div class="doa-section__marker">Built around real operations</div>
		<div>
			<h2 class="reveal">Quiet credibility. Practical systems.</h2>
			<p class="reveal">We focus on categories where daily operations need clarity, speed, and accountability.</p>
		</div>
		<div class="doa-proof__list">
			<?php foreach ( $cases as $case ) : ?>
				<div class="doa-proof__item reveal"><?php echo esc_html( $case ); ?></div>
			<?php endforeach; ?>
		</div>
	</section>

	<section class="doa-section doa-final" id="contact">
		<div class="doa-final__halo" aria-hidden="true"></div>
		<p class="doa-eyebrow reveal">Next build</p>
		<h2 class="reveal">Your business should not depend on spreadsheets forever.</h2>
		<a class="doa-button reveal" href="mailto:hello@doasolutions.com">Build with DOA Solutions</a>
	</section>
</main>

<?php
get_footer();
