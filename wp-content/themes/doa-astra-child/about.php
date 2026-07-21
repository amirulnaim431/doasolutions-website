<?php
/**
 * Experimental company manifesto for DOA Solutions.
 *
 * @package DOA_Solutions
 */

$principles = array(
	array( 'n' => '01', 'title' => 'Start with the work', 'copy' => 'The workflow is the brief. We learn how decisions, records and handoffs happen before choosing the technology.' ),
	array( 'n' => '02', 'title' => 'Make complexity legible', 'copy' => 'A powerful system should make the next action clearer—not ask the team to understand the machinery behind it.' ),
	array( 'n' => '03', 'title' => 'Build for change', 'copy' => 'Companies evolve. We create modular operating layers that can grow without rebuilding everything from zero.' ),
	array( 'n' => '04', 'title' => 'Stay after launch', 'copy' => 'Reliable support, iteration and accountability are part of the system—not an optional extra.' ),
);

$services = array( 'Custom business systems', 'Websites & ecommerce', 'Booking & point of sale', 'CRM & customer history', 'Workforce & HR modules', 'Dashboards & reporting', 'Automation & notifications', 'Cloud, network & cybersecurity', 'IT support & maintenance' );

get_header();
?>

<main id="primary" class="doa-site doa-about-v2">
	<a class="doa-skip-link" href="#about-content"><?php esc_html_e( 'Skip to content', 'doa-solutions' ); ?></a>
	<nav class="doa-nav-v2 doa-nav-v2--inverse" aria-label="<?php esc_attr_e( 'Primary navigation', 'doa-solutions' ); ?>">
		<a class="doa-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>"><span class="doa-brand__mark" aria-hidden="true"><img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/images/doa-logo-mark-transparent.png' ); ?>" alt=""></span><span>DOA <b>Solutions</b></span></a>
		<button class="doa-menu-toggle" type="button" aria-expanded="false" aria-controls="doa-about-links">Menu</button>
		<div class="doa-nav-v2__links" id="doa-about-links">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a><a href="#principles">Principles</a><a href="#capability-ledger">Capabilities</a><a href="<?php echo esc_url( home_url( '/showcase/' ) ); ?>">Showcase</a><a class="doa-nav-v2__cta" href="<?php echo esc_url( home_url( '/#contact' ) ); ?>">Talk to us ↗</a>
		</div>
	</nav>

	<section class="doa-about-v2__hero" id="about-content">
		<p class="doa-kicker doa-reveal">About DOA Solutions / Kuala Lumpur</p>
		<h1 class="doa-reveal"><span>WE BUILD</span><span>THE LOGIC</span><span>BEHIND <em>GROWTH.</em></span></h1>
		<div class="doa-about-v2__hero-foot doa-reveal">
			<p>DOA Solutions is an IT systems company building practical digital infrastructure and custom operating tools for growing businesses.</p>
			<span>EST. FOR THE NEXT VERSION →</span>
		</div>
		<div class="doa-about-v2__stamp" aria-hidden="true"><span>DOA</span><small>SYSTEMS / SOLUTIONS / SUPPORT</small></div>
	</section>

	<div class="doa-marquee" aria-hidden="true"><div>UNDERSTAND THE WORK • DESIGN THE SYSTEM • BUILD THE CONTROL • SUPPORT THE GROWTH • UNDERSTAND THE WORK • DESIGN THE SYSTEM • BUILD THE CONTROL • SUPPORT THE GROWTH •</div></div>

	<section class="doa-manifesto">
		<div class="doa-manifesto__aside doa-reveal"><span>NOT A TEMPLATE SHOP.</span><span>NOT SOFTWARE FOR SOFTWARE’S SAKE.</span></div>
		<div class="doa-manifesto__copy doa-reveal">
			<p class="doa-kicker">Our position</p>
			<h2>Technology should fit the business.</h2>
			<p>We bridge business needs and technical execution. The result may be a website, booking flow, admin portal, workforce module, dashboard, network, cloud environment—or the connected system that holds all of it together.</p>
		</div>
	</section>

	<section class="doa-principles-v2" id="principles">
		<div class="doa-section-head doa-reveal"><p class="doa-kicker">Four operating principles</p><h2>How we decide what deserves to be built.</h2></div>
		<div class="doa-principles-v2__grid">
			<?php foreach ( $principles as $principle ) : ?>
				<article class="doa-principle-v2 doa-reveal"><span><?php echo esc_html( $principle['n'] ); ?></span><h3><?php echo esc_html( $principle['title'] ); ?></h3><p><?php echo esc_html( $principle['copy'] ); ?></p></article>
			<?php endforeach; ?>
		</div>
	</section>

	<section class="doa-ledger" id="capability-ledger">
		<div class="doa-ledger__title doa-reveal"><p class="doa-kicker">Capability ledger</p><h2>From infrastructure to interface.</h2><span>One accountable partner.</span></div>
		<ol class="doa-ledger__list">
			<?php foreach ( $services as $index => $service ) : ?>
				<li class="doa-reveal"><span><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span><p><?php echo esc_html( $service ); ?></p></li>
			<?php endforeach; ?>
		</ol>
	</section>

	<section class="doa-about-v2__final">
		<p class="doa-kicker doa-reveal">The next system</p>
		<h2 class="doa-reveal">Bring us the process that no longer works.</h2>
		<a class="doa-button doa-button--primary doa-reveal" href="<?php echo esc_url( home_url( '/#contact' ) ); ?>">Build the better version ↗</a>
		<div class="doa-about-v2__signature" aria-hidden="true">DOA / 2026</div>
	</section>
</main>

<?php get_footer(); ?>
