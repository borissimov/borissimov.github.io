import fs from 'fs';
import { createCanvas } from 'canvas';

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);

    // Text "MP"
    ctx.fillStyle = '#f39c12';
    ctx.font = `bold ${size/2}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MP', size/2, size/2);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`public/pwa-${size}x${size}.png`, buffer);
    console.log(`Created ${size}x${size} icon`);
}

// Ensure public dir exists
if (!fs.existsSync('public')) fs.mkdirSync('public');

try {
    createIcon(192);
    createIcon(512);
} catch (e) {
    console.log("Could not generate icons (canvas missing). Please add pwa-192x192.png manually.");
}
