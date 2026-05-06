(function () {
	'use strict';

	var body = document.body;
	var splash = document.querySelector('.doa-splash');
	var enter = document.querySelector('.doa-enter');
	var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
	var modules = Array.prototype.slice.call(document.querySelectorAll('.doa-module-card'));
	var modulesSection = document.querySelector('.doa-modules');
	var scrollCue = document.querySelector('.doa-scroll-cue');
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

	if (finePointer && !reducedMotion) {
		var cursor = document.createElement('div');
		cursor.className = 'doa-cursor';
		cursor.setAttribute('aria-hidden', 'true');
		document.body.appendChild(cursor);

		window.addEventListener('mousemove', function (event) {
			cursor.classList.add('is-visible');
			cursor.style.left = event.clientX + 'px';
			cursor.style.top = event.clientY + 'px';

			var x = (event.clientX / window.innerWidth - 0.5) * 2;
			var y = (event.clientY / window.innerHeight - 0.5) * 2;
			document.documentElement.style.setProperty('--hero-tilt-x', (-y * 7).toFixed(2) + 'deg');
			document.documentElement.style.setProperty('--hero-tilt-y', (x * 9).toFixed(2) + 'deg');
			document.documentElement.style.setProperty('--hero-shift-x', (x * 18).toFixed(1) + 'px');
			document.documentElement.style.setProperty('--hero-shift-y', (y * 14).toFixed(1) + 'px');
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
		if (window.scrollY > 8) {
			body.classList.add('doa-scroll-dismissed');
		}
		var cueOpacity = body.classList.contains('doa-scroll-dismissed') ? 0 : clamp(1 - ((earlyScroll - 0.18) / 0.46), 0, 1);
		var cueY = Math.round(earlyScroll * 54);
		document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
		document.documentElement.style.setProperty('--scroll-cue-opacity', cueOpacity.toFixed(4));
		document.documentElement.style.setProperty('--scroll-cue-y', cueY + 'px');

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
