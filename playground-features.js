/**
 * playground-features.js
 * Comprehensive features:
 * 1. Sample codes catalog & one-click loader
 * 2. Mobile Phone Preview with realistic smartphone mockup, dynamic island & orientation toggle
 * 3. Fullscreen Preview overlay & native fullscreen
 * 4. Code in permalink & QR Code share
 * 5. Automatic live output speech with mute controls
 * 6. Popup Fill-in-the-Blanks with class filters, optional hints & auto-popup on refresh
 */

(function () {
    // -------------------------------------------------------------
    // 1. SAMPLE CODES CATALOG (HTML, CSS, JS)
    // -------------------------------------------------------------
    const sampleCatalogUrl = new URL('samples.json', document.currentScript?.src || document.baseURI).href;
    let sampleCatalogPromise;

    async function loadSampleCatalog() {
        if (!sampleCatalogPromise) {
            sampleCatalogPromise = (async () => {
                const response = await fetch(sampleCatalogUrl);
                if (!response.ok) throw new Error('Could not load samples.json');
                const samples = await response.json();
                const ids = new Set();
                if (!Array.isArray(samples) || !samples.length || samples.some(sample => {
                    if (!sample || typeof sample.id !== 'string' || !sample.id || ids.has(sample.id) ||
                        ['title', 'badge', 'description', 'html', 'css', 'js'].some(key => typeof sample[key] !== 'string')) return true;
                    ids.add(sample.id);
                    return false;
                })) throw new Error('Invalid sample catalog');
                const dropdown = document.getElementById('pf-sample-select');
                if (dropdown) {
                    dropdown.replaceChildren(new Option('📚 Load Sample...', ''));
                    samples.forEach(sample => dropdown.add(new Option(sample.title, sample.id)));
                    dropdown.disabled = false;
                }
                return samples;
            })().catch(error => {
                sampleCatalogPromise = null; // Allow retry through the Samples gallery.
                throw error;
            });
        }
        return sampleCatalogPromise;
    }

    // -------------------------------------------------------------
    // 2. FILL IN THE BLANKS QUESTIONS JSON LIST
    //    (Multiple blanks per single question)
    // -------------------------------------------------------------
    const quizCatalogUrl = new URL('fib-questions.json', document.currentScript?.src || document.baseURI).href;
    let quizCatalog = [];
    let quizCatalogPromise;

    function loadQuizCatalog() {
        if (quizCatalogPromise) return quizCatalogPromise;
        renderQuiz(0);
        const sentence = document.getElementById('pf-quiz-sentence');
        sentence.textContent = 'Loading questions…';
        document.getElementById('pf-quiz-title-text').textContent = 'Fill in the Blanks';
        document.querySelectorAll('.pf-quiz-filters select').forEach(select => { select.disabled = true; });
        quizCatalogPromise = (async () => {
            const response = await fetch(quizCatalogUrl);
            if (!response.ok) throw new Error('Could not load fib-questions.json');
            const questions = await response.json();
            const ids = new Set();
            if (!Array.isArray(questions) || !questions.length || questions.some(q => {
                if (!q || ids.has(q.id) || q.id == null ||
                    ['title', 'category', 'subject', 'description', 'template', 'explanation', 'codeSnippet'].some(key => typeof q[key] !== 'string') ||
                    !Number.isInteger(q.difficulty) || q.difficulty < 1 ||
                    !Array.isArray(q.classLevels) || q.classLevels.some(level => !Number.isInteger(level)) ||
                    !Array.isArray(q.prerequisites) || q.prerequisites.some(item => typeof item !== 'string') ||
                    !Array.isArray(q.blanks) || !q.blanks.length) return true;
                ids.add(q.id);
                const blankIds = new Set();
                return q.blanks.some(blank => {
                    if (!blank || typeof blank.id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(blank.id) ||
                        blankIds.has(blank.id) || typeof blank.answer !== 'string' || !blank.answer.trim() ||
                        q.template.split(`[${blank.id}]`).length !== 2) return true;
                    blankIds.add(blank.id);
                    return false;
                });
            })) throw new Error('Invalid quiz catalog');
            quizCatalog = questions;
            setupQuizFilters();
            shuffleQuizQuestions();
            document.querySelectorAll('.pf-quiz-filters select').forEach(select => { select.disabled = false; });
        })().catch(() => {
            quizCatalogPromise = null;
            document.getElementById('pf-quiz-title-text').textContent = 'Questions unavailable';
            sentence.textContent = 'Could not load quiz questions. ';
            const retry = document.createElement('button');
            retry.className = 'pf-btn pf-btn-samples';
            retry.textContent = 'Retry';
            retry.onclick = () => loadQuizCatalog();
            sentence.append(retry);
        });
        return quizCatalogPromise;
    }

    let currentQuizList = [];
    const quizFilters = { category: "HTML", classLevels: "6", subject: "all", difficulty: "1" };
    const excludedQuizPrerequisites = new Set();
    let quizAnswersRevealed = false;
    let activeQuizIndex = 0;


    // -------------------------------------------------------------
    // 3. TOAST HELPER
    // -------------------------------------------------------------
    function showPfToast(message) {
        let toast = document.getElementById('pf-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'pf-toast';
            toast.className = 'pf-toast';
            document.body.appendChild(toast);
        }
        toast.innerText = message;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // -------------------------------------------------------------
    // 4. EDITOR HELPERS (Works with CodeMirror instances)
    // -------------------------------------------------------------
    function getEditorInstances() {
        return {
            html: window.htmlEditor,
            css: window.cssEditor,
            js: window.jsEditor
        };
    }

    function triggerUpdatePreview() {
        if (typeof window.updatePreview === 'function') {
            window.updatePreview();
        }
    }

    // -------------------------------------------------------------
    // 5. SAMPLE CODES LOADER
    // -------------------------------------------------------------
    async function loadSample(sampleId) {
        let samples;
        try { samples = await loadSampleCatalog(); }
        catch (_) { showPfToast('Could not load samples. Open Samples to retry.'); return; }
        const sample = samples.find(s => s.id === sampleId);
        if (!sample) return;

        const editors = getEditorInstances();
        if (editors.html && sample.html !== undefined) editors.html.setValue(sample.html);
        if (editors.css && sample.css !== undefined) editors.css.setValue(sample.css);
        if (editors.js && sample.js !== undefined) editors.js.setValue(sample.js);

        // Open the sample's main source file; every editor already contains its matching code.
        if (typeof window.toggleFile === 'function') {
            window.toggleFile(sample.category === 'CSS' ? 'css' : sample.category === 'JavaScript' ? 'js' : 'html');
        }
        triggerUpdatePreview();
        showPfToast(`🚀 Loaded sample: "${sample.title}"!`);

        // Close modal if open
        closeModal('pf-samples-modal');

        // Update dropdown if present
        const dropdown = document.getElementById('pf-sample-select');
        if (dropdown) dropdown.value = sampleId;
    }

    async function openSamplesModal() {
        const container = document.getElementById('pf-samples-grid');
        openModal('pf-samples-modal');
        if (!container) return;
        container.textContent = 'Loading samples…';
        try {
            const samples = await loadSampleCatalog();
            container.replaceChildren();
            samples.forEach(sample => {
                const card = document.createElement('div');
                card.className = 'pf-sample-card';
                const content = document.createElement('div');
                const header = document.createElement('div');
                header.className = 'pf-sample-card-header';
                const title = document.createElement('h4');
                title.className = 'pf-sample-card-title';
                title.textContent = sample.title;
                const badge = document.createElement('span');
                badge.className = 'pf-sample-badge';
                badge.textContent = sample.badge;
                const description = document.createElement('p');
                description.className = 'pf-sample-desc';
                description.textContent = sample.description;
                const button = document.createElement('button');
                button.className = 'pf-sample-load-btn';
                button.textContent = '⚡ Load into Playground';
                card.onclick = () => loadSample(sample.id);
                button.onclick = event => { event.stopPropagation(); loadSample(sample.id); };
                header.append(title, badge);
                content.append(header, description);
                card.append(content, button);
                container.append(card);
            });
        } catch (_) {
            container.textContent = 'Could not load samples. Close and reopen Samples to retry.';
        }
    }

    // -------------------------------------------------------------
    // 6. PHONE PREVIEW CONTROLLER
    // -------------------------------------------------------------
    let isPhoneMode = false;
    let isLandscape = false;

    function fitPhonePreview() {
        const container = document.getElementById('preview-container');
        const shell = document.getElementById('pf-phone-shell');
        if (!isPhoneMode || !container || !shell) return;
        const toolbar = container.querySelector('.pf-phone-toolbar');
        const style = getComputedStyle(container);
        const width = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 24;
        const height = container.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) - toolbar.offsetHeight - 24;
        shell.style.zoom = Math.max(0.1, Math.min(1, width / shell.offsetWidth, height / shell.offsetHeight));
    }

    function togglePhonePreview(forceState) {
        const previewContainer = document.querySelector('.preview-container') || document.getElementById('preview-container');
        const phoneBtn = document.getElementById('pf-phone-btn');
        if (!previewContainer) return;

        isPhoneMode = typeof forceState === 'boolean' ? forceState : !isPhoneMode;

        if (isPhoneMode) {
            previewContainer.classList.add('phone-mode-active');
            if (phoneBtn) {
                phoneBtn.classList.add('active');
                phoneBtn.innerHTML = '🖥️ Desktop Preview';
            }
            updatePhoneClock();
            requestAnimationFrame(fitPhonePreview);
            showPfToast('📱 Smartphone Preview Mode activated');
        } else {
            previewContainer.classList.remove('phone-mode-active');
            document.getElementById('pf-phone-shell').style.zoom = '';
            if (phoneBtn) {
                phoneBtn.classList.remove('active');
                phoneBtn.innerHTML = '📱 Phone Preview';
            }
            showPfToast('🖥️ Switched back to Desktop Preview');
        }
    }

    function setPhoneDevice(deviceKey) {
        const shell = document.getElementById('pf-phone-shell');
        if (!shell) return;
        shell.className = `pf-phone-shell device-${deviceKey}${isLandscape ? ' landscape' : ''}`;
        requestAnimationFrame(fitPhonePreview);
    }

    function togglePhoneOrientation() {
        isLandscape = !isLandscape;
        const shell = document.getElementById('pf-phone-shell');
        if (shell) {
            shell.classList.toggle('landscape', isLandscape);
            requestAnimationFrame(fitPhonePreview);
            showPfToast(isLandscape ? '🔄 Switched to Landscape' : '🔄 Switched to Portrait');
        }
    }

    function updatePhoneClock() {
        const el = document.getElementById('pf-phone-time');
        if (!el) return;
        const now = new Date();
        let h = now.getHours();
        let m = String(now.getMinutes()).padStart(2, '0');
        el.innerText = `${h}:${m}`;
    }
    setInterval(updatePhoneClock, 30000);

    // -------------------------------------------------------------
    // 7. FULLSCREEN PREVIEW CONTROLLER & DOCUMENT BUILDER
    // -------------------------------------------------------------
    function buildPreviewDoc(html, css, js) {
        html = html || '';
        css = css || '';
        js = js || '';

        // Check if there is actual visible content (ignoring comments)
        const strippedHtml = html.replace(/<!--[\s\S]*?-->/g, '').trim();
        const strippedJs = js.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
        const hasVisibleContent = strippedHtml.length > 0 || strippedJs.length > 0;

        if (!hasVisibleContent) {
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 40px 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #f8fafc;
            color: #334155;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            text-align: center;
        }
        .empty-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 36px 28px;
            max-width: 420px;
            width: 100%;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
        }
        .empty-icon { font-size: 48px; margin-bottom: 12px; }
        h2 { margin: 0 0 10px; font-size: 22px; color: #0f172a; font-weight: 700; }
        p { margin: 0 0 20px; font-size: 14px; color: #64748b; line-height: 1.6; }
        .edit-tip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #eff6ff;
            color: #1d4ed8;
            padding: 8px 16px;
            border-radius: 30px;
            font-size: 13px;
            font-weight: 600;
            border: 1px solid #bfdbfe;
        }
    </style>
</head>
<body>
    <div class="empty-card">
        <div class="empty-icon">💻</div>
        <h2>Ready for Your Code!</h2>
        <p>No visible HTML elements have been written yet.</p>
        <div class="edit-tip">👆 Tap <strong>"View / Edit Code"</strong> at the top to write HTML or choose a sample!</div>
    </div>
</body>
</html>`;
        }

        const hasDoctype = /<!doctype/i.test(html);
        const hasMetaViewport = /<meta[^>]*viewport/i.test(html);
        const viewportMeta = hasMetaViewport ? '' : '<meta name="viewport" content="width=device-width, initial-scale=1.0">';

        if (hasDoctype) {
            let res = html;
            if (!hasMetaViewport && res.includes('<head>')) {
                res = res.replace('<head>', `<head>${viewportMeta}`);
            }
            if (css.trim()) {
                if (res.includes('</head>')) {
                    res = res.replace('</head>', `<style>${css}</style></head>`);
                } else {
                    res = `<style>${css}</style>` + res;
                }
            }
            if (js.trim()) {
                const scriptTag = `<script>try { ${js} } catch(e){ console.error('Playground JS Error:', e); }<\/script>`;
                if (res.includes('</body>')) {
                    res = res.replace('</body>', `${scriptTag}</body>`);
                } else {
                    res = res + scriptTag;
                }
            }
            return res;
        }

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    ${viewportMeta}
    <style>
        body {
            margin: 0;
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #ffffff;
            color: #0f172a;
        }
        ${css}
    </style>
</head>
<body>
    ${html}
    <script>
        try {
            ${js}
        } catch(e) {
            console.error('Playground JS Error:', e);
        }
    <\/script>
</body>
</html>`;
    }

    function toggleFullscreenPreview() {
        const overlay = document.getElementById('pf-fullscreen-overlay');
        const fsIframe = document.getElementById('pf-fullscreen-iframe');

        if (!overlay || !fsIframe) return;

        // Ensure latest content is populated in fsIframe
        const editors = getEditorInstances();
        const html = editors.html ? editors.html.getValue() : '';
        const css = editors.css ? editors.css.getValue() : '';
        const js = editors.js ? editors.js.getValue() : '';

        fsIframe.srcdoc = buildPreviewDoc(html, css, js);
        overlay.classList.add('active');

        // Request browser native fullscreen if available
        if (overlay.requestFullscreen) {
            overlay.requestFullscreen().catch(() => {});
        }
    }

    function closeFullscreenPreview() {
        const overlay = document.getElementById('pf-fullscreen-overlay');
        if (overlay) overlay.classList.remove('active');
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
    }

    // -------------------------------------------------------------
    // 8. CODE IN PERMALINK & QR CODE SHARE
    // -------------------------------------------------------------
    let currentShareHostMode = 'wifi'; // Default to 'wifi' for direct phone scanning without needing any .exe tunnels!
    let currentShareViewMode = 'output'; // 'output' (Live Preview) or 'editor' (Code + Output)
    const DEFAULT_CLOUD_TUNNEL_URL = 'https://codestudio.pragament.com';

    function getCloudUrl() {
        const stored = localStorage.getItem('pf_cloud_url');
        if (stored && !stored.includes('trycloudflare.com')) return stored;
        return DEFAULT_CLOUD_TUNNEL_URL;
    }

    function updateCloudUrl() {
        const input = document.getElementById('pf-cloud-url-input');
        if (input && input.value) {
            let newUrl = input.value.trim().replace(/\/+$/, '');
            if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
                newUrl = 'https://' + newUrl;
            }
            localStorage.setItem('pf_cloud_url', newUrl);
            showPfToast(`✅ Public Cloud URL updated!`);
            updateShareModalUI();
            refreshShareQrAndLink();
        }
    }

    function getWifiIp() {
        const stored = localStorage.getItem('pf_local_wifi_ip');
        if (stored) return stored;
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && /^\d+\.\d+\.\d+\.\d+$/.test(window.location.hostname)) {
            return window.location.hostname;
        }
        return '192.168.1.6';
    }

    function updateWifiIp() {
        const input = document.getElementById('pf-wifi-ip-input');
        if (input && input.value) {
            const newIp = input.value.trim();
            localStorage.setItem('pf_local_wifi_ip', newIp);
            showPfToast(`✅ Laptop Wi-Fi IP updated to ${newIp}`);
            updateShareModalUI();
            refreshShareQrAndLink();
        }
    }

    function setShareHost(mode) {
        currentShareHostMode = mode;
        updateShareModalUI();
        refreshShareQrAndLink();
    }

    function setShareView(view) {
        currentShareViewMode = view;
        updateShareModalUI();
        refreshShareQrAndLink();
    }

    function updateShareModalUI() {
        const wifiIp = getWifiIp();
        const cloudUrl = getCloudUrl();

        // Host selector buttons
        document.querySelectorAll('.pf-host-btn').forEach(b => b.classList.remove('active'));
        const hostBtn = document.getElementById(`pf-host-${currentShareHostMode}`);
        if (hostBtn) hostBtn.classList.add('active');

        // Update wifi button label
        const wifiBtn = document.getElementById('pf-host-wifi');
        if (wifiBtn) {
            wifiBtn.innerHTML = `🏠 Same Wi-Fi (${wifiIp})`;
        }

        // Show/hide wifi IP edit row
        const wifiIpRow = document.getElementById('pf-wifi-ip-row');
        if (wifiIpRow) {
            wifiIpRow.style.display = currentShareHostMode === 'wifi' ? 'flex' : 'none';
        }
        const ipInput = document.getElementById('pf-wifi-ip-input');
        if (ipInput && document.activeElement !== ipInput) {
            ipInput.value = wifiIp;
        }

        // Show/hide cloud URL edit row
        const cloudUrlRow = document.getElementById('pf-cloud-url-row');
        if (cloudUrlRow) {
            cloudUrlRow.style.display = currentShareHostMode === 'cloud' ? 'flex' : 'none';
        }
        const cloudInput = document.getElementById('pf-cloud-url-input');
        if (cloudInput && document.activeElement !== cloudInput) {
            cloudInput.value = cloudUrl;
        }

        // View selector buttons
        document.querySelectorAll('.pf-view-btn').forEach(b => b.classList.remove('active'));
        const viewBtn = document.getElementById(`pf-view-${currentShareViewMode}`);
        if (viewBtn) viewBtn.classList.add('active');

        // Hint banner
        const hintEl = document.getElementById('pf-share-hint');
        if (hintEl) {
            if (currentShareHostMode === 'cloud') {
                hintEl.innerHTML = `
                    <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5; text-align: left;">
                        <div>🌍 <strong>Works on ALL Networks:</strong> Mobile Data (4G/5G), Any Wi-Fi, or Remote Users!</div>
                        <div style="margin-top: 6px; color: #34d399; font-size: 11px;">
                            🔒 <strong>100% HTTPS Secure:</strong> Zero warnings. Camera scans and opens from any network worldwide.
                        </div>
                    </div>`;
            } else if (currentShareHostMode === 'wifi') {
                hintEl.innerHTML = `
                    <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5; text-align: left;">
                        <div>📶 <strong>Same Wi-Fi Only:</strong> Phone & laptop must be connected to the same home Wi-Fi (<code>${wifiIp}</code>).</div>
                        <div style="margin-top: 6px; color: #fbbf24; font-size: 11px;">
                            🔒 <strong>Android Note:</strong> If Chrome shows <em>"This site doesn't support a secure connection"</em>, tap <strong>"Continue to site"</strong>.
                        </div>
                    </div>`;
            } else {
                hintEl.innerHTML = `
                    <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5; text-align: left;">
                        <div>💻 <strong>Localhost Only:</strong> Only accessible on this computer's browser.</div>
                    </div>`;
            }
        }
    }

    let currentQrMode = 'full'; // 'full' (with code in URL) or 'simple' (direct clean URL)

    function getBasePageUrl() {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || /^\d+\.\d+\.\d+\.\d+$/.test(window.location.hostname);
        if (isLocal) {
            if (currentShareHostMode === 'wifi') {
                const port = window.location.port ? `:${window.location.port}` : '';
                return `${window.location.protocol}//${getWifiIp()}${port}${window.location.pathname}`;
            } else if (currentShareHostMode === 'cloud') {
                return `${getCloudUrl()}/index.html`;
            } else {
                const port = window.location.port ? `:${window.location.port}` : '';
                return `${window.location.protocol}//localhost${port}${window.location.pathname}`;
            }
        }
        return window.location.href.split('#')[0];
    }

    function toggleQrMode() {
        currentQrMode = currentQrMode === 'full' ? 'simple' : 'full';
        const btn = document.getElementById('pf-qr-mode-btn');
        if (btn) {
            btn.innerHTML = currentQrMode === 'full' ? '⚡ Simple URL QR' : '📦 Full Code QR';
        }
        showPfToast(currentQrMode === 'simple' ? '⚡ Switched to Instant-Scan Clean URL!' : '📦 Switched to Full Project Code QR');
        refreshShareQrAndLink();
    }

    function refreshShareQrAndLink() {
        let permalink = window.location.href;
        try {
            permalink = generatePermalink();
        } catch (e) {
            console.warn('Error creating permalink:', e);
        }

        const input = document.getElementById('pf-permalink-input');
        if (input) input.value = permalink;

        const qrContainer = document.getElementById('pf-qr-container');
        if (qrContainer) {
            qrContainer.innerHTML = '';
            const targetUrl = currentQrMode === 'simple' ? getBasePageUrl() : permalink;
            renderQRCodeSafe(qrContainer, targetUrl);
        }
    }

    function testPermalink() {
        const input = document.getElementById('pf-permalink-input');
        if (input && input.value) {
            window.open(input.value, '_blank');
        }
    }

    function generatePermalink() {
        const editors = getEditorInstances();
        const hVal = editors.html ? editors.html.getValue().trim() : '';
        const cVal = editors.css ? editors.css.getValue().trim() : '';
        const jVal = editors.js ? editors.js.getValue().trim() : '';
        const payload = {};
        if (hVal) payload.h = hVal;
        if (cVal) payload.c = cVal;
        if (jVal) payload.j = jVal;

        const jsonStr = JSON.stringify(payload);
        let encoded = '';

        // Priority 1: LZString compression (compact and QR-code friendly)
        if (typeof LZString !== 'undefined') {
            try {
                encoded = 'lz_' + LZString.compressToEncodedURIComponent(jsonStr);
            } catch (e) {
                console.warn('LZ compression error:', e);
            }
        }

        // Priority 2: Safe Base64 fallback
        if (!encoded) {
            try {
                encoded = 'b64_' + encodeURIComponent(btoa(encodeURIComponent(jsonStr)));
            } catch (e) {
                console.warn('Base64 encoding error:', e);
                encoded = 'uri_' + encodeURIComponent(jsonStr);
            }
        }

        // Determine base URL depending on host mode
        let base = window.location.href.split('#')[0];
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || /^\d+\.\d+\.\d+\.\d+$/.test(window.location.hostname);

        if (isLocal) {
            if (currentShareHostMode === 'wifi') {
                const port = window.location.port ? `:${window.location.port}` : '';
                base = `${window.location.protocol}//${getWifiIp()}${port}${window.location.pathname}`;
            } else if (currentShareHostMode === 'cloud') {
                const cloudBase = getCloudUrl();
                base = `${cloudBase}/index.html`;
            } else if (currentShareHostMode === 'local') {
                const port = window.location.port ? `:${window.location.port}` : '';
                base = `${window.location.protocol}//localhost${port}${window.location.pathname}`;
            }
        }

        const viewParam = currentShareViewMode === 'output' ? '&view=output' : '';
        return `${base}#code=${encoded}${viewParam}`;
    }

    function openShareModal() {
        // ALWAYS open the modal first so the dialog appears without blocking
        openModal('pf-share-modal');
        updateShareModalUI();
        refreshShareQrAndLink();
    }

    function renderQRCodeSafe(container, targetUrl) {
        container.innerHTML = '';

        // Standard QR code limit check: if payload is <= 2500 chars, render full QR
        const isShortEnough = targetUrl.length <= 2500;

        if (isShortEnough) {
            // Ultra-sharp 600x600 QR code rendered with clean 2-module margin and Medium error correction
            const qrImg = document.createElement('img');
            qrImg.alt = 'Scan with Phone Camera';
            qrImg.id = 'pf-qr-image';
            qrImg.style.cssText = 'width: 280px; height: 280px; display: block; border-radius: 4px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.06);';
            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=2&ecc=M&format=png&color=000000&data=${encodeURIComponent(targetUrl)}`;

            // Offline client-side QRCode fallback
            qrImg.onerror = () => {
                container.innerHTML = '';
                if (typeof QRCode !== 'undefined') {
                    try {
                        new QRCode(container, {
                            text: targetUrl,
                            width: 280,
                            height: 280,
                            colorDark: '#000000',
                            colorLight: '#ffffff',
                            correctLevel: QRCode.CorrectLevel.L
                        });
                        const imgs = container.querySelectorAll('img');
                        const canvases = container.querySelectorAll('canvas');
                        if (canvases.length > 0 && imgs.length > 0) {
                            imgs[0].style.display = 'none';
                        }
                    } catch (qrErr) {
                        console.warn('QRCode JS library error:', qrErr);
                    }
                }
            };

            container.appendChild(qrImg);

            if (targetUrl.length > 500) {
                const hint = document.createElement('div');
                hint.style.cssText = 'font-size: 11px; color: #64748b; margin-top: 6px; text-align: center;';
                hint.innerHTML = '💡 <em>Camera can\'t focus? Tap <strong>"🔍 Enlarge QR"</strong> or <strong>"⚡ Simple URL QR"</strong></em>';
                container.appendChild(hint);
            }
            return;
        }

        // If code is too large (> 2.5 KB)
        const basePageUrl = getBasePageUrl();
        const qrImg = document.createElement('img');
        qrImg.alt = 'Scan QR Code';
        qrImg.style.cssText = 'width: 280px; height: 280px; display: block; border-radius: 4px; margin: 0 auto;';
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=2&ecc=M&format=png&data=${encodeURIComponent(basePageUrl)}`;
        container.appendChild(qrImg);

        const notice = document.createElement('div');
        notice.style.cssText = 'font-size: 11px; color: #fbbf24; margin-top: 8px; max-width: 280px; text-align: center;';
        notice.innerHTML = `⚠️ Project code is <strong>${Math.round(targetUrl.length / 1024 * 10) / 10} KB</strong>. Click <strong>"📋 Copy Link"</strong> below to share the full project!`;
        container.appendChild(notice);
    }

    function toggleZoomQr() {
        const box = document.getElementById('pf-qr-container');
        const btn = document.getElementById('pf-qr-zoom-btn');
        if (!box) return;
        const isZoomed = box.classList.toggle('zoomed');
        if (btn) {
            btn.innerHTML = isZoomed ? '🔍 Reset Size' : '🔍 Enlarge QR';
        }
    }

    function downloadQrImage() {
        const qrImg = document.querySelector('#pf-qr-container img');
        const canvas = document.querySelector('#pf-qr-container canvas');
        let dataUrl = '';
        if (canvas) {
            dataUrl = canvas.toDataURL('image/png');
        } else if (qrImg && qrImg.src) {
            dataUrl = qrImg.src;
        }
        if (!dataUrl) {
            showPfToast('⚠️ No QR image found to download');
            return;
        }
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'playground-code-qr.png';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showPfToast('💾 QR Image download initiated!');
    }

    function copyPermalink() {
        const input = document.getElementById('pf-permalink-input');
        if (input) {
            input.select();
            navigator.clipboard.writeText(input.value).then(() => {
                showPfToast('📋 Permalink copied to clipboard!');
                const btn = document.getElementById('pf-copy-btn');
                if (btn) {
                    const original = btn.innerHTML;
                    btn.innerHTML = '✓ Copied!';
                    setTimeout(() => { btn.innerHTML = original; }, 2000);
                }
            }).catch(() => {
                showPfToast('Could not auto-copy, please copy link manually');
            });
        }
    }

    function checkAndLoadPermalink() {
        const hash = window.location.hash;
        if (hash && hash.includes('code=')) {
            try {
                const match = hash.match(/code=([^&]+)/);
                if (match && match[1]) {
                    const raw = match[1];
                    let decodedStr = null;

                    // Case 1: LZString compressed
                    if (raw.startsWith('lz_') && typeof LZString !== 'undefined') {
                        decodedStr = LZString.decompressFromEncodedURIComponent(raw.slice(3));
                    } else if (raw.startsWith('b64_')) {
                        decodedStr = decodeURIComponent(atob(decodeURIComponent(raw.slice(4))));
                    } else if (raw.startsWith('uri_')) {
                        decodedStr = decodeURIComponent(raw.slice(4));
                    } else {
                        // Legacy format fallback
                        try {
                            decodedStr = decodeURIComponent(atob(decodeURIComponent(raw)));
                        } catch (_) {
                            if (typeof LZString !== 'undefined') {
                                decodedStr = LZString.decompressFromEncodedURIComponent(raw);
                            }
                        }
                    }

                    if (decodedStr) {
                        const data = JSON.parse(decodedStr);
                        const editors = getEditorInstances();
                        if (data.h !== undefined && editors.html) editors.html.setValue(data.h);
                        if (data.c !== undefined && editors.css) editors.css.setValue(data.c);
                        if (data.j !== undefined && editors.js) editors.js.setValue(data.j);
                        triggerUpdatePreview();
                        showPfToast('🔗 Code successfully restored from permalink!');

                        // Automatically launch Fullscreen Live Output if view=output or view=preview is specified
                        if (hash.includes('view=output') || hash.includes('view=preview')) {
                            setTimeout(() => {
                                toggleFullscreenPreview();
                            }, 350);
                        }
                        return true;
                    }
                }
            } catch (e) {
                console.warn('Permalink restore error:', e);
            }
        }
        return false;
    }

    // -------------------------------------------------------------
    // 9. LIVE OUTPUT VOICE (matches the Flutter simulator print voice)
    // -------------------------------------------------------------
    let outputSpeechMuted = true;

    function updateOutputVoiceButtons() {
        const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
        document.querySelectorAll('[data-output-voice]').forEach(checkbox => {
            checkbox.disabled = !supported;
            checkbox.checked = !outputSpeechMuted && supported;
            checkbox.title = !supported ? 'Output speech is unavailable in this browser' : 'Speak new preview output';
        });
    }

    function setOutputSpeech(enabled) {
        outputSpeechMuted = !enabled;
        if (outputSpeechMuted && window.speechSynthesis) window.speechSynthesis.cancel();
        updateOutputVoiceButtons();
    }

    function rerunPreview() {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        triggerUpdatePreview();
    }

    function speakOutput(text) {
        if (outputSpeechMuted || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
        const cleaned = text.replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
        if (!cleaned) return;
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(cleaned);
            utterance.rate = 0.92;
            utterance.pitch = 1.05;
            window.speechSynthesis.speak(utterance);
        } catch (_) {
            // Some browsers require a user gesture before allowing speech.
        }
    }

    function watchOutputSpeech(frame) {
        if (!frame) return;
        let observer;
        let timer;
        let previousText = '';
        function connect() {
            if (observer) observer.disconnect();
            clearTimeout(timer);
            previousText = '';
            let doc;
            try { doc = frame.contentDocument; } catch (_) { return; }
            if (!doc || !doc.body) return;
            const read = () => {
                // Read rendered text only: hidden feedback, scripts and styles stay silent.
                const lines = doc.body.innerText.split(/\n+/).map(line => line.trim()).filter(Boolean);
                const text = lines.join('\n');
                if (text === previousText) return;
                const previousLines = new Set(previousText.split('\n'));
                previousText = text;
                const fullscreen = document.getElementById('pf-fullscreen-overlay')?.classList.contains('active');
                if (fullscreen !== (frame.id === 'pf-fullscreen-iframe')) return;
                speakOutput(lines.filter(line => !previousLines.has(line)).join(' '));
            };
            const schedule = () => { clearTimeout(timer); timer = setTimeout(read, 180); };
            observer = new MutationObserver(schedule);
            observer.observe(doc.body, {subtree: true, childList: true, characterData: true, attributes: true});
            // CSS hover/focus and native details can reveal text without DOM mutations.
            ['pointerover', 'pointerout', 'focusin', 'focusout', 'click', 'toggle', 'input', 'change'].forEach(event =>
                doc.addEventListener(event, schedule, true));
            schedule();
        }
        frame.addEventListener('load', connect);
        connect();
    }

    // -------------------------------------------------------------
    // 10. POPUP FILL IN THE BLANKS (MULTIPLE BLANKS PER QUESTION)
    // -------------------------------------------------------------
    function quizEscape(value) {
        return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
    }

    function setupQuizFilters() {
        for (const key of Object.keys(quizFilters)) {
            const select = document.getElementById(`pf-filter-${key}`);
            const values = [...new Set(quizCatalog.flatMap(q => key === 'classLevels' ? q.classLevels : [q[key]]).map(String))]
                .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
            select.innerHTML = '<option value="all">All</option>' + values.map(v => `<option value="${quizEscape(v)}">${quizEscape(v)}</option>`).join('');
            select.value = quizFilters[key];
            select.onchange = () => { quizFilters[key] = select.value; shuffleQuizQuestions(); };
        }
        const picker = document.getElementById('pf-quiz-prerequisites');
        picker.replaceChildren();
        [...new Set(quizCatalog.flatMap(q => q.prerequisites))].sort().forEach(value => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = excludedQuizPrerequisites.has(value);
            input.onchange = () => {
                if (input.checked) excludedQuizPrerequisites.add(value);
                else excludedQuizPrerequisites.delete(value);
                shuffleQuizQuestions();
            };
            label.append(input, document.createTextNode(value));
            picker.append(label);
        });
    }

    function shuffleQuizQuestions() {
        currentQuizList = quizCatalog.filter(q => Object.entries(quizFilters).every(([key, value]) =>
            value === 'all' || (key === 'classLevels' ? q.classLevels.map(String).includes(value) : String(q[key]) === value)) &&
            !q.prerequisites.some(p => excludedQuizPrerequisites.has(p)));
        for (let i = currentQuizList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentQuizList[i], currentQuizList[j]] = [currentQuizList[j], currentQuizList[i]];
        }
        renderQuiz(0);
    }

    function clearQuizExclusions() {
        excludedQuizPrerequisites.clear();
        setupQuizFilters();
        shuffleQuizQuestions();
    }

    function renderQuiz(index) {
        activeQuizIndex = index;
        quizAnswersRevealed = false;
        document.getElementById('pf-quiz-word-bank-wrap').hidden = true;
        document.getElementById('pf-quiz-show-hints').setAttribute('aria-expanded', 'false');
        document.getElementById('pf-quiz-show-hints').textContent = 'Show Hints';
        const q = currentQuizList[index];
        const metaEl = document.getElementById('pf-quiz-meta');
        const sentenceEl = document.getElementById('pf-quiz-sentence');
        document.getElementById('pf-quiz-feedback').className = 'pf-quiz-feedback';
        document.getElementById('pf-quiz-title-text').textContent = q ? q.title : 'No matching questions';
        document.getElementById('pf-quiz-description').textContent = q ? q.description : '';
        document.querySelectorAll('[data-quiz-needs-question]').forEach(button => { button.disabled = !q; });
        document.getElementById('pf-quiz-prev').disabled = !q || index === 0;
        document.getElementById('pf-quiz-next').disabled = !q || index >= currentQuizList.length - 1;
        metaEl.replaceChildren();
        sentenceEl.replaceChildren();
        const bank = document.getElementById('pf-quiz-word-bank');
        bank.replaceChildren();
        if (!q) {
            sentenceEl.textContent = 'No fill-in-the-blanks questions match these filters.';
            renderQuizDots();
            return;
        }
        [q.category, q.subject, `Class ${q.classLevels.join(', ')}`, `Difficulty: ${q.difficulty}`, `Question ${index + 1} of ${currentQuizList.length}`].forEach(text => {
            const badge = document.createElement('span');
            badge.className = 'pf-quiz-badge';
            badge.textContent = text;
            metaEl.append(badge);
        });
        const blankMap = new Map(q.blanks.map(b => [b.id, b]));
        q.template.split(/(\[[^\]]+\])/g).forEach(part => {
            const b = blankMap.get(part.slice(1, -1));
            if (!b || part[0] !== '[') { sentenceEl.append(document.createTextNode(part)); return; }
            const wrap = document.createElement('span');
            wrap.className = 'pf-quiz-blank';
            wrap.id = `pf-blank-wrap-${b.id}`;
            const input = document.createElement('input');
            input.id = `pf-blank-sel-${b.id}`;
            input.type = 'text';
            input.autocomplete = 'off';
            input.spellcheck = false;
            input.placeholder = b.placeholder || 'Answer';
            input.setAttribute('aria-label', b.placeholder || `Blank ${b.id}`);
            input.style.width = `${Math.min(28, Math.max(9, b.answer.length + 2))}ch`;
            input.oninput = () => onBlankChange(b.id);
            wrap.append(input);
            sentenceEl.append(wrap);
        });
        const words = q.blanks.map(b => b.answer);
        for (let i = words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [words[i], words[j]] = [words[j], words[i]];
        }
        words.forEach(word => {
            const chip = document.createElement('button');
            chip.className = 'pf-word-chip';
            chip.textContent = `+ ${word}`;
            chip.onclick = () => fillNextEmptyBlank(word);
            bank.append(chip);
        });
        renderQuizDots();
    }

    function showQuizHints() {
        if (!currentQuizList[activeQuizIndex]) return;
        const bank = document.getElementById('pf-quiz-word-bank-wrap');
        const button = document.getElementById('pf-quiz-show-hints');
        bank.hidden = !bank.hidden;
        button.setAttribute('aria-expanded', String(!bank.hidden));
        button.textContent = bank.hidden ? 'Show Hints' : 'Hide Hints';
    }

    function showQuizAnswers() {
        const q = currentQuizList[activeQuizIndex];
        if (!q) return;
        quizAnswersRevealed = true;
        q.blanks.forEach(b => {
            const input = document.getElementById(`pf-blank-sel-${b.id}`);
            input.value = b.answer;
            input.disabled = true;
            document.getElementById(`pf-blank-wrap-${b.id}`).classList.remove('is-correct', 'is-incorrect');
        });
        document.querySelectorAll('#pf-quiz-word-bank button').forEach(b => { b.disabled = true; });
        const feedback = document.getElementById('pf-quiz-feedback');
        feedback.className = 'pf-quiz-feedback show';
        feedback.textContent = 'Answers revealed.';
    }

    function renderQuizDots() {
        const dotsWrap = document.getElementById('pf-quiz-dots');
        if (!dotsWrap) return;
        dotsWrap.innerHTML = currentQuizList.map((_, i) => `
            <div class="pf-quiz-dot ${i === activeQuizIndex ? 'active' : ''}" onclick="window.PlaygroundFeatures.renderQuiz(${i})"></div>
        `).join('');
    }

    function onBlankChange(blankId) {
        const wrap = document.getElementById(`pf-blank-wrap-${blankId}`);
        if (wrap) {
            wrap.classList.remove('is-correct', 'is-incorrect');
        }
    }

    function fillNextEmptyBlank(word) {
        const q = currentQuizList[activeQuizIndex];
        if (!q || quizAnswersRevealed) return;
        for (const b of q.blanks) {
            const sel = document.getElementById(`pf-blank-sel-${b.id}`);
            if (sel && !sel.value) {
                sel.value = word;
                onBlankChange(b.id);
                return;
            }
        }
    }

    function checkQuizAnswers() {
        const q = currentQuizList[activeQuizIndex];
        if (!q || quizAnswersRevealed) return;
        let correctCount = 0;

        q.blanks.forEach(b => {
            const sel = document.getElementById(`pf-blank-sel-${b.id}`);
            const wrap = document.getElementById(`pf-blank-wrap-${b.id}`);
            if (!sel || !wrap) return;

            const userVal = sel.value.trim().replace(/\s+/g, ' ');
            const expectedVal = b.answer.trim().replace(/\s+/g, ' ');

            if (userVal === expectedVal) {
                correctCount++;
                wrap.classList.add('is-correct');
                wrap.classList.remove('is-incorrect');
            } else {
                wrap.classList.add('is-incorrect');
                wrap.classList.remove('is-correct');
            }
        });

        const feedbackEl = document.getElementById('pf-quiz-feedback');
        if (feedbackEl) {
            const total = q.blanks.length;
            const isAllCorrect = correctCount === total;
            feedbackEl.className = `pf-quiz-feedback show ${isAllCorrect ? 'success' : 'partial'}`;
            feedbackEl.innerHTML = `
                <div style="font-weight: 700; margin-bottom: 6px;">
                    ${isAllCorrect ? '🎉 Outstanding! All blanks correct!' : `💡 Score: ${correctCount} of ${total} correct.`}
                </div>
                <div>${quizEscape(q.explanation)}</div>
                <div class="pf-quiz-code-preview">
                    <pre><code>${quizEscape(q.codeSnippet)}</code></pre>
                </div>
                <button class="pf-btn pf-btn-samples" style="margin-top: 10px;" onclick="window.PlaygroundFeatures.tryQuizCode()">
                    🚀 Try this in Playground Editor
                </button>
            `;
        }
    }

    function tryQuizCode() {
        const q = currentQuizList[activeQuizIndex];
        if (!q) return;
        const editors = getEditorInstances();

        if (q.category === 'HTML' && editors.html) {
            editors.html.setValue(q.codeSnippet);
        } else if (q.category === 'CSS' && editors.css) {
            editors.css.setValue(q.codeSnippet);
        } else if (q.category === 'JavaScript' && editors.js) {
            editors.js.setValue(q.codeSnippet);
        }

        triggerUpdatePreview();
        closeModal('pf-quiz-modal');
        showPfToast(`Loaded ${q.title} example into editor!`);
    }

    function nextQuizQuestion() {
        if (!currentQuizList.length) return;
        if (activeQuizIndex < currentQuizList.length - 1) {
            renderQuiz(activeQuizIndex + 1);
        }
    }

    function prevQuizQuestion() {
        if (!currentQuizList.length) return;
        if (activeQuizIndex > 0) {
            renderQuiz(activeQuizIndex - 1);
        }
    }

    // -------------------------------------------------------------
    // 11. MODAL OPEN/CLOSE HELPERS
    // -------------------------------------------------------------
    function openModal(modalId) {
        if (modalId === 'pf-quiz-modal') loadQuizCatalog();
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('open');
        }
    }

    // -------------------------------------------------------------
    // 12. INITIALIZATION ON PAGE LOAD / REFRESH
    // -------------------------------------------------------------
    function toggleEditorMode() {
        const advanced = document.body.dataset.editorMode !== 'advanced';
        document.body.dataset.editorMode = advanced ? 'advanced' : 'simple';
        document.getElementById('editor-mode-label').textContent = advanced ? 'Advanced editor' : 'Simple editor';
        const button = document.getElementById('editor-mode-toggle');
        button.textContent = advanced ? 'Switch to Simple' : 'Switch to Advanced';
        button.setAttribute('aria-pressed', String(advanced));
        if (!advanced) {
            // Stop background recording/replay when its controls are hidden.
            if (typeof isRecording !== 'undefined' && isRecording && typeof window.toggleRecording === 'function') window.toggleRecording();
            if (typeof window.stopRepeat === 'function') window.stopRepeat();
            const repeat = document.getElementById('repeat-modal');
            if (repeat) repeat.style.display = 'none';
            ['recordingSessionsModal', 'playbackControlModal'].forEach(id => document.getElementById(id)?.classList.add('hidden'));
        }
        requestAnimationFrame(() => {
            Object.values(getEditorInstances()).forEach(editor => editor?.refresh?.());
            fitPhonePreview();
        });
    }

    function init() {
        loadSampleCatalog().catch(() => {
            const dropdown = document.getElementById('pf-sample-select');
            if (dropdown) dropdown.replaceChildren(new Option('Samples unavailable — open Samples to retry', ''));
        });
        const isSharedLink = window.location.hash && window.location.hash.includes('code=');

        updateOutputVoiceButtons();
        watchOutputSpeech(document.getElementById('preview'));
        watchOutputSpeech(document.getElementById('pf-fullscreen-iframe'));
        togglePhonePreview(true);
        const previewContainer = document.getElementById('preview-container');
        if (previewContainer && typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(() => requestAnimationFrame(fitPhonePreview)).observe(previewContainer);
        }
        window.addEventListener('resize', fitPhonePreview);
        triggerUpdatePreview();

        // 1. Check for permalink code in URL hash
        checkAndLoadPermalink();

        // 2. Load the separate quiz catalog without delaying preview initialization.
        loadQuizCatalog();

        // 3. AUTO POPUP ON EVERY PAGE REFRESH (only when NOT opening a shared code link):
        if (!isSharedLink) {
            setTimeout(() => {
                openModal('pf-quiz-modal');
            }, 600);
        }

        // 4. Keyboard Esc closes modals & fullscreen
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal('pf-quiz-modal');
                closeModal('pf-share-modal');
                closeModal('pf-samples-modal');
                closeFullscreenPreview();
            }
        });
    }

    // Expose API to window for button onclick attributes
    window.PlaygroundFeatures = {
        toggleEditorMode,
        loadSample,
        openSamplesModal,
        togglePhonePreview,
        setPhoneDevice,
        togglePhoneOrientation,
        toggleFullscreenPreview,
        closeFullscreenPreview,
        buildPreviewDoc,
        openShareModal,
        setShareHost,
        setShareView,
        updateWifiIp,
        updateCloudUrl,
        toggleZoomQr,
        toggleQrMode,
        downloadQrImage,
        testPermalink,
        copyPermalink,
        setOutputSpeech,
        rerunPreview,
        renderQuiz,
        checkQuizAnswers,
        showQuizAnswers,
        clearQuizExclusions,
        tryQuizCode,
        showQuizHints,
        nextQuizQuestion,
        prevQuizQuestion,
        onBlankChange,
        fillNextEmptyBlank,
        openModal,
        closeModal
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
