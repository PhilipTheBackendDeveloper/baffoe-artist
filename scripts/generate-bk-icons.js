const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

function createPNG(width, height, drawFn) {
  const rowSize = width * 4 + 1;
  const raw = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    raw[y * rowSize] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const offset = y * rowSize + 1 + x * 4;
      const color = drawFn(x, y, width, height);
      raw[offset] = color[0];     // R
      raw[offset + 1] = color[1]; // G
      raw[offset + 2] = color[2]; // B
      raw[offset + 3] = color[3]; // A
    }
  }

  const deflated = zlib.deflateSync(raw);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const crcBuf = Buffer.alloc(4);
    const crc = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  function crc32(buf) {
    let c = ~0;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (0xEDB88320 & -(c & 1));
      }
    }
    return ~c >>> 0;
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    header,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflated),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

// Check point in polygon
function pointInPoly(x, y, vs) {
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Distance to rounded rectangle (normalized 0..100)
function sdRoundedBox(px, py, bx, by, bw, bh, r) {
  const cx = bx + bw / 2;
  const cy = by + bh / 2;
  const dx = Math.abs(px - cx) - (bw / 2 - r);
  const dy = Math.abs(py - cy) - (bh / 2 - r);
  const outside = Math.sqrt(Math.max(0, dx) ** 2 + Math.max(0, dy) ** 2);
  const inside = Math.min(Math.max(dx, dy), 0);
  return (outside + inside) - r;
}

// Master BK Logo renderer (scale-independent)
function drawBKMonogram(x, y, W, H, isMaskable = false) {
  // Map x, y into 0..100 space
  let px = (x + 0.5) / W * 100;
  let py = (y + 0.5) / H * 100;

  if (isMaskable) {
    // safe zone scale (80%)
    px = (px - 50) / 0.82 + 50;
    py = (py - 50) / 0.82 + 50;
  }

  // Background box: 3, 3 to 97, 97, radius 22
  const dBox = sdRoundedBox(px, py, 3, 3, 94, 94, 22);

  // If outside the squircle and not maskable, transparent
  if (!isMaskable && dBox > 0.8) {
    return [0, 0, 0, 0];
  }

  // Background fill: obsidian gradient (#1f1e1e to #101010)
  const grad = Math.min(Math.max((px + py) / 200, 0), 1);
  let bgR = Math.round(31 - grad * 15);
  let bgG = Math.round(30 - grad * 14);
  let bgB = Math.round(30 - grad * 14);

  // Squircle stroke: #ccff00 (border width ~2.5)
  if (dBox >= -2.5 && dBox <= 0.5) {
    const strokeAlpha = Math.min(Math.max((0.5 - Math.abs(dBox + 1.0)) / 1.5, 0), 1);
    const goldR = 204, goldG = 255, goldB = 0;
    bgR = Math.round(bgR * (1 - strokeAlpha) + goldR * strokeAlpha);
    bgG = Math.round(bgG * (1 - strokeAlpha) + goldG * strokeAlpha);
    bgB = Math.round(bgB * (1 - strokeAlpha) + goldB * strokeAlpha);
  }

  // --- Monogram B (White #F8F8F8) ---
  // Outer B shape:
  // x: 22 to ~54, y: 25 to 69
  let inB = false;
  if (px >= 22 && px <= 56 && py >= 25 && py <= 69) {
    // Stem: 22 to 30
    if (px <= 30) {
      inB = true;
    } else {
      // Top lobe: y from 25 to 45.5, width expands up to 54
      if (py >= 25 && py <= 45.5) {
        const rad = 10.25;
        const cy = 35.25;
        const cx = 43;
        if (px <= cx || ((px - cx)**2 + (py - cy)**2 <= rad**2 && px <= 54)) {
          inB = true;
        }
      }
      // Bottom lobe: y from 45.5 to 69, width expands up to 56
      if (py >= 45.5 && py <= 69) {
        const rad = 11.75;
        const cy = 57.25;
        const cx = 42;
        if (px <= cx || ((px - cx)**2 + (py - cy)**2 <= rad**2 && px <= 56)) {
          inB = true;
        }
      }
    }

    // Cutouts inside B:
    // Top cutout: 30 to 41, y 32 to 40
    if (px >= 30 && px <= 46.5 && py >= 32 && py <= 40) {
      if (px <= 41 || ((px - 41)**2 + (py - 36)**2 <= 4**2)) {
        inB = false;
      }
    }
    // Bottom cutout: 30 to 42, y 47 to 57
    if (px >= 30 && px <= 48 && py >= 47 && py <= 57) {
      if (px <= 42 || ((px - 42)**2 + (py - 52)**2 <= 5**2)) {
        inB = false;
      }
    }
  }

  if (inB) {
    return [248, 248, 248, 255]; // Fine art crisp white
  }

  // --- Monogram K (Electric Gold / Lime #d9ff00 to #aee600) ---
  let inK = false;
  // K vertical stem: 54 to 62, y: 25 to 69
  if (px >= 54 && px <= 62 && py >= 25 && py <= 69) {
    inK = true;
  }
  // K upper arm polygon: (60,45), (74,25), (84,25), (67,49)
  const kTopPoly = [[60,45], [74,25], [84,25], [67,49]];
  if (pointInPoly(px, py, kTopPoly)) {
    inK = true;
  }
  // K lower arm polygon: (63,45), (84,69), (74,69), (57,51)
  const kBotPoly = [[63,45], [84,69], [74,69], [57,51]];
  if (pointInPoly(px, py, kBotPoly)) {
    inK = true;
  }

  if (inK) {
    // Gold gradient
    const kGrad = (py - 25) / 44;
    const kr = Math.round(217 - kGrad * 43); // 217 -> 174
    const kg = Math.round(255 - kGrad * 25); // 255 -> 230
    const kb = 0;
    return [kr, kg, kb, 255];
  }

  // --- Diamond Sparkle Accent at Top Right (x: 83, y: 22) ---
  const starPoly = [
    [83, 14], [85, 20], [91, 22], [85, 24],
    [83, 30], [81, 24], [75, 22], [81, 20]
  ];
  if (pointInPoly(px, py, starPoly)) {
    return [204, 255, 0, 255];
  }
  // Subtle sparkle glow
  const dStar = Math.sqrt((px - 83)**2 + (py - 22)**2);
  if (dStar < 9) {
    const glow = (1 - dStar / 9) * 0.35;
    bgR = Math.round(bgR * (1 - glow) + 204 * glow);
    bgG = Math.round(bgG * (1 - glow) + 255 * glow);
    bgB = Math.round(bgB * (1 - glow) + 0 * glow);
  }

  return [bgR, bgG, bgB, 255];
}

// Generate ICO file containing multiple PNG images
function createICO(pngBuffersWithSizes) {
  // ICO header: 6 bytes
  // Count: pngBuffersWithSizes.length
  const count = pngBuffersWithSizes.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  let offset = 6 + count * 16;
  const dirEntries = [];
  const imageBuffers = [];

  for (const item of pngBuffersWithSizes) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size >= 256 ? 0 : item.size, 0); // Width
    entry.writeUInt8(item.size >= 256 ? 0 : item.size, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // Image size in bytes
    entry.writeUInt32LE(offset, 12); // Offset to image data

    dirEntries.push(entry);
    imageBuffers.push(item.buffer);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

console.log("Generating Baffoe Kwabena BK Monogram Favicon and PWA Assets...");

// 1. Generate ICO sizes: 16, 32, 48, 64
const icoSizes = [16, 32, 48, 64];
const icoPngs = icoSizes.map(sz => ({
  size: sz,
  buffer: createPNG(sz, sz, (x, y, w, h) => drawBKMonogram(x, y, w, h, false))
}));

const icoBuffer = createICO(icoPngs);
fs.writeFileSync("img/favicon/favicon.ico", icoBuffer);
fs.writeFileSync("favicon.ico", icoBuffer); // Also write to root!
console.log("-> Created img/favicon/favicon.ico and /favicon.ico (Multi-size 16, 32, 48, 64):", icoBuffer.length, "bytes");

// 2. Generate Apple Touch Icon (180x180)
const appleTouchPNG = createPNG(180, 180, (x, y, w, h) => drawBKMonogram(x, y, w, h, false));
fs.writeFileSync("img/favicon/apple-touch-icon.png", appleTouchPNG);
fs.writeFileSync("apple-touch-icon.png", appleTouchPNG); // Also write to root!
console.log("-> Created img/favicon/apple-touch-icon.png and /apple-touch-icon.png:", appleTouchPNG.length, "bytes");

// 3. Generate PWA 192x192
const pwa192PNG = createPNG(192, 192, (x, y, w, h) => drawBKMonogram(x, y, w, h, false));
fs.writeFileSync("img/favicon/pwa-192.png", pwa192PNG);
console.log("-> Created img/favicon/pwa-192.png:", pwa192PNG.length, "bytes");

// 4. Generate PWA 512x512
const pwa512PNG = createPNG(512, 512, (x, y, w, h) => drawBKMonogram(x, y, w, h, false));
fs.writeFileSync("img/favicon/pwa-512.png", pwa512PNG);
console.log("-> Created img/favicon/pwa-512.png:", pwa512PNG.length, "bytes");

// 5. Generate PWA Maskable 512x512
const pwaMaskablePNG = createPNG(512, 512, (x, y, w, h) => drawBKMonogram(x, y, w, h, true));
fs.writeFileSync("img/favicon/pwa-maskable-512.png", pwaMaskablePNG);
console.log("-> Created img/favicon/pwa-maskable-512.png:", pwaMaskablePNG.length, "bytes");

// 6. Copy SVG to root icon.svg
fs.copyFileSync("img/icons/bk-logo.svg", "icon.svg");
console.log("-> Copied icon.svg to root");

console.log("All BK favicon and brand logo assets generated successfully!");
