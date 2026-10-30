<?php
/**
 * Search metadata for the public DOA website. AIOSEO remains the single emitter.
 * Test pages are retained for review, but excluded from search discovery.
 *
 * @package DOA_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function doa_seo_page_meta() {
	if ( is_front_page() ) {
		return array(
			'title'       => 'Web Development & Business Systems KL | DOA Solutions',
			'description' => 'DOA Solutions builds websites, custom business systems and workflow automation for Malaysian businesses. Based in Taman Melawati, Kuala Lumpur.',
		);
	}

	$pages = array(
		'about-us' => array(
			'title'       => 'About DOA Solutions | Technology Partner in Kuala Lumpur',
			'description' => 'Meet DOA Solutions, a technology partner in Taman Melawati, Kuala Lumpur, building websites, business systems and practical automation for Malaysian SMEs.',
		),
		'services' => array(
			'title'       => 'Websites, Business Systems & IT Services | DOA Solutions',
			'description' => 'Explore website development, custom business systems, workflow automation and computer cleaning from DOA Solutions in Kuala Lumpur. Discuss your project.',
		),
		'contact' => array(
			'title'       => 'Contact DOA Solutions | Kuala Lumpur Websites & Systems',
			'description' => 'Contact DOA Solutions in Taman Melawati, Kuala Lumpur for website development, custom business software and automation. Meet by appointment or arrange a call.',
		),
		'product' => array(
			'title'       => 'CRYORIG CPU Coolers in Malaysia | DOA Solutions',
			'description' => 'Explore CRYORIG CPU air and liquid coolers from DOA Solutions in Malaysia. Compare cooler models and contact our team about compatibility and availability.',
		),
	);
	foreach ( $pages as $slug => $meta ) {
		if ( is_page( $slug ) || ( 'about-us' === $slug && is_page( 'about' ) ) ) {
			return $meta;
		}
	}
	return array();
}

function doa_seo_title( $title ) {
	$meta = doa_seo_page_meta();
	return $meta['title'] ?? $title;
}
add_filter( 'aioseo_title', 'doa_seo_title', 20 );

function doa_seo_description( $description ) {
	$meta = doa_seo_page_meta();
	return $meta['description'] ?? $description;
}
add_filter( 'aioseo_description', 'doa_seo_description', 20 );

function doa_seo_social_tags( $tags ) {
	$meta = doa_seo_page_meta();
	foreach ( array( 'og', 'twitter' ) as $prefix ) {
		if ( ! empty( $meta ) ) {
			$tags[ $prefix . ':title' ]       = $meta['title'];
			$tags[ $prefix . ':description' ] = $meta['description'];
		}
	}
	// Each emitter gets only its own vocabulary.
	if ( isset( $tags['og:type'] ) ) {
		unset( $tags['twitter:title'], $tags['twitter:description'] );
		$tags['og:site_name'] = 'DOA Solutions';
	} else {
		unset( $tags['og:title'], $tags['og:description'] );
	}
	return $tags;
}
add_filter( 'aioseo_facebook_tags', 'doa_seo_social_tags', 20 );
add_filter( 'aioseo_twitter_tags', 'doa_seo_social_tags', 20 );

function doa_seo_is_test_content() {
	return is_page( 'testing-page' ) || is_single( 'hello-world' ) || is_category( 'uncategorized' );
}

function doa_seo_robots( $robots ) {
	if ( doa_seo_is_test_content() ) {
		unset( $robots['index'], $robots['nofollow'] );
		$robots['noindex'] = 'noindex';
		$robots['follow']  = 'follow';
	}
	return $robots;
}
add_filter( 'aioseo_robots_meta', 'doa_seo_robots', 20 );

function doa_seo_core_robots( $robots ) {
	if ( doa_seo_is_test_content() ) {
		unset( $robots['index'], $robots['nofollow'] );
		$robots['noindex'] = true;
		$robots['follow']  = true;
	}
	return $robots;
}
add_filter( 'wp_robots', 'doa_seo_core_robots', 20 );

function doa_seo_exclude_posts( $ids ) {
	foreach ( array( 'testing-page', 'hello-world' ) as $slug ) {
		$post = get_page_by_path( $slug, OBJECT, array( 'page', 'post' ) );
		if ( $post ) {
			$ids[] = (int) $post->ID;
		}
	}
	return array_values( array_unique( $ids ) );
}
add_filter( 'aioseo_sitemap_exclude_posts', 'doa_seo_exclude_posts' );

function doa_seo_exclude_terms( $ids ) {
	$term = get_term_by( 'slug', 'uncategorized', 'category' );
	if ( $term ) {
		$ids[] = (int) $term->term_id;
	}
	return array_values( array_unique( $ids ) );
}
add_filter( 'aioseo_sitemap_exclude_terms', 'doa_seo_exclude_terms' );

function doa_seo_sitemap_pages( $entries, $post_type ) {
	if ( 'page' !== $post_type ) {
		return $entries;
	}
	$url = home_url( '/showcase/' );
	foreach ( $entries as $entry ) {
		if ( ( $entry['loc'] ?? '' ) === $url ) {
			return $entries;
		}
	}
	$entries[] = array( 'loc' => $url );
	return $entries;
}
add_filter( 'aioseo_sitemap_posts', 'doa_seo_sitemap_pages', 20, 2 );

function doa_seo_sitemap_template( $entry, $post_id ) {
	$template = null;
	if ( (int) get_option( 'page_on_front' ) === (int) $post_id ) {
		$template = __DIR__ . '/front-page.php';
	} elseif ( in_array( get_post_field( 'post_name', $post_id ), array( 'about', 'about-us' ), true ) ) {
		$template = __DIR__ . '/about.php';
	}
	if ( $template && is_file( $template ) ) {
		$entry['lastmod'] = gmdate( 'c', max( filemtime( $template ), filemtime( __FILE__ ) ) );
		// WordPress post-body images belong to the superseded Elementor layouts.
		unset( $entry['images'] );
	}
	return $entry;
}
add_filter( 'aioseo_sitemap_post', 'doa_seo_sitemap_template', 20, 2 );

function doa_seo_schema( $graph ) {
	$meta = doa_seo_page_meta();
	$business_description = 'Website development, custom business systems, workflow automation and IT support for Malaysian businesses, based in Kuala Lumpur.';
	foreach ( $graph as &$node ) {
		$types = (array) ( $node['@type'] ?? array() );
		if ( in_array( 'Organization', $types, true ) ) {
			$node['description'] = $business_description;
			$node['telephone']   = '+60 19 412 9506';
			$node['email']       = 'doasolutions@outlook.com';
			$node['areaServed']  = array(
				array( '@type' => 'Country', 'name' => 'Malaysia' ),
				array( '@type' => 'City', 'name' => 'Kuala Lumpur' ),
			);
			$node['sameAs'] = array( 'https://www.facebook.com/DOAsolutions', 'https://www.instagram.com/doasolutions/' );
		}
		if ( in_array( 'WebSite', $types, true ) ) {
			$node['description'] = $business_description;
		}
		if ( ! empty( $meta ) && array_intersect( $types, array( 'WebPage', 'AboutPage', 'ContactPage' ) ) ) {
			$node['name']        = $meta['title'];
			$node['description'] = $meta['description'];
		}
	}
	unset( $node );
	return $graph;
}
add_filter( 'aioseo_schema_output', 'doa_seo_schema', 20 );
