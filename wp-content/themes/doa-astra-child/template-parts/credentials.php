<?php
/**
 * Public credentials, shared by the homepage and About page.
 *
 * @package DOA_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$credentials = get_option( 'doa_public_credentials', array() );
if ( ! is_array( $credentials ) ) {
	return;
}

$credentials = array_filter(
	$credentials,
	static function ( $credential ) {
		if ( ! is_array( $credential ) ) {
			return false;
		}
		foreach ( array( 'title', 'holder', 'issuer', 'issued', 'image', 'verification' ) as $field ) {
			if ( ! is_string( $credential[ $field ] ?? null ) || '' === trim( $credential[ $field ] ) ) {
				return false;
			}
		}
		return '' !== esc_url( $credential['image'], array( 'https' ) )
			&& '' !== esc_url( $credential['verification'], array( 'https' ) );
	}
);
if ( ! $credentials ) {
	return;
}

$homepage = 'strip' === ( $args['layout'] ?? '' );
if ( $homepage ) :
	?>
	<section class="doa-credential-strip" aria-label="<?php esc_attr_e( 'Professional credentials', 'doa-solutions' ); ?>">
		<ul class="doa-credential-strip__badges">
			<?php foreach ( $credentials as $credential ) : ?>
				<li><img src="<?php echo esc_url( $credential['image'], array( 'https' ) ); ?>" alt="<?php echo esc_attr( $credential['title'] ); ?>" width="72" height="72" loading="lazy" decoding="async"></li>
			<?php endforeach; ?>
		</ul>
		<a href="<?php echo esc_url( home_url( '/about-us/#credentials' ) ); ?>"><?php esc_html_e( 'View credentials', 'doa-solutions' ); ?> <span aria-hidden="true">↗</span></a>
	</section>
<?php else : ?>
	<section class="doa-credentials" id="credentials" aria-labelledby="doa-credentials-title">
		<h2 id="doa-credentials-title"><?php esc_html_e( 'Professional credentials', 'doa-solutions' ); ?></h2>
		<ul class="doa-credentials__list">
			<?php foreach ( $credentials as $credential ) : ?>
				<li class="doa-credential">
					<img src="<?php echo esc_url( $credential['image'], array( 'https' ) ); ?>" alt="" width="112" height="112" loading="lazy" decoding="async">
					<div class="doa-credential__copy">
						<h3><?php echo esc_html( $credential['title'] ); ?></h3>
						<p><?php printf( esc_html__( 'Issued by %1$s · %2$s', 'doa-solutions' ), esc_html( $credential['issuer'] ), esc_html( $credential['issued'] ) ); ?></p>
						<p><?php printf( esc_html__( 'Earned by %s', 'doa-solutions' ), esc_html( $credential['holder'] ) ); ?></p>
					</div>
					<a href="<?php echo esc_url( $credential['verification'], array( 'https' ) ); ?>" aria-label="<?php echo esc_attr( sprintf( __( 'Verify %s', 'doa-solutions' ), $credential['title'] ) ); ?>"><?php esc_html_e( 'Verify badge', 'doa-solutions' ); ?> <span aria-hidden="true">↗</span></a>
				</li>
			<?php endforeach; ?>
		</ul>
	</section>
<?php endif; ?>
