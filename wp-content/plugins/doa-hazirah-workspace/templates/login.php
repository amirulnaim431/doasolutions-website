<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex,nofollow,noarchive">
	<title>Hazirah's Workspace · DOA Solutions</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet">
	<style>
		:root{--ink:#17352f;--green:#087f62;--mint:#bdf3d7;--cream:#fffaf0;--purple:#c9b7ff;--coral:#ffb2a6;--yellow:#ffd875}
		*{box-sizing:border-box}body{margin:0;min-height:100vh;font-family:"DM Sans",sans-serif;color:var(--ink);background:linear-gradient(135deg,#f8fff9 0%,#fff8ef 50%,#f9f4ff 100%);display:grid;place-items:center;padding:24px;overflow-x:hidden}
		.blob{position:fixed;border-radius:999px;filter:blur(2px);z-index:-1;opacity:.75}.blob-a{width:360px;height:360px;background:var(--mint);left:-120px;top:-90px}.blob-b{width:310px;height:310px;background:var(--purple);right:-90px;bottom:-100px}.blob-c{width:150px;height:150px;background:var(--yellow);right:8%;top:7%}
		.login-shell{width:min(100%,980px);display:grid;grid-template-columns:1.15fr .85fr;background:#fff;border:1px solid rgba(23,53,47,.1);border-radius:32px;overflow:hidden;box-shadow:0 28px 80px rgba(31,72,61,.14)}
		.welcome{padding:64px;background:var(--green);color:#fff;position:relative;overflow:hidden}.welcome:after{content:"";position:absolute;width:260px;height:260px;border:70px solid rgba(255,255,255,.09);border-radius:50%;right:-100px;bottom:-110px}
		.brand{font-weight:700;letter-spacing:.16em;text-transform:uppercase;font-size:12px}.welcome h1{font:700 clamp(42px,6vw,68px)/.98 "Fraunces",serif;letter-spacing:-.04em;margin:88px 0 18px}.welcome p{font-size:17px;line-height:1.65;max-width:420px;color:#dff9ec}
		.dots{display:flex;gap:10px;margin-top:52px}.dots i{display:block;width:14px;height:14px;border-radius:50%}.dots i:nth-child(1){background:var(--yellow)}.dots i:nth-child(2){background:var(--coral)}.dots i:nth-child(3){background:var(--purple)}.dots i:nth-child(4){background:#86c6ff}
		.login-panel{padding:64px 50px;display:flex;flex-direction:column;justify-content:center}.eyebrow{color:var(--green);font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}.login-panel h2{font:700 34px/1.1 "Fraunces",serif;margin:10px 0 8px}.sub{color:#668078;margin:0 0 34px}
		label{font-size:13px;font-weight:700;display:block;margin:18px 0 8px}input[type=text],input[type=password]{width:100%;border:1.5px solid #d9e5e0;border-radius:13px;padding:14px 16px;font:inherit;color:var(--ink);outline:none;transition:.2s}input:focus{border-color:var(--green);box-shadow:0 0 0 4px rgba(8,127,98,.12)}
		.remember{display:flex;align-items:center;gap:9px;margin:16px 0 24px;color:#526c64;font-size:14px}.remember input{accent-color:var(--green)}
		button{width:100%;border:0;border-radius:13px;background:var(--green);color:#fff;padding:15px 18px;font:700 15px "DM Sans",sans-serif;cursor:pointer;box-shadow:0 10px 22px rgba(8,127,98,.22);transition:transform .2s,background .2s}button:hover{background:#066c53;transform:translateY(-1px)}button:focus-visible{outline:3px solid var(--yellow);outline-offset:3px}
		.error{background:#fff0ed;border:1px solid #ffcbc2;color:#9b3526;padding:12px 14px;border-radius:12px;font-size:14px;margin:0 0 8px}.privacy{font-size:12px;color:#80928d;text-align:center;margin:22px 0 0}
		@media(max-width:760px){.login-shell{grid-template-columns:1fr}.welcome{padding:32px}.welcome h1{margin:44px 0 14px}.dots{margin-top:30px}.login-panel{padding:38px 28px}}
	</style>
</head>
<body>
	<div class="blob blob-a"></div><div class="blob blob-b"></div><div class="blob blob-c"></div>
	<main class="login-shell">
		<section class="welcome" aria-label="Welcome">
			<div class="brand">DOA Solutions</div>
			<h1>Your year,<br>beautifully clear.</h1>
			<p>A private little corner to plan, track and celebrate every piece of work—one colourful month at a time.</p>
			<div class="dots" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
		</section>
		<section class="login-panel">
			<span class="eyebrow">Private workspace</span>
			<h2>Welcome back, Hazirah</h2>
			<p class="sub">Sign in to open your annual planner.</p>
			<?php if ( $error ) : ?>
				<div class="error" role="alert"><?php echo esc_html( $error ); ?></div>
			<?php endif; ?>
			<form method="post" action="<?php echo esc_url( DOA_Hazirah_Workspace::workspace_url() ); ?>">
				<?php wp_nonce_field( 'doa_hazirah_login', 'doa_hazirah_login_nonce' ); ?>
				<input type="hidden" name="doa_hazirah_login" value="1">
				<label for="username">Username</label>
				<input id="username" name="username" type="text" autocomplete="username" required autofocus>
				<label for="password">Password</label>
				<input id="password" name="password" type="password" autocomplete="current-password" required>
				<label class="remember"><input type="checkbox" name="remember" value="1"> Keep me signed in on this device</label>
				<button type="submit">Open my workspace</button>
			</form>
			<p class="privacy">Protected by DOA Solutions · Not visible on the public website</p>
		</section>
	</main>
</body>
</html>

