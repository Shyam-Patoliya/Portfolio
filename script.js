/**
 * Scroll-Based Frame Animation Controller
 * 
 * Preloads all 192 frames and maps scroll position to the current frame,
 * drawing it on a fixed <canvas> for maximum performance. Uses a continuous
 * requestAnimationFrame loop for smooth, jank-free rendering.
 */

(function () {
    'use strict';

    // ── Configuration ───────────────────────────────────────────
    const FRAME_COUNT = 192;
    const FRAME_PATH  = './frames/';
    const FRAME_EXT   = '.jpg';

    // ── DOM Elements ────────────────────────────────────────────
    const canvas = document.getElementById('frame-canvas');
    const ctx    = canvas.getContext('2d');

    // ── State ───────────────────────────────────────────────────
    const images       = new Array(FRAME_COUNT);
    let   loadedCount  = 0;
    let   currentFrame = -1;

    // ── Loading overlay (inject dynamically) ────────────────────
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-text">Loading</div>
        <div class="loading-bar-track">
            <div class="loading-bar-fill" id="loading-bar-fill"></div>
        </div>
    `;
    document.body.appendChild(overlay);
    document.body.classList.add('loading');

    const loadingBarFill = document.getElementById('loading-bar-fill');

    // ── Helpers ─────────────────────────────────────────────────

    function padFrame(n) {
        return String(n).padStart(6, '0');
    }

    function frameSrc(n) {
        return FRAME_PATH + 'frame_' + padFrame(n) + FRAME_EXT;
    }

    /** Size the canvas to match the window (retina-aware) */
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width  = window.innerWidth  * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /** Draw a specific frame index (0-based) onto the canvas */
    function drawFrame(index) {
        var img = images[index];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        var cw = window.innerWidth;
        var ch = window.innerHeight;

        // Cover-fit: scale image to fully cover the canvas viewport
        var imgAspect    = img.naturalWidth / img.naturalHeight;
        var canvasAspect = cw / ch;
        var drawW, drawH, drawX, drawY;

        if (canvasAspect > imgAspect) {
            drawW = cw;
            drawH = cw / imgAspect;
            drawX = 0;
            drawY = (ch - drawH) / 2;
        } else {
            drawH = ch;
            drawW = ch * imgAspect;
            drawX = (cw - drawW) / 2;
            drawY = 0;
        }

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }

    // ── Continuous animation loop ───────────────────────────────
    function tick() {
        var scrollTop    = window.scrollY;
        var docHeight    = document.documentElement.scrollHeight;
        var windowHeight = window.innerHeight;
        var maxScroll    = docHeight - windowHeight;

        var frameIndex = 0;
        if (maxScroll > 0) {
            var scrollFraction = scrollTop / maxScroll;
            if (scrollFraction < 0) scrollFraction = 0;
            if (scrollFraction > 1) scrollFraction = 1;
            frameIndex = Math.floor(scrollFraction * (FRAME_COUNT - 1));
        }

        if (frameIndex !== currentFrame) {
            currentFrame = frameIndex;
            drawFrame(currentFrame);
        }

        // Always keep the loop running
        requestAnimationFrame(tick);
    }

    // ── Image preloading ────────────────────────────────────────

    function onImageLoad() {
        loadedCount++;
        var pct = (loadedCount / FRAME_COUNT) * 100;
        loadingBarFill.style.width = pct + '%';

        // Draw frame 0 as soon as it's ready
        if (images[0] && images[0].complete && images[0].naturalWidth > 0 && currentFrame < 0) {
            currentFrame = 0;
            drawFrame(0);
        }

        if (loadedCount >= FRAME_COUNT) {
            onAllLoaded();
        }
    }

    function onAllLoaded() {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        overlay.classList.add('hidden');
        setTimeout(function() { overlay.remove(); }, 600);
    }

    function preloadImages() {
        for (var i = 1; i <= FRAME_COUNT; i++) {
            var img = new Image();
            img.src = frameSrc(i);
            img.onload = onImageLoad;
            img.onerror = onImageLoad;
            images[i - 1] = img;
        }
    }

    // ── Initialize ──────────────────────────────────────────────
    resizeCanvas();
    window.addEventListener('resize', function() {
        resizeCanvas();
        if (currentFrame >= 0) drawFrame(currentFrame);
    });

    // Start the continuous rAF loop
    requestAnimationFrame(tick);

    // Begin preloading
    preloadImages();
})();
