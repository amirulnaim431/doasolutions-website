<?php
/**
 * Code-managed About page for DOA Solutions.
 *
 * @package DOA_Solutions
 */

$services = array(
	'IT infrastructure solutions',
	'Network setup and management',
	'Cloud setup, migration, and management',
	'System integration',
	'IT support and maintenance',
	'Hardware and software supply',
	'Cybersecurity solutions',
	'Custom business systems and software',
);

$packages = array(
	array(
		'name'  => 'Bronze',
		'label' => 'Starting basic structure',
		'items' => array( 'Simple website', 'Mobile friendly', 'Single-service booking', 'Light CRM', 'Daily summary reporting' ),
	),
	array(
		'name'  => 'Silver',
		'label' => 'Structured operations',
		'items' => array( 'Full service website', 'Staff assignment booking', 'Customer history and basic loyalty', 'Basic POS and payments', 'Daily / weekly reporting' ),
	),
	array(
		'name'  => 'Gold',
		'label' => 'Automation and growth',
		'items' => array( 'Advanced booking logic', 'Error-proof POS flow', 'Advanced CRM', 'Staff, sales, and performance reporting', 'WhatsApp notifications and workflows' ),
	),
	array(
		'name'  => 'Platinum',
		'label' => 'Fully custom system',
		'items' => array( 'No-template custom build', 'Tailored operational workflows', 'Role-based staff systems', 'CEO / management dashboards', 'Deep integrations and custom automation' ),
	),
);

get_header();
?>

<main id="primary" class="doa-home doa-about">
	<nav class="doa-nav" aria-label="<?php esc_attr_e( 'Primary', 'doa-solutions' ); ?>">
		<a class="doa-nav__brand doa-nav__brand--logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/images/doa-logo-icon-glow.png' ); ?>" alt="DOA Solutions" width="42" height="42">
		</a>
		<div class="doa-nav__links">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'doa-solutions' ); ?></a>
			<a href="#services"><?php esc_html_e( 'Services', 'doa-solutions' ); ?></a>
			<a href="#packages"><?php esc_html_e( 'Packages', 'doa-solutions' ); ?></a>
			<a href="mailto:hello@doasolutions.com"><?php esc_html_e( 'Contact', 'doa-solutions' ); ?></a>
		</div>
	</nav>

	<section class="doa-section doa-about-hero">
		<div class="doa-ambient" aria-hidden="true"></div>
		<p class="doa-eyebrow reveal">About DOA Solutions</p>
		<h1 class="reveal">Empowering your future with every solution.</h1>
		<p class="doa-hero__copy reveal">We are a forward-thinking IT system solutions provider building reliable digital infrastructure, business systems, automation, and custom software for companies that need stronger operations.</p>
	</section>

	<section class="doa-section doa-about-split">
		<div class="doa-section__marker">Company</div>
		<h2 class="reveal">Technology should fit the business, not force the business to fit the tool.</h2>
		<div class="doa-about-copy reveal">
			<p>DOA Solutions bridges the gap between technology and business needs by designing, implementing, and managing systems shaped around each client’s real workflow.</p>
			<p>Our work supports businesses that need reliable IT systems, stronger cybersecurity, scalable technology, and practical digital operations that can grow with them.</p>
		</div>
	</section>

	<section class="doa-section doa-about-principles">
		<div class="doa-section__marker">Mission / Vision</div>
		<div class="doa-principle reveal">
			<span>Mission</span>
			<p>To provide reliable and innovative IT solutions that help businesses grow and operate efficiently.</p>
		</div>
		<div class="doa-principle reveal">
			<span>Vision</span>
			<p>To be a trusted leader in IT services, delivering excellence and driving digital success.</p>
		</div>
	</section>

	<section class="doa-section doa-services" id="services">
		<div class="doa-section__marker">Products and services</div>
		<h2 class="reveal">Infrastructure, systems, support, and automation under one roof.</h2>
		<div class="doa-service-grid">
			<?php foreach ( $services as $service ) : ?>
				<div class="doa-service reveal"><?php echo esc_html( $service ); ?></div>
			<?php endforeach; ?>
		</div>
	</section>

	<section class="doa-section doa-advantage">
		<div class="doa-section__marker">Advantage</div>
		<h2 class="reveal">Fast response, proactive support, long-term partnership.</h2>
		<p class="reveal">We combine technical expertise with industry understanding to deliver secure, scalable, cost-effective systems without compromising quality. The goal is simple: less downtime, more clarity, and better tools for the people running the business.</p>
	</section>

	<section class="doa-section doa-packages" id="packages">
		<div class="doa-section__marker">Packages</div>
		<h2 class="reveal">Built from real business workflows, not generic templates.</h2>
		<div class="doa-package-grid">
			<?php foreach ( $packages as $package ) : ?>
				<article class="doa-package reveal">
					<p><?php echo esc_html( $package['label'] ); ?></p>
					<h3><?php echo esc_html( $package['name'] ); ?></h3>
					<ul>
						<?php foreach ( $package['items'] as $item ) : ?>
							<li><?php echo esc_html( $item ); ?></li>
						<?php endforeach; ?>
					</ul>
				</article>
			<?php endforeach; ?>
		</div>
	</section>

	<section class="doa-section doa-final">
		<div class="doa-final__halo" aria-hidden="true"></div>
		<p class="doa-eyebrow reveal">Work with us</p>
		<h2 class="reveal">Let’s build the system your business actually needs.</h2>
		<a class="doa-button reveal" href="mailto:hello@doasolutions.com">Start a project</a>
	</section>
</main>

<?php
get_footer();
