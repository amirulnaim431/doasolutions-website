<?php
/**
 * Premium industrial homepage for DOA Solutions.
 *
 * @package DOA_Solutions
 */

$capabilities = array(
	array( 'code' => '01', 'title' => 'Business systems', 'copy' => 'Custom admin portals, dashboards and workflows shaped around the way your team already operates.' ),
	array( 'code' => '02', 'title' => 'Commerce & customer flow', 'copy' => 'Websites, ecommerce, booking, point-of-sale and customer records connected into one practical journey.' ),
	array( 'code' => '03', 'title' => 'Workforce operations', 'copy' => 'Attendance, leave, roles, approvals and payroll-ready reporting without scattered spreadsheets.' ),
	array( 'code' => '04', 'title' => 'Infrastructure & support', 'copy' => 'Network, cloud, hardware, cybersecurity and responsive support that keep the operating layer reliable.' ),
);

$process = array(
	array( 'step' => '01', 'title' => 'Map the operation', 'copy' => 'We trace the real work: people, handoffs, decisions, records and recurring friction.' ),
	array( 'step' => '02', 'title' => 'Design the control layer', 'copy' => 'The right modules are composed into one clear system map before development begins.' ),
	array( 'step' => '03', 'title' => 'Build around behaviour', 'copy' => 'We test the flow with the people who will use it, then remove unnecessary steps.' ),
	array( 'step' => '04', 'title' => 'Launch and improve', 'copy' => 'We deploy safely, support the team and keep refining the system as the business grows.' ),
);

get_header();
?>

<main id="primary" class="doa-site doa-home-v2">
	<a class="doa-skip-link" href="#doa-content"><?php esc_html_e( 'Skip to content', 'doa-solutions' ); ?></a>

	<nav class="doa-nav-v2" aria-label="<?php esc_attr_e( 'Primary navigation', 'doa-solutions' ); ?>">
		<a class="doa-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="DOA Solutions home">
			<span class="doa-brand__mark" aria-hidden="true"><img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/images/doa-logo-mark-transparent.png' ); ?>" alt=""></span>
			<span>DOA <b>Solutions</b></span>
		</a>
		<button class="doa-menu-toggle" type="button" aria-expanded="false" aria-controls="doa-primary-links">Menu</button>
		<div class="doa-nav-v2__links" id="doa-primary-links">
			<a href="#capabilities">Capabilities</a>
			<a href="#method">Method</a>
			<a href="<?php echo esc_url( home_url( '/showcase/' ) ); ?>">Showcase</a>
			<a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>">About</a>
			<a class="doa-nav-v2__cta" href="#contact">Start a project <span aria-hidden="true">↗</span></a>
		</div>
	</nav>

	<section class="doa-hero-v2" id="doa-content">
		<div class="doa-hero-v2__copy">
			<p class="doa-kicker doa-reveal">Digital operations for growing businesses</p>
			<p class="doa-registration">SSM Registration No. 202503146827 (003736059-H)</p>
			<h1 class="doa-reveal">We build the systems <em>behind</em> the business.</h1>
			<p class="doa-hero-v2__lead doa-reveal">DOA Solutions turns manual work, scattered records and disconnected tools into one reliable operating layer—built around your actual workflow.</p>
			<div class="doa-actions doa-reveal">
				<a class="doa-button doa-button--primary" href="#contact">Discuss your operation <span aria-hidden="true">↗</span></a>
				<a class="doa-button doa-button--quiet" href="<?php echo esc_url( home_url( '/showcase/' ) ); ?>">Explore working demos</a>
			</div>
		</div>
		<div class="doa-control-map doa-reveal" aria-label="Connected business operations diagram">
			<canvas id="doa-operations-canvas" aria-hidden="true"></canvas>
			<div class="doa-control-map__head"><span>Operating layer</span><span class="doa-live"><i></i> System online</span></div>
			<div class="doa-control-map__core"><div><img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/images/doa-logo-mark-transparent.png' ); ?>" alt=""><small>CONTROL</small></div></div>
			<ul class="doa-control-map__labels" aria-hidden="true">
				<li style="--x:14%;--y:24%">BOOKING</li><li style="--x:73%;--y:18%">SALES</li>
				<li style="--x:80%;--y:62%">REPORTING</li><li style="--x:10%;--y:72%">WORKFORCE</li>
				<li style="--x:48%;--y:86%">CUSTOMERS</li>
			</ul>
			<div class="doa-control-map__foot"><span>One source of truth</span><span>KL / MY</span></div>
		</div>
		<div class="doa-hero-v2__rail" aria-hidden="true"><span>WEB</span><span>SYSTEMS</span><span>AUTOMATION</span><span>SUPPORT</span></div>
	</section>

	<section class="doa-tension" aria-label="Business challenges">
		<p class="doa-kicker doa-reveal">The operational gap</p>
		<div class="doa-tension__grid">
			<h2 class="doa-reveal">Growth creates complexity.<br><span>Your systems should remove it.</span></h2>
			<div class="doa-tension__copy doa-reveal">
				<p>Manual booking. Repetitive admin. Unclear reporting. Customer history spread across messages and spreadsheets.</p>
				<p>We connect those moving parts so the next action is visible, accountable and easier to complete.</p>
			</div>
		</div>
	</section>

	<section class="doa-capabilities" id="capabilities">
		<div class="doa-section-head doa-reveal">
			<p class="doa-kicker">What we build</p>
			<h2>A complete operating layer, assembled for your business.</h2>
		</div>
		<div class="doa-capability-grid">
			<?php foreach ( $capabilities as $capability ) : ?>
				<article class="doa-capability doa-reveal">
					<div><span><?php echo esc_html( $capability['code'] ); ?></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>
					<h3><?php echo esc_html( $capability['title'] ); ?></h3>
					<p><?php echo esc_html( $capability['copy'] ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>
	</section>

	<section class="doa-method" id="method">
		<div class="doa-method__intro doa-reveal">
			<p class="doa-kicker">How we work</p>
			<h2>Technology follows the operation—not the other way around.</h2>
			<p>Every engagement begins with the real workflow. That keeps the build focused, the interface understandable and the result useful after launch day.</p>
		</div>
		<ol class="doa-method__steps">
			<?php foreach ( $process as $item ) : ?>
				<li class="doa-method__step doa-reveal">
					<span><?php echo esc_html( $item['step'] ); ?></span>
					<div><h3><?php echo esc_html( $item['title'] ); ?></h3><p><?php echo esc_html( $item['copy'] ); ?></p></div>
				</li>
			<?php endforeach; ?>
		</ol>
	</section>

	<section class="doa-proof-v2">
		<div class="doa-proof-v2__statement doa-reveal">
			<p class="doa-kicker">Built for real operations</p>
			<h2>Quiet technology.<br>Visible control.</h2>
		</div>
		<div class="doa-proof-v2__ledger doa-reveal">
			<div><span>01</span><p>Clinic and service operations</p></div>
			<div><span>02</span><p>Booking, queue and point of sale</p></div>
			<div><span>03</span><p>HR, attendance and workforce workflows</p></div>
			<div><span>04</span><p>Commerce, customer records and reporting</p></div>
			<div><span>05</span><p>Infrastructure, cloud and technical support</p></div>
		</div>
	</section>

	<section class="doa-contact-v2" id="contact">
		<div class="doa-contact-v2__intro">
			<p class="doa-kicker doa-reveal">Your next operating layer</p>
			<h2 class="doa-reveal">What is slowing your business down?</h2>
			<p class="doa-reveal">Show us the messy process. We’ll help you map the system that should replace it.</p>
			<div class="doa-meeting-note doa-reveal">
				<span aria-hidden="true"><i></i><i></i><i></i></span>
				<p><strong>We prefer meeting face to face.</strong> If you are near Kuala Lumpur, let’s sit down together. If not, an online call works perfectly.</p>
			</div>
		</div>
		<div class="doa-contact-console doa-reveal">
			<div class="doa-contact-console__head"><span>Project signal / secure intake</span><span><i></i> Ready</span></div>
			<div class="doa-contact-console__orbit" aria-hidden="true"><i></i><i></i><img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/images/doa-logo-mark-transparent.png' ); ?>" alt=""></div>
			<form class="doa-contact-form" id="doa-contact-form" action="<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>" method="post">
				<input type="hidden" name="action" value="doa_submit_enquiry">
				<?php wp_nonce_field( 'doa_contact_submit', 'doa_contact_nonce' ); ?>
				<div class="doa-contact-form__grid">
					<label class="doa-field"><span><b>01</b> Your name</span><input type="text" name="name" autocomplete="name" required maxlength="100" placeholder="How should we address you?"></label>
					<label class="doa-field"><span><b>02</b> Phone number</span><input type="tel" name="phone" autocomplete="tel" required maxlength="40" inputmode="tel" placeholder="+60 12 345 6789"></label>
					<label class="doa-field doa-field--wide"><span><b>03</b> Company name <em>Optional</em></span><input type="text" name="company" autocomplete="organization" maxlength="120" placeholder="Your business or organisation"></label>
					<label class="doa-field doa-field--wide"><span><b>04</b> What should work better? <em>Optional</em></span><textarea name="details" rows="4" maxlength="1500" placeholder="A booking flow, internal process, reporting, customer journey, or anything else..."></textarea></label>
				</div>
				<label class="doa-contact-form__trap" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
				<div class="doa-contact-form__foot">
					<p>Saved privately for the DOA team. We’ll contact you to arrange the right kind of conversation.</p>
					<button class="doa-form-submit" type="submit"><span>Send project signal</span><i aria-hidden="true">↗</i></button>
				</div>
				<p class="doa-contact-form__status" role="status" aria-live="polite"></p>
			</form>
			<div class="doa-contact-console__success" aria-hidden="true"><span>Signal received</span><h3>We’ll be in touch.</h3><p>Your enquiry is now saved privately with DOA Solutions.</p></div>
		</div>
		<div class="doa-contact-v2__meta"><span>Kuala Lumpur, Malaysia</span><span>Web • Systems • Automation • IT</span></div>
	</section>
</main>

<?php get_footer(); ?>
