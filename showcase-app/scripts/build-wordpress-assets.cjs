/* Minify delivery assets without changing the editable animation sources. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const postcss = require('postcss');
const cssnano = require('next/dist/compiled/cssnano-simple');
const terser = require('next/dist/compiled/terser');
const assets = path.resolve(__dirname, '../../wp-content/themes/doa-astra-child/assets');
const dist = path.join(assets, 'dist');
fs.mkdirSync(dist, { recursive: true });
const hash = value => crypto.createHash('sha256').update(value).digest('hex').slice(0, 12);

(async () => {
  const manifest = {};
  for (const [key, file] of [['homeCss','doa-home.css'],['fontCss','doa-fonts.css']]) {
    let input = fs.readFileSync(path.join(assets, file), 'utf8');
    if (key === 'fontCss') input += fs.readFileSync(path.join(assets, 'doa-critical-font.css'), 'utf8');
    // Preserve custom-property names and every animation/keyframe name.
    const result = await postcss([cssnano({ reduceIdents: false, zindex: false })]).process(input, {from: undefined, map: false});
    const name = `${path.basename(file, '.css')}.${hash(result.css)}.min.css`;
    fs.writeFileSync(path.join(dist, name), result.css);
    manifest[key] = `dist/${name}`;
    console.log(file, Buffer.byteLength(input), '->', Buffer.byteLength(result.css));
  }
  for (const [key, file] of [['homeJs','doa-home.js'],['venomJs','venom-button/doa-venom.js']]) {
    const input = fs.readFileSync(path.join(assets, file), 'utf8');
    const result = await terser.minify(input, {ecma:2020, compress:{passes:2}, mangle:true, format:{comments:/MIT license|@license|@preserve/}});
    if (result.error) throw result.error;
    const name = `${path.basename(file, '.js')}.${hash(result.code)}.min.js`;
    fs.writeFileSync(path.join(dist, name), result.code);
    manifest[key] = `dist/${name}`;
    console.log(file, Buffer.byteLength(input), '->', Buffer.byteLength(result.code));
  }
  fs.writeFileSync(path.join(dist,'manifest.json'), JSON.stringify(manifest,null,2)+'\n');
})();
