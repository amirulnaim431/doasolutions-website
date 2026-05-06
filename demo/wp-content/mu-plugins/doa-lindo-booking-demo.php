<?php
/**
 * Plugin Name: DOA – Lindo Booking Demo (MU)
 * Description: Premium booking demo UI for the /lindo page (full-bleed, demo-safe storage).
 * Author: DOA Solutions
 * Version: 1.1.0
 */

if (!defined('ABSPATH')) exit;

define('DOA_LINDO_DEMO_SLUG', 'lindo');
define('DOA_LINDO_DEMO_OPTION_KEY', 'doa_lindo_demo_bookings'); // stores last 30 demo submissions

function doa_lindo_is_target_page(): bool {
  if (is_admin()) return false;
  if (function_exists('is_page') && is_page(DOA_LINDO_DEMO_SLUG)) return true;

  $path = trim((string)parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH), '/');
  return ($path === DOA_LINDO_DEMO_SLUG);
}

/**
 * =========================
 * FULL-BLEED (NO THEME WRAP)
 * =========================
 * This prevents the page from being "shrunken" by the theme container.
 * Only runs on /lindo.
 */
add_filter('template_include', function ($template) {
  if (!doa_lindo_is_target_page()) return $template;

  // Use a temp file inside uploads to avoid permissions issues
  $upload = wp_upload_dir();
  $dir  = trailingslashit($upload['basedir']) . 'doa-demo';
  $file = trailingslashit($dir) . 'lindo-fullbleed.php';

  if (!file_exists($dir)) {
    wp_mkdir_p($dir);
  }

  if (!file_exists($file)) {
    $php = <<<'PHP'
<?php
if (!defined('ABSPATH')) exit;
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class('doa-lindo-fullbleed'); ?>>
<?php
  // Render the shortcode if your page uses it, otherwise render directly.
  if (shortcode_exists('doa_lindo_booking_demo')) {
    echo do_shortcode('[doa_lindo_booking_demo]');
  } else {
    echo '<div style="padding:24px;font-family:system-ui">Shortcode missing.</div>';
  }
?>
<?php wp_footer(); ?>
</body>
</html>
PHP;
    @file_put_contents($file, $php);
  }

  return $file;
}, 9999);

/**
 * Assets only on /lindo
 */
add_action('wp_enqueue_scripts', function () {
  if (!doa_lindo_is_target_page()) return;

  wp_enqueue_style(
    'doa-lindo-font',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
    [],
    null
  );

  /**
   * IMPORTANT CHANGES:
   * - Full namespace: doa-lindo-*
   * - Force box-sizing in our scope
   * - Ensure grid items can shrink (min-width:0) to prevent overlap
   * - Stronger specificity to beat theme CSS
   */
  $css = "
  :root{
    --doa-bg:#0b1020;
    --doa-text:#e5e7eb;
    --doa-muted:#94a3b8;
    --doa-line:rgba(148,163,184,.18);
    --doa-brand:#22c55e;
    --doa-brand2:#06b6d4;
    --doa-shadow: 0 18px 45px rgba(0,0,0,.45);
    --doa-radius:18px;
  }

  /* Full-bleed body (since we bypass theme wrapper) */
  body.doa-lindo-fullbleed{ margin:0; background: #070a14; font-family: Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }

  /* Scoped reset to stop theme collisions */
  .doa-lindo *,.doa-lindo *::before,.doa-lindo *::after{ box-sizing:border-box; }
  .doa-lindo{ color: var(--doa-text); }

  .doa-lindo-wrap{
    background:
      radial-gradient(1200px 600px at 15% 10%, rgba(34,197,94,.20), transparent 60%),
      radial-gradient(1000px 600px at 80% 30%, rgba(6,182,212,.16), transparent 55%),
      linear-gradient(180deg, var(--doa-bg), #070a14);
    min-height: 100vh;
    padding: 56px 18px;
  }
  .doa-lindo-shell{ max-width: 1100px; margin: 0 auto; }

  .doa-lindo-top{
    display:flex; gap:16px; align-items:flex-end; justify-content:space-between; flex-wrap:wrap;
    margin-bottom: 18px;
  }
  .doa-lindo-brand{ display:flex; gap:14px; align-items:center; }
  .doa-lindo-mark{
  width: 44px;              /* EXACT same size as green box */
  height: 44px;
  border-radius: 14px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(148,163,184,.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;           /* prevents shrinking beside text */
  box-shadow: 0 10px 28px rgba(0,0,0,.35);
}

.doa-lindo-mark img{
  width: 100%;
  height: 100%;
  object-fit: contain;     /* NO distortion */
  padding: 6px;            /* optical balance for lotus logo */
  display: block;
}

  .doa-lindo-h1{ font-size: 28px; margin: 0; letter-spacing: .2px; }
  .doa-lindo-sub{ margin: 6px 0 0; color: var(--doa-muted); font-size: 14px; }

  .doa-lindo-badges{ display:flex; gap:10px; flex-wrap:wrap; }
  .doa-lindo-badge{
    border: 1px solid var(--doa-line);
    background: rgba(255,255,255,.03);
    padding: 8px 10px; border-radius: 999px; font-size: 12px; color: var(--doa-muted);
  }

  .doa-lindo-grid{ display:grid; grid-template-columns: 1.25fr .75fr; gap: 16px; }
  @media (max-width: 980px){ .doa-lindo-grid{ grid-template-columns: 1fr; } }

  .doa-lindo-card{
    background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
    border: 1px solid var(--doa-line);
    border-radius: var(--doa-radius);
    box-shadow: var(--doa-shadow);
    overflow:hidden;
  }
  .doa-lindo-card-h{ padding: 16px 16px 0; }
  .doa-lindo-card-title{ margin:0; font-size: 16px; }
  .doa-lindo-card-desc{ margin: 6px 0 0; color: var(--doa-muted); font-size: 13px; }
  .doa-lindo-card-b{ padding: 16px; }

  /* KEY FIX: min-width:0 prevents grid children overflow/overlap */
  .doa-lindo-row{ display:grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .doa-lindo-row > *{ min-width:0; }
  @media (max-width: 680px){ .doa-lindo-row{ grid-template-columns: 1fr; } }

  .doa-lindo-field{ min-width:0; }
  .doa-lindo-field label{ display:block; font-size: 12px; color: var(--doa-muted); margin-bottom: 7px; }

  .doa-lindo-input, .doa-lindo-select{
    width:100%;
    min-width:0;
    display:block;
    background: rgba(15, 23, 42, .65);
    color: var(--doa-text);
    border: 1px solid rgba(148,163,184,.22);
    border-radius: 14px;
    padding: 12px 12px;
    outline: none;
  }
  .doa-lindo-input:focus, .doa-lindo-select:focus{
    border-color: rgba(34,197,94,.6);
    box-shadow: 0 0 0 4px rgba(34,197,94,.12);
  }

  .doa-lindo-slots{ display:grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  @media (max-width: 680px){ .doa-lindo-slots{ grid-template-columns: repeat(2, 1fr); } }

  .doa-lindo-slot{
    border: 1px solid rgba(148,163,184,.20);
    background: rgba(255,255,255,.03);
    color: var(--doa-text);
    padding: 10px 10px;
    border-radius: 14px;
    cursor: pointer;
    text-align:center;
    font-size: 13px;
    user-select:none;
  }
  .doa-lindo-slot:hover{ border-color: rgba(34,197,94,.5); }
  .doa-lindo-slot[aria-disabled='true']{ opacity:.45; cursor:not-allowed; }
  .doa-lindo-slot.is-active{
    border-color: rgba(34,197,94,.75);
    box-shadow: 0 0 0 4px rgba(34,197,94,.10);
  }

  .doa-lindo-actions{ display:flex; gap:10px; align-items:center; justify-content:flex-end; flex-wrap:wrap; margin-top: 14px; }
  .doa-lindo-btn{
    border: 1px solid rgba(148,163,184,.22);
    background: rgba(255,255,255,.03);
    color: var(--doa-text);
    border-radius: 14px;
    padding: 12px 14px;
    cursor:pointer;
    font-weight:600;
  }
  .doa-lindo-btn-primary{
    border: none;
    background: linear-gradient(135deg, rgba(34,197,94,1), rgba(6,182,212,1));
    color: #061016;
    box-shadow: 0 16px 35px rgba(34,197,94,.14);
  }
  .doa-lindo-btn:disabled{ opacity:.55; cursor:not-allowed; }

  .doa-lindo-toast{
    display:none;
    margin-top: 12px;
    padding: 12px 12px;
    border-radius: 14px;
    border:1px solid rgba(34,197,94,.35);
    background: rgba(34,197,94,.10);
    color: var(--doa-text);
    font-size: 13px;
  }
  .doa-lindo-toast.is-show{ display:block; }

  .doa-lindo-list{ display:flex; flex-direction:column; gap:10px; }
  .doa-lindo-item{
    border:1px solid rgba(148,163,184,.18);
    background: rgba(255,255,255,.03);
    border-radius: 16px;
    padding: 12px;
  }
  .doa-lindo-item .t1{ font-weight:700; font-size:13px; }
  .doa-lindo-item .t2{ color: var(--doa-muted); font-size: 12px; margin-top: 6px; }
  ";

  wp_register_style('doa-lindo-inline', false, [], '1.1.0');
  wp_enqueue_style('doa-lindo-inline');
  wp_add_inline_style('doa-lindo-inline', $css);

  wp_register_script('doa-lindo-js', false, [], '1.1.0', true);
  wp_enqueue_script('doa-lindo-js');
  wp_add_inline_script('doa-lindo-js', doa_lindo_js(), 'after');
}, 20);

function doa_lindo_js(): string {
  $ajax  = admin_url('admin-ajax.php');
  $nonce = wp_create_nonce('doa_lindo_demo_nonce');

  return <<<JS
(function(){
  const root = document.querySelector('[data-doa-lindo-root]');
  if(!root) return;

  const slotsWrap = root.querySelector('[data-doa-lindo-slots]');
  const slotInput = root.querySelector('input[name="time_slot"]');
  const toast = root.querySelector('[data-doa-lindo-toast]');
  const btn = root.querySelector('[data-doa-lindo-submit]');
  const form = root.querySelector('form');
  const recentWrap = root.querySelector('[data-doa-lindo-recent]');

  function pickSlot(el){
    if(el.getAttribute('aria-disabled') === 'true') return;
    [...slotsWrap.querySelectorAll('.doa-lindo-slot')].forEach(s => s.classList.remove('is-active'));
    el.classList.add('is-active');
    slotInput.value = el.getAttribute('data-value') || '';
    toast.classList.remove('is-show');
  }

  slotsWrap.addEventListener('click', (e)=>{
    const el = e.target.closest('.doa-lindo-slot');
    if(!el) return;
    pickSlot(el);
  });

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    toast.classList.remove('is-show');

    const fd = new FormData(form);
    if(!fd.get('time_slot')){
      toast.textContent = 'Please select a time slot.';
      toast.classList.add('is-show');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Submitting...';

    try{
      fd.append('action', 'doa_lindo_demo_submit');
      fd.append('_nonce', '{$nonce}');

      const res = await fetch('{$ajax}', { method:'POST', body: fd });
      const data = await res.json();

      if(!data || !data.ok){
        toast.textContent = (data && data.message) ? data.message : 'Something went wrong.';
        toast.classList.add('is-show');
        return;
      }

      toast.textContent = 'Booking received (demo). We will confirm via WhatsApp shortly.';
      toast.classList.add('is-show');

      if(recentWrap && Array.isArray(data.recent)){
        recentWrap.innerHTML = data.recent.map(r => {
          return `<div class="doa-lindo-item">
            <div class="t1">\${escapeHtml(r.service)} • \${escapeHtml(r.date)} • \${escapeHtml(r.time)}</div>
            <div class="t2">\${escapeHtml(r.name)} • \${escapeHtml(r.phone)} • \${escapeHtml(r.email || '-')}</div>
          </div>`;
        }).join('');
      }

      form.reset();
      slotInput.value = '';
      [...slotsWrap.querySelectorAll('.doa-lindo-slot')].forEach(s => s.classList.remove('is-active'));

    } catch(err){
      toast.textContent = 'Network error. Please try again.';
      toast.classList.add('is-show');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Submit Booking';
    }
  });

  function escapeHtml(v){
    const s = String(v ?? '');
    return s.replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;')
            .replace(/'/g,'&#039;');
  }
})();
JS;
}

add_action('wp_ajax_doa_lindo_demo_submit', 'doa_lindo_demo_submit');
add_action('wp_ajax_nopriv_doa_lindo_demo_submit', 'doa_lindo_demo_submit');

function doa_lindo_demo_submit() {
  if (!wp_verify_nonce($_POST['_nonce'] ?? '', 'doa_lindo_demo_nonce')) {
    wp_send_json(['ok' => false, 'message' => 'Security check failed. Refresh and try again.']);
  }

  $service = sanitize_text_field($_POST['service'] ?? '');
  $date    = sanitize_text_field($_POST['date'] ?? '');
  $time    = sanitize_text_field($_POST['time_slot'] ?? '');
  $name    = sanitize_text_field($_POST['name'] ?? '');
  $phone   = sanitize_text_field($_POST['phone'] ?? '');
  $email   = sanitize_email($_POST['email'] ?? '');
  $notes   = sanitize_textarea_field($_POST['notes'] ?? '');

  if ($service === '' || $date === '' || $time === '' || $name === '' || $phone === '') {
    wp_send_json(['ok' => false, 'message' => 'Please fill in all required fields.']);
  }

  $existing = get_option(DOA_LINDO_DEMO_OPTION_KEY, []);
  if (!is_array($existing)) $existing = [];

  $existing[] = [
    'service' => $service,
    'date'    => $date,
    'time'    => $time,
    'name'    => $name,
    'phone'   => $phone,
    'email'   => $email,
    'notes'   => $notes,
    'ts'      => time(),
  ];

  if (count($existing) > 30) $existing = array_slice($existing, -30);
  update_option(DOA_LINDO_DEMO_OPTION_KEY, $existing, false);

  $recent = array_reverse($existing);
  $recent = array_slice($recent, 0, 6);
  $recent = array_map(function($r){
    return [
      'service' => (string)($r['service'] ?? ''),
      'date'    => (string)($r['date'] ?? ''),
      'time'    => (string)($r['time'] ?? ''),
      'name'    => (string)($r['name'] ?? ''),
      'phone'   => (string)($r['phone'] ?? ''),
      'email'   => (string)($r['email'] ?? ''),
    ];
  }, $recent);

  wp_send_json(['ok' => true, 'recent' => $recent]);
}

add_shortcode('doa_lindo_booking_demo', function () {
  $existing = get_option(DOA_LINDO_DEMO_OPTION_KEY, []);
  if (!is_array($existing)) $existing = [];
  $recent = array_reverse($existing);
  $recent = array_slice($recent, 0, 6);

  $slots = [
    '10:00 AM','10:30 AM','11:00 AM','11:30 AM',
    '12:00 PM','12:30 PM','1:00 PM','1:30 PM',
    '2:00 PM','2:30 PM','3:00 PM','3:30 PM',
  ];

  ob_start(); ?>
  <div class="doa-lindo doa-lindo-wrap" data-doa-lindo-root>
    <div class="doa-lindo-shell">
      <div class="doa-lindo-top">
        <div class="doa-lindo-brand">
          <div class="doa-lindo-mark">
  <img
    src="https://demo.doasolutions.com.my/wp-content/uploads/2026/01/75ebd19f-754d-4003-8d5d-cd07c8f356ae-removebg-preview.png"
    alt="Lindo Clinic Logo"
    loading="eager"
    decoding="async"
  >
</div>
          <div>
            <h1 class="doa-lindo-h1">Lindo Clinic • Booking</h1>
            <p class="doa-lindo-sub">Demo experience — fast booking, clean UI, future-ready for claims & inventory.</p>
          </div>
        </div>
        <div class="doa-lindo-badges">
          <div class="doa-lindo-badge">Instant confirmation flow</div>
          <div class="doa-lindo-badge">Mobile-first</div>
          <div class="doa-lindo-badge">Demo-safe (no DB tables)</div>
        </div>
      </div>

      <div class="doa-lindo-grid">
        <div class="doa-lindo-card">
          <div class="doa-lindo-card-h">
            <h3 class="doa-lindo-card-title">Make an appointment</h3>
            <p class="doa-lindo-card-desc">Pick a service, date and time — then enter customer details.</p>
          </div>
          <div class="doa-lindo-card-b">
            <form>
              <div class="doa-lindo-row">
                <div class="doa-lindo-field">
                  <label>Service *</label>
                  <select class="doa-lindo-select" name="service" required>
                    <option value="">Select service</option>
                    <option>General Consultation</option>
                    <option>Medical Check-Up</option>
                    <option>Follow-Up</option>
                    <option>Lab Test</option>
                  </select>
                </div>
                <div class="doa-lindo-field">
                  <label>Date *</label>
                  <input class="doa-lindo-input" type="date" name="date" required />
                </div>
              </div>

              <div class="doa-lindo-field" style="margin-top:12px;">
                <label>Time slot *</label>
                <input type="hidden" name="time_slot" value="" />
                <div class="doa-lindo-slots" data-doa-lindo-slots>
                  <?php foreach ($slots as $s): ?>
                    <div class="doa-lindo-slot" role="button" tabindex="0" data-value="<?php echo esc_attr($s); ?>">
                      <?php echo esc_html($s); ?>
                    </div>
                  <?php endforeach; ?>
                </div>
              </div>

              <div class="doa-lindo-row" style="margin-top:12px;">
                <div class="doa-lindo-field">
                  <label>Full name *</label>
                  <input class="doa-lindo-input" type="text" name="name" placeholder="e.g. Nur Aisyah" required />
                </div>
                <div class="doa-lindo-field">
                  <label>Phone *</label>
                  <input class="doa-lindo-input" type="text" name="phone" placeholder="e.g. 01X-XXXXXXX" required />
                </div>
              </div>

              <div class="doa-lindo-row" style="margin-top:12px;">
                <div class="doa-lindo-field">
                  <label>Email</label>
                  <input class="doa-lindo-input" type="email" name="email" placeholder="optional" />
                </div>
                <div class="doa-lindo-field">
                  <label>Notes</label>
                  <input class="doa-lindo-input" type="text" name="notes" placeholder="optional" />
                </div>
              </div>

              <div class="doa-lindo-actions">
                <button class="doa-lindo-btn" type="reset">Clear</button>
                <button class="doa-lindo-btn doa-lindo-btn-primary" type="submit" data-doa-lindo-submit>Submit Booking</button>
              </div>

              <div class="doa-lindo-toast" data-doa-lindo-toast></div>
            </form>
          </div>
        </div>

        <div class="doa-lindo-card">
          <div class="doa-lindo-card-h">
            <h3 class="doa-lindo-card-title">Recent demo bookings</h3>
            <p class="doa-lindo-card-desc">This helps you see bookings.</p>
          </div>
          <div class="doa-lindo-card-b">
            <div class="doa-lindo-list" data-doa-lindo-recent>
              <?php if (empty($recent)): ?>
                <div class="doa-lindo-item">
                  <div class="t1">No bookings yet</div>
                  <div class="t2">Submit one booking to populate this list.</div>
                </div>
              <?php else: foreach ($recent as $r): ?>
                <div class="doa-lindo-item">
                  <div class="t1"><?php echo esc_html(($r['service'] ?? '').' • '.($r['date'] ?? '').' • '.($r['time'] ?? '')); ?></div>
                  <div class="t2"><?php echo esc_html(($r['name'] ?? '').' • '.($r['phone'] ?? '').' • '.(($r['email'] ?? '') ?: '-')); ?></div>
                </div>
              <?php endforeach; endif; ?>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  <?php
  return ob_get_clean();
});
