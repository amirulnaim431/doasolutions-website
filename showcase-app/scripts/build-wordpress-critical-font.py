"""Embed only the homepage title glyphs, preserving the original 800 face."""
from pathlib import Path
import base64
import io
import re
import html
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

assets = Path(__file__).resolve().parents[2] / 'wp-content/themes/doa-astra-child/assets'
source = (assets.parent / 'front-page.php').read_text()
title = html.unescape(re.sub('<[^>]+>', '', re.search(r'<h1[^>]*>(.*?)</h1>', source).group(1))).upper()
lead = html.unescape(re.search(r'<p class="doa-hero-v2__lead[^>]*>(.*?)</p>', source).group(1))
css = '/* Critical hero glyphs preserve the original font outlines and metrics. */\n'
for family, filename, weight, text in [
    ('Roboto Condensed', 'roboto-condensed-8d230115e58f.woff2', 800, title),
    ('Inter', 'inter-3100e775e861.woff2', 400, lead),
]:
    font = TTFont(assets / 'fonts' / filename)
    font = instantiateVariableFont(font, {'wght': weight}, inplace=False)
    options = subset.Options()
    options.flavor = 'woff2'
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    output = io.BytesIO()
    font.save(output)
    data = output.getvalue()
    ranges = ','.join(f'U+{ord(c):04X}' for c in sorted(set(text)))
    css += f"@font-face{{font-family:'{family}';font-style:normal;font-weight:{weight};font-display:block;"
    css += "src:url(data:font/woff2;base64," + base64.b64encode(data).decode() + ") format('woff2');"
    css += 'unicode-range:' + ranges + ';}\n'
    print(f'Critical {family} {weight}:', len(data), 'bytes')
(assets / 'doa-critical-font.css').write_text(css)
