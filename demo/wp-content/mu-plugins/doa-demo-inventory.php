<?php
/**
 * Plugin Name: DOA Demo – Inventory Module (MU)
 * Description: Premium guided demo page for /inventory with consistent DOA theme + back link. No theme wrapper.
 * Author: DOA Solutions
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

/** Target slug */
if (!defined('DOA_DEMO_INVENTORY_SLUG')) define('DOA_DEMO_INVENTORY_SLUG', 'inventory');

/** Back link */
if (!defined('DOA_DEMO_HOME_PATH')) define('DOA_DEMO_HOME_PATH', '/');

/** Render only on /inventory */
function doa_demo_is_inventory_page(): bool {
  if (is_admin() || wp_doing_ajax() || wp_doing_cron()) return false;
  if (!is_singular('page')) return false;
  $post = get_queried_object();
  if (!$post || empty($post->post_name)) return false;
  return $post->post_name === DOA_DEMO_INVENTORY_SLUG;
}

add_action('template_redirect', function () {
  if (!doa_demo_is_inventory_page()) return;

  status_header(200);
  nocache_headers();
  header('Content-Type: text/html; charset=' . get_bloginfo('charset'));

  $home_url = esc_url(home_url(DOA_DEMO_HOME_PATH));

  // Demo-safe mock inventory awareness data
  $items = [
    ['Alcohol Swabs', 'Consumable', 'Low', '3 days', 'High'],
    ['Syringes (5ml)', 'Consumable', 'Healthy', '18 days', 'Normal'],
    ['Latex Gloves', 'Consumable', 'Critical', '1 day', 'High'],
    ['Pain Relief Gel', 'Medication', 'Healthy', '25 days', 'Low'],
    ['Bandages (M)', 'Consumable', 'Low', '4 days', 'Medium'],
    ['Disinfectant Spray', 'Consumable', 'Healthy', '30 days', 'Low'],
  ];
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php echo esc_attr(get_bloginfo('charset')); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Inventory Awareness — Demo</title>

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
      --amber:#f59e0b;
      --red:#ef4444;
      --shadow:0 18px 60px rgba(0,0,0,.55);
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
    .inner{padding:30px 34px 22px; position:relative;}

    .backLink{
      display:inline-flex;align-items:center;gap:8px;
      margin-bottom:18px;
      font-size:14px;font-weight:800;
      color: rgba(255,255,255,.75);
      transition: color .15s ease, transform .15s ease;
    }
    .backLink:hover{color: rgba(255,255,255,.95); transform: translateX(-2px);}

    h1{
      font-size: clamp(34px, 4.5vw, 52px);
      line-height:1.05;margin:0;
      letter-spacing:-0.8px;font-weight:800;
    }
    .sub{
      margin-top:10px;
      color:var(--muted);
      max-width:760px;
      line-height:1.65;
      font-size:15px;
    }

    .pill{
      display:inline-flex;align-items:center;
      padding:10px 14px;border-radius:999px;
      border:1px solid rgba(34,197,94,.22);
      background: linear-gradient(180deg, rgba(34,197,94,.14), rgba(34,197,94,.06));
      box-shadow: 0 10px 30px rgba(0,0,0,.30);
      font-weight:800;letter-spacing:.2px;
      white-space:nowrap;
    }

    .topRow{
      display:flex;justify-content:space-between;gap:16px;
      align-items:flex-start;flex-wrap:wrap;
    }

    .kpis{
      display:grid;
      grid-template-columns: repeat(4,1fr);
      gap:14px;
      margin-top:22px;
    }
    @media (max-width:980px){ .kpis{grid-template-columns:1fr 1fr;} }
    @media (max-width:520px){ .kpis{grid-template-columns:1fr;} }

    .kpi{
      border:1px solid rgba(255,255,255,.08);
      background: rgba(0,0,0,.18);
      border-radius:18px;
      padding:16px;
    }
    .kpi .num{font-size:26px;font-weight:900;}
    .kpi .lab{font-size:12px;color:rgba(255,255,255,.66);margin-top:4px;}

    .card{
      border:1px solid rgba(255,255,255,.08);
      background: rgba(0,0,0,.18);
      border-radius:18px;
      padding:18px;
      margin-top:18px;
    }
    .cardTitle{font-weight:900;margin-bottom:10px;}

    table{
      width:100%;
      border-collapse:collapse;
      font-size:13px;
    }
    th,td{
      padding:12px 14px;
      border-bottom:1px solid rgba(255,255,255,.06);
    }
    th{
      text-align:left;
      color:rgba(255,255,255,.78);
      font-weight:900;
      background:rgba(255,255,255,.04);
    }

    .badge{
      display:inline-flex;
      padding:6px 10px;
      border-radius:999px;
      font-weight:900;
      font-size:12px;
      border:1px solid rgba(255,255,255,.10);
    }
    .b-ok{background:rgba(34,197,94,.12);border-color:rgba(34,197,94,.30);}
    .b-low{background:rgba(245,158,11,.12);border-color:rgba(245,158,11,.30);}
    .b-crit{background:rgba(239,68,68,.12);border-color:rgba(239,68,68,.30);}

    .note{
      margin-top:14px;
      font-size:12px;
      color:rgba(255,255,255,.62);
      line-height:1.6;
    }

    .footer{
      padding:14px 24px 18px;
      border-top:1px solid var(--soft);
      display:flex;justify-content:space-between;gap:12px;
      color: rgba(255,255,255,.55);
      font-size:12px;
    }
    .footer b{color:rgba(255,255,255,.78)}
  </style>
</head>

<body>
  <div class="wrap">
    <div class="shell">
      <div class="inner">

        <a class="backLink" href="<?php echo $home_url; ?>">← Back to Demo Overview</a>

        <div class="topRow">
          <div>
            <h1>Inventory Awareness</h1>
            <div class="sub">
              A high-level operational view showing stock risk, usage pressure, and replenishment urgency —
              without exposing staff to complex inventory systems.
            </div>
          </div>
          <div class="pill">MODULE • Preview</div>
        </div>

        <div class="kpis">
          <div class="kpi"><div class="num">2</div><div class="lab">Items at critical risk</div></div>
          <div class="kpi"><div class="num">3</div><div class="lab">Items below threshold</div></div>
          <div class="kpi"><div class="num">21 days</div><div class="lab">Avg. safe coverage</div></div>
          <div class="kpi"><div class="num">0</div><div class="lab">Emergency reorders today</div></div>
        </div>

        <div class="card">
          <div class="cardTitle">Stock Risk Snapshot</div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Status</th>
                <th>Coverage</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($items as $i):
                [$name,$cat,$status,$cover,$risk] = $i;
                $cls = 'b-ok';
                if ($status === 'Low') $cls = 'b-low';
                if ($status === 'Critical') $cls = 'b-crit';
              ?>
              <tr>
                <td><b><?php echo esc_html($name); ?></b></td>
                <td><?php echo esc_html($cat); ?></td>
                <td><span class="badge <?php echo $cls; ?>"><?php echo esc_html($status); ?></span></td>
                <td><?php echo esc_html($cover); ?></td>
                <td><?php echo esc_html($risk); ?></td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>

          <div class="note">
            Demo note: This preview focuses on awareness and decision support.
            Production systems can include supplier links, reorder rules, and audit logs if required.
          </div>
        </div>

      </div>

      <div class="footer">
        <div>© <?php echo esc_html(date('Y')); ?> <b>DOA Solutions</b> — Inventory Preview</div>
        <div>Slug: <b>/<?php echo esc_html(DOA_DEMO_INVENTORY_SLUG); ?></b></div>
      </div>
    </div>
  </div>
</body>
</html>
<?php
  exit;
}, 0);
