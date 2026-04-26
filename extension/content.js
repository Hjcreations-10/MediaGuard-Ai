const API_BASE = 'https://mediaguard-backend-754243926127.us-central1.run.app';
const SCANNED_IMAGES = new Set();

async function checkImage(img) {
    const src = img.src;
    if (!src || SCANNED_IMAGES.has(src)) return;
    if (src.startsWith('data:')) return; // Skip base64 for now

    SCANNED_IMAGES.add(src);

    try {
        const response = await fetch(`${API_BASE}/scan-url?url=${encodeURIComponent(src)}`);
        const data = await response.json();

        if (data.score > 0.85) {
            flagImage(img, data);
        }
    } catch (err) {
        console.error('GuardMedia: Failed to scan image', src);
    }
}

function flagImage(img, data) {
    console.warn('GuardMedia: Potential unauthorized content detected!', data);
    
    // Add visual indicator
    img.style.outline = '4px solid #ef4444';
    img.style.outlineOffset = '-4px';
    img.title = `⚠️ GuardMedia: Potential Unauthorized Content (${(data.score * 100).toFixed(1)}% match with ${data.matched_with})`;
    
    // Create overlay label
    const label = document.createElement('div');
    label.innerText = '⚠️ Potential Unauthorized';
    label.style.position = 'absolute';
    label.style.background = '#ef4444';
    label.style.color = 'white';
    label.style.padding = '4px 8px';
    label.style.fontSize = '10px';
    label.style.fontWeight = 'bold';
    label.style.zIndex = '99999';
    label.style.borderRadius = '4px';
    label.style.pointerEvents = 'none';

    // Position label
    const rect = img.getBoundingClientRect();
    label.style.top = `${window.scrollY + rect.top}px`;
    label.style.left = `${window.scrollX + rect.left}px`;

    document.body.appendChild(label);
}

// Initial scan
function scan() {
    const images = document.getElementsByTagName('img');
    for (let img of images) {
        checkImage(img);
    }
}

// Debounced scan to prevent lag on busy pages
let scanTimeout = null;
const debouncedScan = () => {
    if (scanTimeout) clearTimeout(scanTimeout);
    scanTimeout = setTimeout(scan, 500);
};

// Watch for new images
const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.addedNodes.length) {
            debouncedScan();
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

// Run initial scan
scan();
console.log('GuardMedia: Real-time scanner initialized with optimization.');
