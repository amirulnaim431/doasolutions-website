<?php
/**
 * Plugin Name: DOA Demo – Membership (Admin View) MU
 * Description: Hybrid membership demo with tier reference + clickable admin member control view.
 * Author: DOA Solutions
 * Version: 2.0.0
 */

if (!defined('ABSPATH')) exit;

/** Target slug */
define('DOA_DEMO_MEMBERSHIP_SLUG', 'membership');

/** Only run on /membership */
function doa_demo_is_membership_page(): bool {
  if (is_admin() || wp_doing_ajax() || wp_doing_cron()) return false;
  if (!is_singular('page')) return false;
  $p = get_queried_object();
  return $p && $p->post_name === DOA_DEMO_MEMBERSHIP_SLUG;
}

add_action('template_redirect', function () {
  if (!doa_demo_is_membership_page()) return;

  status_header(200);
  nocache_headers();
  header('Content-Type: text/html; charset=' . get_bloginfo('charset'));

  /** -----------------------------
   * DEMO DATA (SAFE / FAKE)
   * ----------------------------- */

  $members = [
    1 => [
      'name' => 'Aisyah M.',
      'tier' => 'Silver',
      'pax'  => 2,
      'balance' => 6420,
      'reward' => '20%',
      'appointments' => [
        ['2026-01-24', 'Facial Treatment', 'RM 380'],
        ['2026-01-10', 'Consultation', 'Free'],
      ],
      'claims' => [
        ['C-10240', 'T&G', 'Submitted'],
      ],
      'redemptions' => [
        ['2026-01-24', 'Facial Treatment', 'RM 380'],
      ],
    ],
    2 => [
      'name' => 'Daniel K.',
      'tier' => 'Black',
      'pax'  => 4,
      'balance' => 14800,
      'reward' => '25%',
      'appointments' => [
        ['2026-01-22', 'Body Therapy', 'RM 620'],
      ],
      'claims' => [
        ['C-10239', 'Medical', 'Approved'],
      ],
      'redemptions' => [],
    ],
    3 => [
      'name' => 'Nur Iman',
      'tier' => 'Bronze',
      'pax'  => 1,
      'balance' => 900,
      'reward' => '15%',
      'appointments' => [
        ['2026-01-20', 'Consultation', 'Free'],
      ],
      'claims' => [],
      'redemptions' => [
        ['2026-01-20', 'Product Usage', 'RM 200'],
      ],
    ],
  ];

  ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php echo esc_attr(get_bloginfo('charset')); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Membership Admin Demo</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">

<style>
body{
  margin:0;
  font-family:Montserrat,system-ui;
  background:#06080b;
  color:#f5f5f5;
}
.wrap{max-width:1200px;margin:auto;padding:36px;}
a{color:inherit;text-decoration:none}
h1{font-size:42px;margin:0}
.sub{color:#aaa;margin-top:10px}

.back{display:inline-block;margin-bottom:20px;font-weight:700;color:#bbb}
.back:hover{color:#fff}

.tiers{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:26px 0}
.tier{border:1px solid #222;border-radius:18px;padding:16px;background:#0b0f14}
.tier b{font-size:18px}

.admin{display:grid;grid-template-columns:1fr 1.4fr;gap:18px;margin-top:30px}
.panel{border:1px solid #222;border-radius:18px;background:#0b0f14;padding:16px}

.member{padding:14px;border-radius:14px;border:1px solid #222;margin-bottom:10px;cursor:pointer}
.member:hover{background:#121820}
.member.active{border-color:#22c55e;background:#122217}

.badge{padding:4px 10px;border-radius:999px;font-size:12px;font-weight:800}
.bronze{background:#3b2a10}
.silver{background:#2b3440}
.black{background:#111827}

.table{width:100%;border-collapse:collapse;margin-top:10px;font-size:13px}
.table th,.table td{padding:8px;border-bottom:1px solid #222;text-align:left}

.kpi{display:flex;gap:14px;margin-top:12px}
.kpi div{flex:1;border:1px solid #222;border-radius:14px;padding:12px;background:#0e141b}
.kpi b{font-size:18px}

.actions{margin-top:14px;display:flex;gap:10px;flex-wrap:wrap}
.btn{
  padding:10px 14px;
  border-radius:12px;
  border:1px solid #333;
  background:#121820;
  font-weight:800;
}
.btn.primary{background:#22c55e;color:#031108}
</style>
</head>

<body>
<div class="wrap">

<a class="back" href="<?php echo esc_url(home_url('/')); ?>">← Back to Demo Overview</a>

<h1>VIP Membership</h1>
<div class="sub">Hybrid view — tier reference + how admins actually manage members.</div>

<!-- Tier Reference -->
<div class="tiers">
  <div class="tier"><b>Bronze</b><br>RM 5,000 · 15% · 1 pax</div>
  <div class="tier"><b>Silver</b><br>RM 10,000 · 20% · 2 pax</div>
  <div class="tier"><b>Black</b><br>RM 20,000 · 25% · 4 pax</div>
</div>

<!-- Admin View -->
<div class="admin">

<!-- Member List -->
<div class="panel">
  <b>Members</b>
  <?php foreach ($members as $id=>$m): ?>
    <div class="member" data-id="<?php echo $id; ?>">
      <b><?php echo esc_html($m['name']); ?></b><br>
      <span class="badge <?php echo strtolower($m['tier']); ?>"><?php echo $m['tier']; ?></span>
      · RM <?php echo number_format($m['balance']); ?>
    </div>
  <?php endforeach; ?>
</div>

<!-- Detail Panel -->
<div class="panel" id="detail">
  <b>Select a member</b>
</div>

</div>
</div>

<script>
const data = <?php echo json_encode($members); ?>;
const members = document.querySelectorAll('.member');
const detail = document.getElementById('detail');

members.forEach(m=>{
  m.onclick = ()=>{
    members.forEach(x=>x.classList.remove('active'));
    m.classList.add('active');

    const d = data[m.dataset.id];

    let html = `
      <h3>${d.name}</h3>
      <div class="kpi">
        <div><div>Tier</div><b>${d.tier}</b></div>
        <div><div>Pax</div><b>${d.pax}</b></div>
        <div><div>Balance</div><b>RM ${d.balance.toLocaleString()}</b></div>
      </div>

      <h4>Appointments</h4>
      ${table(d.appointments)}

      <h4>Claims</h4>
      ${table(d.claims)}

      <h4>Redemptions</h4>
      ${table(d.redemptions)}

      <div class="actions">
        <div class="btn primary">Redeem Value</div>
        <div class="btn">View Full History</div>
        <div class="btn">Upgrade Tier</div>
      </div>
    `;
    detail.innerHTML = html;
  };
});

function table(rows){
  if(!rows.length) return '<i style="color:#777">None</i>';
  let t = '<table class="table"><tr>';
  Object.keys(rows[0]).forEach(k=>t+=`<th>${k}</th>`);
  t+='</tr>';
  rows.forEach(r=>{
    t+='<tr>';
    r.forEach(c=>t+=`<td>${c}</td>`);
    t+='</tr>';
  });
  return t+'</table>';
}
</script>

</body>
</html>
<?php
  exit;
}, 0);
