(function () {
	'use strict';

	var body = document.body;
	var splash = document.querySelector('.doa-splash');
	var enter = document.querySelector('.doa-enter');
	var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
	var modules = Array.prototype.slice.call(document.querySelectorAll('.doa-module-card'));
	var modulesSection = document.querySelector('.doa-modules');
	var scrollCue = document.querySelector('.doa-scroll-cue');
	var hero = document.querySelector('.doa-hero');
	var heroMap = document.querySelector('.doa-system-map');
	var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var finePointer = window.matchMedia('(pointer: fine)').matches;

	if (splash) {
		body.classList.add('no-scroll');
	}

	function enterSite() {
		body.classList.add('doa-entered');
		body.classList.remove('no-scroll');
		if (splash) {
			splash.setAttribute('aria-hidden', 'true');
		}
		window.setTimeout(updateScrollState, 40);
	}

	if (enter) {
		enter.addEventListener('click', enterSite);
	}

	var heroTargetX = 0;
	var heroTargetY = 0;
	var heroCurrentX = 0;
	var heroCurrentY = 0;

	function updateHeroParallax(event) {
		if (!event || !window.innerWidth || !window.innerHeight) {
			return;
		}

		heroTargetX = (event.clientX / window.innerWidth - 0.5) * 2;
		heroTargetY = (event.clientY / window.innerHeight - 0.5) * 2;
	}

	function setHeroMotion(x, y) {
		document.documentElement.style.setProperty('--hero-tilt-x', (-y * 10).toFixed(2) + 'deg');
		document.documentElement.style.setProperty('--hero-tilt-y', (x * 13).toFixed(2) + 'deg');
		document.documentElement.style.setProperty('--hero-shift-x', (x * 34).toFixed(1) + 'px');
		document.documentElement.style.setProperty('--hero-shift-y', (y * 26).toFixed(1) + 'px');
		document.documentElement.style.setProperty('--hero-far-x', (x * -18).toFixed(1) + 'px');
		document.documentElement.style.setProperty('--hero-far-y', (y * -12).toFixed(1) + 'px');
		document.documentElement.style.setProperty('--hero-mid-x', (x * 18).toFixed(1) + 'px');
		document.documentElement.style.setProperty('--hero-mid-y', (y * 12).toFixed(1) + 'px');
		document.documentElement.style.setProperty('--hero-near-x', (x * 36).toFixed(1) + 'px');
		document.documentElement.style.setProperty('--hero-near-y', (y * 24).toFixed(1) + 'px');
		document.documentElement.style.setProperty('--hero-core-x', (x * 26).toFixed(1) + 'px');
		document.documentElement.style.setProperty('--hero-core-y', (y * 18).toFixed(1) + 'px');
	}

	window.addEventListener('pointermove', updateHeroParallax, { passive: true });
	window.addEventListener('mousemove', updateHeroParallax, { passive: true });

	function animateHeroIdle(time) {
		var seconds = time / 1000;
		var idleX = Math.sin(seconds * 0.52) * 0.36 + Math.sin(seconds * 0.21) * 0.16;
		var idleY = Math.cos(seconds * 0.43) * 0.32 + Math.sin(seconds * 0.17) * 0.12;

		heroCurrentX += (heroTargetX - heroCurrentX) * 0.055;
		heroCurrentY += (heroTargetY - heroCurrentY) * 0.055;
		setHeroMotion(idleX + heroCurrentX * 0.82, idleY + heroCurrentY * 0.82);
		window.requestAnimationFrame(animateHeroIdle);
	}

	window.requestAnimationFrame(animateHeroIdle);

	if (heroMap) {
		var signalPaths = Array.prototype.slice.call(heroMap.querySelectorAll('.doa-system-map__link'));
		var primarySignalPaths = signalPaths.filter(function (path) {
			return path.classList.contains('doa-system-map__link--primary');
		});
		var panelByRouteName = {
			booking: heroMap.querySelector('.doa-system-map__panel--booking'),
			pos: heroMap.querySelector('.doa-system-map__panel--pos'),
			crm: heroMap.querySelector('.doa-system-map__panel--crm'),
			hr: heroMap.querySelector('.doa-system-map__panel--hr')
		};

		function pickSignalRoute() {
			var routePool = Math.random() > 0.36 ? primarySignalPaths : signalPaths;
			return routePool[Math.floor(Math.random() * routePool.length)];
		}

		function setSignalPosition(signal, path, progress) {
			var length = path.getTotalLength();
			var point = path.getPointAtLength(length * progress);
			var nextPoint = path.getPointAtLength(Math.min(length, length * progress + 0.7));
			var angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;

			signal.style.left = point.x + '%';
			signal.style.top = point.y + '%';
			signal.style.opacity = progress < 0.08 || progress > 0.9 ? '0' : '1';
			signal.style.transform = 'translate3d(-4px, -4px, 170px) scale(' + (progress > 0.16 && progress < 0.82 ? 1.05 : 0.68) + ')';
			signal.style.setProperty('--signal-angle', angle + 'deg');
		}

		function moveSignal(signal, path, duration) {
			var startedAt = performance.now();
			var routeName = path.getAttribute('data-route') || '';
			var routeParts = routeName.split('-');

			path.classList.add('is-active');
			routeParts.forEach(function (name) {
				if (panelByRouteName[name]) {
					panelByRouteName[name].classList.add('is-active');
				}
			});

			function tick(now) {
				var progress = Math.min(1, (now - startedAt) / duration);
				var eased = 1 - Math.pow(1 - progress, 3);

				setSignalPosition(signal, path, eased);

				if (progress < 1) {
					window.requestAnimationFrame(tick);
					return;
				}

				signal.style.opacity = '0';
				path.classList.remove('is-active');
				routeParts.forEach(function (name) {
					if (panelByRouteName[name]) {
						panelByRouteName[name].classList.remove('is-active');
					}
				});
			}

			window.requestAnimationFrame(tick);
		}

		function scheduleSignal(signal) {
			var delay = 900 + Math.random() * 1800;

			window.setTimeout(function () {
				var path = pickSignalRoute();

				if (path) {
					moveSignal(signal, path, 1450 + Math.random() * 650);
				}

				scheduleSignal(signal);
			}, delay);
		}

		for (var signalIndex = 0; signalIndex < 3 && signalPaths.length; signalIndex += 1) {
			var signal = document.createElement('span');
			signal.className = 'doa-system-map__signal';
			signal.setAttribute('aria-hidden', 'true');
			heroMap.appendChild(signal);
			window.setTimeout(scheduleSignal, signalIndex * 850, signal);
		}
	}

	if (finePointer && !reducedMotion) {
		var cursor = document.createElement('div');
		cursor.className = 'doa-cursor';
		cursor.setAttribute('aria-hidden', 'true');
		document.body.appendChild(cursor);

		window.addEventListener('mousemove', function (event) {
			cursor.classList.add('is-visible');
			cursor.style.left = event.clientX + 'px';
			cursor.style.top = event.clientY + 'px';
		}, { passive: true });

		Array.prototype.slice.call(document.querySelectorAll('a, button')).forEach(function (item) {
			item.addEventListener('mouseenter', function () {
				cursor.classList.add('is-active');
			});
			item.addEventListener('mouseleave', function () {
				cursor.classList.remove('is-active');
			});
		});
	}

	window.addEventListener('keydown', function (event) {
		if ((event.key === 'Enter' || event.key === ' ') && !body.classList.contains('doa-entered')) {
			enterSite();
		}
	});

	if (reducedMotion) {
		enterSite();
		reveals.forEach(function (item) {
			item.classList.add('is-visible');
		});
	}

	if (scrollCue) {
		scrollCue.addEventListener('click', function (event) {
			var target = document.querySelector(scrollCue.getAttribute('href'));
			if (target) {
				event.preventDefault();
				body.classList.add('doa-scroll-dismissed');
				target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
			}
		});
	}

	if ('IntersectionObserver' in window) {
		var observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

		reveals.forEach(function (item) {
			observer.observe(item);
		});
	} else {
		reveals.forEach(function (item) {
			item.classList.add('is-visible');
		});
	}

	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	function setActiveModule(index) {
		modules.forEach(function (card, cardIndex) {
			card.classList.toggle('is-active', cardIndex === index);
		});
	}

	function updateScrollState() {
		var maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
		var progress = clamp(window.scrollY / maxScroll, 0, 1);
		var earlyScroll = clamp(window.scrollY / Math.max(window.innerHeight * 1.15, 1), 0, 1);
		var firstScrollFade = clamp(1 - (window.scrollY / Math.max(window.innerHeight * 0.18, 1)), 0, 1);
		var cueOpacity = body.classList.contains('doa-scroll-dismissed') ? 0 : firstScrollFade;
		var cueY = Math.round(earlyScroll * 54);
		document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
		document.documentElement.style.setProperty('--scroll-cue-opacity', cueOpacity.toFixed(4));
		document.documentElement.style.setProperty('--scroll-cue-y', cueY + 'px');

		if (hero) {
			var heroRect = hero.getBoundingClientRect();
			var heroRange = Math.max(hero.offsetHeight - window.innerHeight, 1);
			var heroProgress = clamp(-heroRect.top / heroRange, 0, 1);
			var heroTextProgress = clamp(heroProgress / 0.62, 0, 1);
			var heroBgExitProgress = clamp((heroProgress - 0.72) / 0.28, 0, 1);
			var heroTitleY = Math.round(heroTextProgress * -82);
			var heroCopyY = Math.round(heroTextProgress * -24);
			var heroBgY = Math.round(heroBgExitProgress * window.innerHeight * -0.96);
			var heroTextOpacity = clamp(1 - heroTextProgress * 1.18, 0, 1);

			document.documentElement.style.setProperty('--hero-title-y', heroTitleY + 'px');
			document.documentElement.style.setProperty('--hero-copy-y', heroCopyY + 'px');
			document.documentElement.style.setProperty('--hero-bg-y', heroBgY + 'px');
			document.documentElement.style.setProperty('--hero-title-opacity', heroTextOpacity.toFixed(4));
			document.documentElement.style.setProperty('--hero-copy-opacity', heroTextOpacity.toFixed(4));
		}

		if (!modulesSection || !modules.length || window.matchMedia('(max-width: 960px)').matches) {
			return;
		}

		var rect = modulesSection.getBoundingClientRect();
		var range = Math.max(modulesSection.offsetHeight - window.innerHeight, 1);
		var localProgress = clamp(Math.abs(rect.top) / range, 0, 0.999);
		var active = Math.floor(localProgress * modules.length);
		setActiveModule(active);
	}

	var ticking = false;
	function requestScrollUpdate() {
		if (ticking) {
			return;
		}

		window.requestAnimationFrame(function () {
			updateScrollState();
			ticking = false;
		});
		ticking = true;
	}

	window.addEventListener('scroll', requestScrollUpdate, { passive: true });
	window.addEventListener('resize', requestScrollUpdate);
	updateScrollState();
})();
