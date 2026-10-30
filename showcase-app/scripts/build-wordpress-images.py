"""Build correctly sized images from the original brand/photo assets."""
from pathlib import Path
import hashlib
import io
import json
from PIL import Image

assets = Path(__file__).resolve().parents[2] / 'wp-content/themes/doa-astra-child/assets/images'
manifest = {}
for key, source, widths in [
    ('logo', 'doa-logo-mark-transparent.png', [128, 256, 512]),
    ('comparison', 'doa-scattered-workdesk.jpg', [800, 1280, 2206]),
]:
    original = Image.open(assets / source)
    manifest[key] = []
    for width in widths:
        image = original.copy()
        image.thumbnail((width, 4096), Image.Resampling.LANCZOS)
        output = io.BytesIO()
        kwargs = {'lossless': True} if key == 'logo' else {'quality': 86}
        image.save(output, format='WEBP', method=6, **kwargs)
        data = output.getvalue()
        name = f'doa-{key}-{width}.{hashlib.sha256(data).hexdigest()[:12]}.webp'
        (assets / name).write_bytes(data)
        manifest[key].append({'file': name, 'width': image.width, 'height': image.height, 'bytes':len(data)})
        print(name, len(data))
(assets / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
