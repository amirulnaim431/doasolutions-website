<?php
/**
 * Plugin Name: DOA Demo – Premium Homepage (MU)
 * Description: Premium full-bleed demo homepage with module buttons + autoplay hero video. No theme wrapper. Safe output.
 * Author: DOA Solutions
 * Version: 2.4.0
 */

if (!defined('ABSPATH')) exit;

/** =========
 * SETTINGS
 * ========= */
if (!defined('DOA_DEMO_BRAND_TITLE'))   define('DOA_DEMO_BRAND_TITLE', 'DOA Solutions');
if (!defined('DOA_DEMO_TAGLINE'))       define('DOA_DEMO_TAGLINE', 'Operations system prototype for clinics & service businesses');
if (!defined('DOA_DEMO_SUBTAGLINE'))    define('DOA_DEMO_SUBTAGLINE', '— booking → service → T&G claims → inventory → Membership, with clarity.');

/** Paths */
if (!defined('DOA_DEMO_PATH_BOOKING'))     define('DOA_DEMO_PATH_BOOKING', '/lindo');
if (!defined('DOA_DEMO_PATH_CLAIMS'))      define('DOA_DEMO_PATH_CLAIMS', '/claims');
if (!defined('DOA_DEMO_PATH_INVENTORY'))   define('DOA_DEMO_PATH_INVENTORY', '/inventory');
if (!defined('DOA_DEMO_PATH_MEMBERSHIP'))  define('DOA_DEMO_PATH_MEMBERSHIP', '/membership');

/** Hero badge */
if (!defined('DOA_DEMO_BADGE_TEXT')) define('DOA_DEMO_BADGE_TEXT', 'DEMO • Trial Environment');

/**
 * Hero media:
 * - Video is recommended for premium feel (autoplay requires muted + playsinline).
 * - Image is fallback.
 */
if (!defined('DOA_DEMO_HERO_VIDEO_URL')) define('DOA_DEMO_HERO_VIDEO_URL', 'https://demo.doasolutions.com.my/wp-content/uploads/2026/01/doagif.mp4');
if (!defined('DOA_DEMO_HERO_IMAGE_URL')) define('DOA_DEMO_HERO_IMAGE_URL', ''); // optional fallback image URL

/** =========
 * HELPERS
 * ========= */
function doa_demo_is_target_home(): bool {
  return is_front_page() && !is_admin() && !wp_doing_ajax() && !wp_doing_cron();
}

function doa_demo_url(string $path): string {
  $path = '/' . ltrim($path, '/');
  return esc_url(home_url($path));
}

/**
 * Render premium homepage (no theme wrapper).
 * Use template_redirect + exit to avoid missing template file crashes.
 */
add_action('template_redirect', function () {
  if (!doa_demo_is_target_home()) return;

  status_header(200);
  nocache_headers();
  header('Content-Type: text/html; charset=' . get_bloginfo('charset'));

  $brand   = esc_html(DOA_DEMO_BRAND_TITLE);
  $tagline = esc_html(DOA_DEMO_TAGLINE);
  $subtag  = esc_html(DOA_DEMO_SUBTAGLINE);
  $badge   = esc_html(DOA_DEMO_BADGE_TEXT);

  $u_booking    = doa_demo_url(DOA_DEMO_PATH_BOOKING);
  $u_claims     = doa_demo_url(DOA_DEMO_PATH_CLAIMS);
  $u_inventory  = doa_demo_url(DOA_DEMO_PATH_INVENTORY);
  $u_membership = doa_demo_url(DOA_DEMO_PATH_MEMBERSHIP);

  $hero_video = trim((string) DOA_DEMO_HERO_VIDEO_URL);
  $has_video  = $hero_video !== '';

  $hero_img = trim((string) DOA_DEMO_HERO_IMAGE_URL);
  $has_img  = $hero_img !== '';

  ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php echo esc_attr(get_bloginfo('charset')); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo $brand; ?> — Demo</title>

  <!-- Premium font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root{
      --stroke:rgba(255,255,255,.08);
      --muted:rgba(255,255,255,.72);
      --text:rgba(255,255,255,.92);
      --soft:rgba(255,255,255,.06);
      --green:#22c55e;
      --green2:#16a34a;
      --shadow: 0 18px 60px rgba(0,0,0,.55);
      --radius:22px;
      --radius2:28px;
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      font-family: Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      background:
        radial-gradient(1100px 600px at 12% 18%, rgba(34,197,94,.10), transparent 55%),
        radial-gradient(900px 600px at 88% 22%, rgba(34,197,94,.08), transparent 55%),
        radial-gradient(800px 520px at 55% 90%, rgba(255,255,255,.05), transparent 60%),
        linear-gradient(180deg, #05070a, #06080b 40%, #05070a);
      color:var(--text);
    }
    a{color:inherit;text-decoration:none}

    .wrap{max-width:1200px;margin:0 auto;padding:44px 22px 28px;}
    .shell{
      border:1px solid var(--stroke);
      background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
      border-radius: var(--radius2);
      box-shadow: var(--shadow);
      overflow:hidden;
      position:relative;
    }
    .shell:before{
      content:"";
      position:absolute; inset:-1px;
      background: radial-gradient(900px 480px at 18% 20%, rgba(34,197,94,.10), transparent 55%);
      pointer-events:none;
    }
    .inner{position:relative; padding:34px 34px 18px;}

    .top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px;}
    .badge{
      display:inline-flex;align-items:center;gap:10px;
      padding:10px 16px;border-radius:999px;
      border:1px solid rgba(34,197,94,.22);
      background: linear-gradient(180deg, rgba(34,197,94,.14), rgba(34,197,94,.06));
      box-shadow: 0 10px 30px rgba(0,0,0,.35);
      font-weight:700;letter-spacing:.2px;
    }

    .grid{display:grid;grid-template-columns:1.1fr .9fr;gap:26px;align-items:stretch;margin-top:8px;}
    @media (max-width:980px){ .grid{grid-template-columns:1fr;} }

    h1{
      font-size: clamp(40px, 5vw, 62px);
      line-height:1.02;margin:10px 0 10px;
      letter-spacing:-0.8px;font-weight:800;
    }
    .desc{font-size:16px;color:var(--muted);line-height:1.65;max-width:560px;margin-top:10px;}

    .ctaRow{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px;}
    .btn{
      display:inline-flex;align-items:center;justify-content:center;gap:10px;
      padding:14px 18px;border-radius:14px;
      border:1px solid var(--stroke);
      background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
      color: rgba(255,255,255,.92);
      font-weight:800;letter-spacing:.15px;
      transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease, background .15s ease;
      min-width:180px; user-select:none;
    }
    .btn:hover{
      transform: translateY(-1px);
      border-color: rgba(255,255,255,.16);
      box-shadow: 0 14px 40px rgba(0,0,0,.45);
      background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04));
    }
    .btnPrimary{
      background: linear-gradient(180deg, rgba(34,197,94,.95), rgba(22,163,74,.92));
      border-color: rgba(34,197,94,.55);
      color:#06110a;
      box-shadow: 0 18px 55px rgba(34,197,94,.20);
    }
    .btnPrimary:hover{
      border-color: rgba(34,197,94,.75);
      box-shadow: 0 22px 70px rgba(34,197,94,.28);
    }

    .rightCard{
      border-radius: var(--radius);
      border:1px solid var(--stroke);
      background:
        radial-gradient(900px 520px at 65% 40%, rgba(34,197,94,.12), transparent 55%),
        linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      overflow:hidden;
      min-height:320px;
      display:flex;align-items:center;justify-content:center;
      position:relative;
    }
    .heroMedia{
      width:100%;
      height:100%;
      object-fit:cover;
      filter: drop-shadow(0 18px 40px rgba(0,0,0,.55));
      transform: scale(1.02);
      display:block;
      background: transparent;
    }
    .rightCard .placeholder{
      width:86%;height:86%;
      border-radius:18px;
      border:1px dashed rgba(255,255,255,.14);
      background: radial-gradient(700px 420px at 40% 30%, rgba(34,197,94,.10), transparent 60%);
      display:flex;align-items:center;justify-content:center;
      color: rgba(255,255,255,.68);
      font-weight:700;text-align:center;padding:18px;
    }

    .modules{
      display:grid;
      grid-template-columns: repeat(4, 1fr);
      gap:16px;
      margin-top:22px;
      padding-top:10px;
    }
    @media (max-width:980px){ .modules{grid-template-columns:1fr 1fr;} }
    @media (max-width:520px){ .modules{grid-template-columns:1fr;} }

    .modBtn{
      display:flex;align-items:center;justify-content:space-between;gap:12px;
      padding:18px 18px;border-radius:18px;
      border:1px solid var(--stroke);
      background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease;
      min-height:78px;
    }
    .modBtn:hover{
      transform: translateY(-1px);
      border-color: rgba(34,197,94,.30);
      box-shadow: 0 18px 55px rgba(0,0,0,.45);
    }
    .modLeft{display:flex;flex-direction:column;gap:4px;}
    .modTitle{font-weight:800;letter-spacing:.15px;}
    .modSub{font-size:12px;color: rgba(255,255,255,.64);}

    .chip{
      display:inline-flex;align-items:center;
      padding:6px 10px;border-radius:999px;
      border:1px solid rgba(34,197,94,.20);
      background: rgba(34,197,94,.08);
      color: rgba(220,255,234,.92);
      font-weight:800;font-size:12px;white-space:nowrap;
    }
    .chipDone{
      border-color: rgba(34,197,94,.45);
      background: rgba(34,197,94,.14);
      color: rgba(210,255,228,.96);
    }

    .footer{
      padding:14px 24px 18px;
      border-top:1px solid var(--soft);
      display:flex;justify-content:space-between;gap:12px;
      color: rgba(255,255,255,.55);
      font-size:12px;
    }
    .footer b{color: rgba(255,255,255,.78)}
  </style>
</head>

<body>
  <div class="wrap">
    <div class="shell">
      <div class="inner">

        <div class="top">
          <div class="badge"><?php echo $badge; ?></div>
        </div>

        <div class="grid">
          <div>
            <h1><?php echo $brand; ?></h1>
            <div class="desc">
              <div><?php echo $tagline; ?></div>
              <div><?php echo $subtag; ?></div>
            </div>

            <div class="ctaRow">
              <a class="btn btnPrimary" href="<?php echo $u_booking; ?>">Open Booking (Live Demo) →</a>
              <a class="btn" href="<?php echo $u_claims; ?>">Open Claims →</a>
              <a class="btn" href="<?php echo $u_inventory; ?>">Open Inventory →</a>
              <a class="btn" href="<?php echo $u_membership; ?>">Open Membership →</a>
            </div>
          </div>

          <div class="rightCard">
            <?php if ($has_video): ?>
              <video
                class="heroMedia"
                autoplay
                loop
                muted
                playsinline
                preload="auto"
                webkit-playsinline
                aria-label="DOA Demo Visual"
              >
                <source src="<?php echo esc_url($hero_video); ?>" type="video/mp4">
              </video>
            <?php elseif ($has_img): ?>
              <img class="heroMedia" src="<?php echo esc_url($hero_img); ?>" alt="DOA Demo Visual">
            <?php else: ?>
              <div class="placeholder">
                Optional hero visual.<br>
                Set <b>DOA_DEMO_HERO_VIDEO_URL</b> or <b>DOA_DEMO_HERO_IMAGE_URL</b>.
              </div>
            <?php endif; ?>
          </div>
        </div>

        <div class="modules">
          <a class="modBtn" href="<?php echo $u_booking; ?>">
            <div class="modLeft">
              <div class="modTitle">Booking &amp; Visit Flow</div>
              <div class="modSub">From appointment → service completion</div>
            </div>
            <div class="chip chipDone">DONE</div>
          </a>

          <a class="modBtn" href="<?php echo $u_claims; ?>">
            <div class="modLeft">
              <div class="modTitle">T&amp;G Claim Tracking</div>
              <div class="modSub">Claim visibility &amp; follow-up clarity</div>
            </div>
            <div class="chip">PREVIEW</div>
          </a>

          <a class="modBtn" href="<?php echo $u_inventory; ?>">
            <div class="modLeft">
              <div class="modTitle">Inventory Awareness</div>
              <div class="modSub">Usage trend + low-stock risk alerts</div>
            </div>
            <div class="chip">PREVIEW</div>
          </a>

          <a class="modBtn" href="<?php echo $u_membership; ?>">
            <div class="modLeft">
              <div class="modTitle">Membership</div>
              <div class="modSub">Patient loyalty &amp; service history layer</div>
            </div>
            <div class="chip">PREVIEW</div>
          </a>
        </div>

      </div>

      <div class="footer">
        <div>© <?php echo esc_html(date('Y')); ?> <b>DOA Solutions</b> — Demo</div>
        <div>Primary demo: <b><?php echo esc_html(DOA_DEMO_PATH_BOOKING); ?></b></div>
      </div>
    </div>
  </div>

  <script>
    // Mobile autoplay hardening: try play after user gesture / load (some browsers still block first attempt).
    (function(){
      var v = document.querySelector('video.heroMedia, video.heroMedia, video');
      if(!v) return;
      try {
        var p = v.play();
        if (p && typeof p.catch === 'function') { p.catch(function(){}); }
      } catch(e){}
      document.addEventListener('touchstart', function(){
        try { v.play(); } catch(e){}
      }, { once:true, passive:true });
    })();
  </script>
</body>
</html>
<?php
  exit;
}, 0);
