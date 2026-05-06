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
		'title' => 'POS & Payment Flow',
		'meta'  => 'Checkout, invoices, counters',
		'copy'  => 'Design fast sales flows for walk-ins, services, products, packages, and repeat customers.',
	),
	array(
		'title' => 'CRM & Customer History',
		'meta'  => 'Profiles, notes, visits',
		'copy'  => 'Keep every customer interaction in one place so your team sees context before they act.',
	),
	array(
		'title' => 'Staff & Role Management',
		'meta'  => 'Access, teams, accountability',
		'copy'  => 'Give each role the right tools while protecting sensitive actions and business data.',
	),
	array(
		'title' => 'Reporting Dashboard',
		'meta'  => 'Sales, traffic, performance',
		'copy'  => 'Turn daily activity into live dashboards that reveal what is working and what needs attention.',
	),
	array(
		'title' => 'E-commerce / Product Sales',
		'meta'  => 'Catalog, carts, fulfillment',
		'copy'  => 'Connect your digital storefront to the way your operation actually sells and delivers.',
	),
	array(
		'title' => 'Automation & Notifications',
		'meta'  => 'Alerts, follow-ups, workflows',
		'copy'  => 'Let the system handle reminders, status changes, staff nudges, and repetitive admin loops.',
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
	'Barbershop POS, queue, booking and reporting',
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
		<a class="doa-nav__brand doa-nav__brand--logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/images/doa-logo-icon-glow.png' ); ?>" alt="DOA Solutions" width="42" height="42">
		</a>
		<div class="doa-nav__links">
			<a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>"><?php esc_html_e( 'About', 'doa-solutions' ); ?></a>
			<a href="#modules"><?php esc_html_e( 'Modules', 'doa-solutions' ); ?></a>
			<a href="#process"><?php esc_html_e( 'Process', 'doa-solutions' ); ?></a>
			<a href="#contact"><?php esc_html_e( 'Start', 'doa-solutions' ); ?></a>
		</div>
	</nav>

	<section class="doa-section doa-hero" id="top">
		<div class="doa-ambient" aria-hidden="true"></div>
		<p class="doa-eyebrow reveal">D O A Solutions</p>
		<h1 class="reveal">Build systems that run your business.</h1>
		<p class="doa-hero__copy reveal">We design custom websites, dashboards, booking systems, POS, CRM, and operational tools for growing businesses.</p>
		<div class="doa-actions reveal">
			<a class="doa-button" href="#contact">Start a project</a>
			<a class="doa-button doa-button--ghost" href="#modules">Explore modules</a>
		</div>
		<div class="doa-scroll-cue" aria-hidden="true">Scroll to explore</div>
	</section>

	<section class="doa-section doa-vision">
		<div class="doa-section__marker">Vision</div>
		<div class="doa-vision__grid">
			<h2 class="reveal">From manual work to structured digital operations.</h2>
			<p class="reveal">We help businesses move from messy workflows, scattered records, and fragile spreadsheets into systems that make the next action clear.</p>
		</div>
	</section>

	<section class="doa-section doa-problems">
		<div class="doa-section__marker">Operational drag</div>
		<h2 class="reveal">The work is growing, but the tools are still improvised.</h2>
		<div class="doa-problem-grid">
			<?php foreach ( $pain_points as $index => $point ) : ?>
				<div class="doa-problem reveal">
					<span><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span>
					<p><?php echo esc_html( $point ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
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
