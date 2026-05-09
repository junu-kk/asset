import sharp from 'sharp';
import { resolve } from 'path';
import { mkdirSync } from 'fs';

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#22c55e" stop-opacity="0.3"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- 우측 장식 막대 그래프 -->
  <g transform="translate(820, 380)">
    <rect x="0"   y="-60"  width="40" height="60"  rx="4" fill="url(#bar)"/>
    <rect x="56"  y="-90"  width="40" height="90"  rx="4" fill="url(#bar)"/>
    <rect x="112" y="-140" width="40" height="140" rx="4" fill="url(#bar)"/>
    <rect x="168" y="-110" width="40" height="110" rx="4" fill="url(#bar)"/>
    <rect x="224" y="-180" width="40" height="180" rx="4" fill="url(#bar)"/>
    <rect x="280" y="-220" width="40" height="220" rx="4" fill="url(#bar)"/>
  </g>

  <!-- 메인 타이틀 -->
  <text x="100" y="280" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="100" font-weight="800" fill="#ffffff">Asset Tracker</text>

  <!-- 서브 타이틀 -->
  <text x="100" y="340" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="32" font-weight="500" fill="#94a3b8">Monthly asset tracker</text>

  <!-- 하단 URL -->
  <text x="100" y="560" font-family="ui-monospace, 'SF Mono', monospace" font-size="22" font-weight="400" fill="#64748b">junu-kk.github.io/asset</text>
</svg>`;

const outDir = resolve('public');
mkdirSync(outDir, { recursive: true });

await sharp(Buffer.from(svg))
  .resize(1200, 630)
  .png()
  .toFile(resolve(outDir, 'og.png'));

console.log('[og] public/og.png 생성됨');
