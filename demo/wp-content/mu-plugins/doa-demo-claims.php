<?php
/**
 * Plugin Name: DOA Demo – Claims Module (MU)
 * Description: Premium guided demo page for /claims with consistent DOA theme + back link. No theme wrapper.
 * Author: DOA Solutions
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

/** Target slug */
if (!defined('DOA_DEMO_CLAIMS_SLUG')) define('DOA_DEMO_CLAIMS_SLUG', 'claims');

/** Back link */
if (!defined('DOA_DEMO_HOME_PATH')) define('DOA_DEMO_HOME_PATH', '/');

/** Safety: Only render on the exact slug */
function doa_demo_is_claims_page(): bool {
  if (is_admin() || wp_doing_ajax() || wp_doing_cron()) return false;
  if (!is_singular('page')) return false;
  $post = get_queried_object();
  if (!$post || empty($post->post_name)) return false;
  return $post->post_name === DOA_DEMO_CLAIMS_SLUG;
}

add_action('template_redirect', function () {
  if (!doa_demo_is_claims_page()) return;

  status_header(200);
  nocache_headers();
  header('Content-Type: text/html; charset=' . get_bloginfo('charset'));

  $home_url = esc_url(home_url(DOA_DEMO_HOME_PATH));

  // Mock data (demo-safe). Keep realistic but clearly “workflow illustration”.
  $rows = [
    ['C-10241', 'Patient A.', '2026-01-27', 'Medical', 'Pending Review', 'RM 180.00'],
    ['C-10240', 'Patient B.', '2026-01-27', 'Dental', 'Submitted', 'RM 320.00'],
    ['C-10239', 'Patient C.', '2026-01-26', 'Physio', 'Approved', 'RM 90.00'],
    ['C-10238', 'Patient D.', '2026-01-26', 'Medical', 'Rejected', 'RM 210.00'],
    ['C-10237', 'Patient E.', '2026-01-25', 'Medical', 'Paid', 'RM 140.00'],
  ];

  ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php echo esc_attr(get_bloginfo('charset')); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Claims — Demo</title>

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
    .inner{position:relative; padding:30px 34px 22px;}
    .backLink{
      display:inline-flex;align-items:center;gap:8px;
      margin-bottom:18px;
      font-size:14px;font-weight:800;
      color: rgba(255,255,255,.75);
      transition: color .15s ease, transform .15s ease;
    }
    .backLink:hover{color: rgba(255,255,255,.95); transform: translateX(-2px);}

    .topRow{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap;}
    h1{
      font-size: clamp(34px, 4.5vw, 52px);
      line-height:1.05;margin:0;
      letter-spacing:-0.8px;font-weight:800;
    }
    .sub{
      margin-top:10px;
      color: var(--muted);
      max-width: 760px;
      line-height: 1.65;
      font-size: 15px;
    }

    .pill{
      display:inline-flex;align-items:center;gap:10px;
      padding:10px 14px;border-radius:999px;
      border:1px solid rgba(34,197,94,.22);
      background: linear-gradient(180deg, rgba(34,197,94,.14), rgba(34,197,94,.06));
      box-shadow: 0 10px 30px rgba(0,0,0,.30);
      font-weight:800; letter-spacing:.2px;
      white-space:nowrap;
    }

    .grid{
      display:grid;
      grid-template-columns: 1.1fr .9fr;
      gap:16px;
      margin-top:20px;
    }
    @media (max-width:980px){ .grid{grid-template-columns:1fr;} }

    .card{
      border:1px solid var(--stroke);
      background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      border-radius: var(--radius);
      padding:18px;
      overflow:hidden;
    }
    .cardTitle{font-weight:900; letter-spacing:.15px; margin-bottom:10px;}
    .mini{
      color: rgba(255,255,255,.68);
      font-size: 13px;
      line-height: 1.6;
    }

    .steps{
      display:grid;
      grid-template-columns: repeat(4, 1fr);
      gap:12px;
      margin-top:14px;
    }
    @media (max-width:980px){ .steps{grid-template-columns: 1fr 1fr;} }
    @media (max-width:520px){ .steps{grid-template-columns: 1fr;} }

    .step{
      border:1px solid rgba(255,255,255,.08);
      background: rgba(0,0,0,.18);
      border-radius: 18px;
      padding:14px;
      min-height: 88px;
    }
    .step b{display:block;font-weight:900;margin-bottom:6px;}
    .step span{color: rgba(255,255,255,.70); font-size: 12px; line-height:1.5;}
    .kpis{
      display:grid;
      grid-template-columns: repeat(3, 1fr);
      gap:12px;
      margin-top:14px;
    }
    @media (max-width:980px){ .kpis{grid-template-columns:1fr 1fr;} }
    @media (max-width:520px){ .kpis{grid-template-columns:1fr;} }
    .kpi{
      border:1px solid rgba(255,255,255,.08);
      background: rgba(0,0,0,.18);
      border-radius: 18px;
      padding:14px;
    }
    .kpi .num{font-size:24px;font-weight:900;letter-spacing:-.2px;}
    .kpi .lab{color: rgba(255,255,255,.66); font-size:12px; margin-top:4px;}

    .toolbar{
      display:flex; gap:10px; flex-wrap:wrap;
      margin-top:14px;
    }
    .input, .select{
      border:1px solid rgba(255,255,255,.10);
      background: rgba(0,0,0,.22);
      border-radius: 14px;
      padding: 12px 12px;
      color: rgba(255,255,255,.90);
      font-weight:700;
      outline:none;
      min-width: 220px;
    }
    .select{min-width: 200px;}
    .btn{
      display:inline-flex;align-items:center;justify-content:center;
      padding: 12px 14px;
      border-radius: 14px;
      border:1px solid rgba(34,197,94,.35);
      background: linear-gradient(180deg, rgba(34,197,94,.95), rgba(22,163,74,.92));
      color:#06110a;
      font-weight:900;
      letter-spacing:.15px;
      cursor:pointer;
      user-select:none;
    }

    .tableWrap{
      margin-top: 14px;
      border:1px solid rgba(255,255,255,.08);
      border-radius: 18px;
      overflow:hidden;
    }
    table{
      width:100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    thead th{
      text-align:left;
      padding: 12px 14px;
      background: rgba(255,255,255,.04);
      border-bottom: 1px solid rgba(255,255,255,.08);
      color: rgba(255,255,255,.78);
      font-weight:900;
      letter-spacing:.12px;
    }
    tbody td{
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255,255,255,.06);
      color: rgba(255,255,255,.86);
      vertical-align: top;
    }
    tbody tr:hover td{ background: rgba(255,255,255,.03); }
    .status{
      display:inline-flex;align-items:center;gap:8px;
      padding: 6px 10px;
      border-radius:999px;
      font-weight:900;
      font-size: 12px;
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(0,0,0,.22);
      color: rgba(255,255,255,.88);
      white-space:nowrap;
    }
    .st-pending{ border-color: rgba(250,204,21,.25); background: rgba(250,204,21,.10); }
    .st-submitted{ border-color: rgba(59,130,246,.25); background: rgba(59,130,246,.10); }
    .st-approved{ border-color: rgba(34,197,94,.30); background: rgba(34,197,94,.12); }
    .st-rejected{ border-color: rgba(239,68,68,.25); background: rgba(239,68,68,.10); }
    .st-paid{ border-color: rgba(168,85,247,.25); background: rgba(168,85,247,.10); }

    .note{
      margin-top: 14px;
      color: rgba(255,255,255,.62);
      font-size: 12px;
      line-height: 1.6;
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

        <a class="backLink" href="<?php echo $home_url; ?>">← Back to Demo Overview</a>

        <div class="topRow">
          <div>
            <h1>T&amp;G Claim Tracking</h1>
            <div class="sub">
              A guided interface preview showing how claims move from visit → claim creation → submission → status tracking.
              Designed for operational clarity and reduced follow-up overhead.
            </div>
          </div>
          <div class="pill">MODULE • Preview</div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="cardTitle">Workflow</div>
            <div class="mini">A clean, auditable flow that makes claim responsibilities obvious and measurable.</div>

            <div class="steps">
              <div class="step"><b>1) Create</b><span>Claim generated from visit / service record.</span></div>
              <div class="step"><b>2) Review</b><span>Quick checks before submission to reduce rejects.</span></div>
              <div class="step"><b>3) Submit</b><span>Submission step + timestamp for accountability.</span></div>
              <div class="step"><b>4) Track</b><span>Single view of statuses + next actions.</span></div>
            </div>

            <div class="kpis">
              <div class="kpi"><div class="num">24h</div><div class="lab">Typical follow-up reduction target</div></div>
              <div class="kpi"><div class="num">1 view</div><div class="lab">All statuses in one place</div></div>
              <div class="kpi"><div class="num">0 noise</div><div class="lab">No confusing admin menus</div></div>
            </div>
          </div>

          <div class="card">
            <div class="cardTitle">Controls</div>
            <div class="mini">Preview UI for searching and filtering claims (demo-only).</div>

            <div class="toolbar">
              <input class="input" id="q" type="text" placeholder="Search claim ID / patient / type…">
              <select class="select" id="st">
                <option value="">All statuses</option>
                <option>Pending Review</option>
                <option>Submitted</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Paid</option>
              </select>
              <button class="btn" type="button" id="reset">Reset</button>
            </div>

            <div class="note">
              Demo note: This page illustrates structure and workflow. Production builds will integrate your real forms, data rules, and reporting requirements.
            </div>
          </div>
        </div>

        <div class="card" style="margin-top:16px;">
          <div class="cardTitle">Claim List</div>
          <div class="tableWrap">
            <table>
              <thead>
                <tr>
                  <th style="width:110px;">Claim ID</th>
                  <th>Patient</th>
                  <th style="width:120px;">Date</th>
                  <th style="width:120px;">Type</th>
                  <th style="width:160px;">Status</th>
                  <th style="width:120px;">Amount</th>
                </tr>
              </thead>
              <tbody id="tbody">
                <?php foreach ($rows as $r): 
                  $id = esc_html($r[0]);
                  $patient = esc_html($r[1]);
                  $date = esc_html($r[2]);
                  $type = esc_html($r[3]);
                  $status = esc_html($r[4]);
                  $amt = esc_html($r[5]);

                  $cls = 'status';
                  if ($status === 'Pending Review') $cls .= ' st-pending';
                  elseif ($status === 'Submitted') $cls .= ' st-submitted';
                  elseif ($status === 'Approved') $cls .= ' st-approved';
                  elseif ($status === 'Rejected') $cls .= ' st-rejected';
                  elseif ($status === 'Paid') $cls .= ' st-paid';
                ?>
                <tr data-id="<?php echo $id; ?>" data-patient="<?php echo $patient; ?>" data-type="<?php echo $type; ?>" data-status="<?php echo $status; ?>">
                  <td><b><?php echo $id; ?></b></td>
                  <td><?php echo $patient; ?></td>
                  <td><?php echo $date; ?></td>
                  <td><?php echo $type; ?></td>
                  <td><span class="<?php echo esc_attr($cls); ?>"><?php echo $status; ?></span></td>
                  <td><?php echo $amt; ?></td>
                </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <div class="footer">
        <div>© <?php echo esc_html(date('Y')); ?> <b>DOA Solutions</b> — Claims Preview</div>
        <div>Slug: <b>/<?php echo esc_html(DOA_DEMO_CLAIMS_SLUG); ?></b></div>
      </div>
    </div>
  </div>

  <script>
    (function(){
      var q = document.getElementById('q');
      var st = document.getElementById('st');
      var reset = document.getElementById('reset');
      var rows = Array.prototype.slice.call(document.querySelectorAll('#tbody tr'));

      function apply(){
        var qq = (q.value || '').toLowerCase().trim();
        var ss = (st.value || '').trim();

        rows.forEach(function(tr){
          var id = (tr.getAttribute('data-id') || '').toLowerCase();
          var patient = (tr.getAttribute('data-patient') || '').toLowerCase();
          var type = (tr.getAttribute('data-type') || '').toLowerCase();
          var status = (tr.getAttribute('data-status') || '');

          var okQ = !qq || (id.indexOf(qq) !== -1) || (patient.indexOf(qq) !== -1) || (type.indexOf(qq) !== -1);
          var okS = !ss || status === ss;

          tr.style.display = (okQ && okS) ? '' : 'none';
        });
      }

      q.addEventListener('input', apply);
      st.addEventListener('change', apply);
      reset.addEventListener('click', function(){
        q.value = '';
        st.value = '';
        apply();
      });
    })();
  </script>
</body>
</html>
<?php
  exit;
}, 0);
