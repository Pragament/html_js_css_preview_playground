// Default sample code (clean, compact & instant QR scannable)
const defaultHTML = `<h1>Hello, World!</h1>
<p>Welcome to Code Playground.</p>
<button onclick="changeColor()">🎨 Change Color</button>`;

const defaultCSS = `body {
    font-family: system-ui, -apple-system, sans-serif;
    background-color: #f8fafc;
    text-align: center;
    padding: 40px 20px;
}
h1 {
    color: #1e293b;
    margin-bottom: 8px;
}
p {
    color: #64748b;
    margin-bottom: 24px;
}
button {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 15px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    transition: transform 0.15s, background-color 0.15s;
}
button:hover {
    background-color: #2563eb;
    transform: translateY(-2px);
}`;

const defaultJS = `function changeColor() {
    const colors = ['#f8fafc', '#ecfdf5', '#eff6ff', '#fef3c7', '#fdf2f8', '#f3e8ff'];
    const random = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = random;
    console.log('Background updated to', random);
};`;

// Initialize CodeMirror editors with default content
const htmlEditor = CodeMirror.fromTextArea(document.getElementById('html-code'), {
    mode: 'htmlmixed',
    theme: 'material',
    lineNumbers: true,
    autoCloseTags: true,
    value: defaultHTML,
    extraKeys: { "Ctrl-Space": "autocomplete" },
});
const cssEditor = CodeMirror.fromTextArea(document.getElementById('css-code'), {
    mode: 'css',
    theme: 'material',
    lineNumbers: true,
    value: defaultCSS,
    extraKeys: { "Ctrl-Space": "autocomplete" },
});
const jsEditor = CodeMirror.fromTextArea(document.getElementById('js-code'), {
    mode: 'javascript',
    theme: 'material',
    lineNumbers: true,
    value: defaultJS,
    extraKeys: { "Ctrl-Space": "autocomplete" },
});

// Explicitly attach editors to window for interoperability
window.htmlEditor = htmlEditor;
window.cssEditor = cssEditor;
window.jsEditor = jsEditor;
window.updatePreview = updatePreview;

// If editors only contain placeholder comments or are empty, populate with default template
const initialHtml = htmlEditor.getValue().trim();
if (!initialHtml || initialHtml === '<!-- Add your HTML code here -->') {
    htmlEditor.setValue(defaultHTML);
}
const initialCss = cssEditor.getValue().trim();
if (!initialCss || initialCss === '/* Add your CSS here */') {
    cssEditor.setValue(defaultCSS);
}
const initialJs = jsEditor.getValue().trim();
if (!initialJs || initialJs === '// Add your JavaScript here') {
    jsEditor.setValue(defaultJS);
}

// Automatically show hints while typing
cssEditor.on("inputRead", function (cm, event) {
    if (!cm.state.completionActive) {  // Prevent multiple popups
        CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
    }
});

// Automatically show hints while typing
htmlEditor.on("inputRead", function (cm, event) {
    const autocompleteButton = document.getElementById('autocomplete-button');
    const isOn = autocompleteButton && autocompleteButton.textContent.includes('On');
    if (isOn && !cm.state.completionActive) {  // Prevent multiple popups
        CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
    }
});

// Automatically show hints while typing
jsEditor.on("inputRead", function (cm, event) {
    if (!cm.state.completionActive) {  // Prevent multiple popups
        CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
    }
});

// Function to update the preview
function updatePreview() {
    const rawHtml = htmlEditor.getValue();
    const rawCss = cssEditor.getValue();
    const rawJs = jsEditor.getValue();

    const preview = document.getElementById('preview');
    if (preview) {
        if (window.PlaygroundFeatures && typeof window.PlaygroundFeatures.buildPreviewDoc === 'function') {
            preview.srcdoc = window.PlaygroundFeatures.buildPreviewDoc(rawHtml, rawCss, rawJs);
        } else {
            const css = `<style>${rawCss}</style>`;
            const js = `<script>try { ${rawJs} } catch(e){ console.error(e); }<\/script>`;
            preview.srcdoc = rawHtml + css + js;
        }
    }

    const fsIframe = document.getElementById('pf-fullscreen-iframe');
    if (fsIframe) {
        if (window.PlaygroundFeatures && typeof window.PlaygroundFeatures.buildPreviewDoc === 'function') {
            fsIframe.srcdoc = window.PlaygroundFeatures.buildPreviewDoc(rawHtml, rawCss, rawJs);
        } else {
            const css = `<style>${rawCss}</style>`;
            const js = `<script>try { ${rawJs} } catch(e){ console.error(e); }<\/script>`;
            fsIframe.srcdoc = rawHtml + css + js;
        }
    }
}

// Initial preview render on startup
updatePreview();

// Update preview on editor change
htmlEditor.on('change', updatePreview);
cssEditor.on('change', updatePreview);
jsEditor.on('change', updatePreview);

// Function to toggle files
function toggleFile(type) {
    const editors = { html: htmlEditor, css: cssEditor, js: jsEditor };
    const filenames = { html: 'index.html', css: 'style.css', js: 'script.js' };
    const selected = editors[type];
    if (!selected) return;

    Object.entries(editors).forEach(([key, editor]) => {
        editor.getWrapperElement().classList.toggle('hidden', key !== type);
    });
    document.getElementById('current-file-name').textContent = filenames[type];
    // CodeMirror measures hidden editors at zero size; redraw when a file becomes visible.
    requestAnimationFrame(() => {
        if (typeof selected.refresh === 'function') selected.refresh();
    });
    updateUndoRedoButtons();
}

// Function to insert image path at cursor position
function insertImagePath(imagePath) {
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        const cursor = activeEditor.getCursor();
        activeEditor.replaceRange(imagePath, cursor);
        activeEditor.focus(); // Focus back on the editor
    }
}

// Function to insert Lorem Ipsum at cursor position
function insertTemplate() {
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        const wrappedText = `<!-- Add your HTML code here -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`;
        const cursor = activeEditor.getCursor();
        clearEditor();
        activeEditor.replaceRange(wrappedText, cursor);
        activeEditor.focus(); // Focus back on the editor
    }
}

// Function to insert Lorem Ipsum at cursor position
function insertLoremIpsum(dummyText) {
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        const wrappedText = dummyText.replace(/(.{80})/g, "$1\n"); // Wrap every 80 characters
        const cursor = activeEditor.getCursor();
        activeEditor.replaceRange(wrappedText, cursor);
        activeEditor.focus(); // Focus back on the editor
    }
}

// Insert the selected number of words at the current file's cursor.
function insertSampleText() {
    const editor = getActiveEditor();
    if (!editor) return;
    const length = Math.max(1, Math.min(500, Number(document.getElementById('sample-text-length').value) || 50));
    const words = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'.split(/\s+/);
    let text = Array.from({length}, (_, index) => words[index % words.length]).join(' ');
    if (!/[.!?]$/.test(text)) text += '.';
    editor.replaceRange(text, editor.getCursor());
    editor.focus();
}

// Function to get the active editor
function getActiveEditor() {
    const htmlEditorElement = htmlEditor.getWrapperElement();
    const cssEditorElement = cssEditor.getWrapperElement();
    const jsEditorElement = jsEditor.getWrapperElement();

    if (!htmlEditorElement.classList.contains('hidden')) {
        return htmlEditor;
    } else if (!cssEditorElement.classList.contains('hidden')) {
        return cssEditor;
    } else if (!jsEditorElement.classList.contains('hidden')) {
        return jsEditor;
    }
    return null;
}

// Undo/Redo Functions
function undo() {
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        activeEditor.undo();
        updateUndoRedoButtons(); // Update button states after undo
    }
}

function redo() {
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        activeEditor.redo();
        updateUndoRedoButtons(); // Update button states after undo
    }
}

function zoomIn() {
    document.body.style.zoom = (parseFloat(document.body.style.zoom || 1) + 0.1).toFixed(1);
}

function zoomOut() {
    document.body.style.zoom = (parseFloat(document.body.style.zoom || 1) - 0.1).toFixed(1);
}

// Function to update undo/redo button states
function updateUndoRedoButtons(event) {
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        const undoButton = document.getElementById('undo-button');
        const redoButton = document.getElementById('redo-button');
        const history = activeEditor.historySize();
        undoButton.disabled = !history.undo;
        redoButton.disabled = !history.redo;
        checkCapsLock();
    }
}

function checkCapsLock() {
    document.addEventListener('keydown', function (event) {
        if (event.getModifierState("CapsLock")) {
            showCapsLockWarning();
        } else {
            hideCapsLockWarning();
        }
    });

    document.addEventListener('keyup', function (event) {
        if (!event.getModifierState("CapsLock")) {
            hideCapsLockWarning();
        }
    });
}

function showCapsLockWarning() {
    let warning = document.getElementById("capsWarning");
    if (!warning) {
        warning = document.createElement("div");
        warning.id = "capsWarning";
        warning.innerHTML = "⚠️ Caps Lock is ON!";
        warning.style.position = "fixed";
        warning.style.top = "10px";
        warning.style.right = "10px";
        warning.style.color = "red";
        warning.style.background = "yellow";
        warning.style.padding = "10px";
        warning.style.border = "2px solid red";
        warning.style.borderRadius = "5px";
        warning.style.animation = "blink 0.3s infinite alternate";
        document.body.appendChild(warning);
    }
    warning.style.display = "block";
}

function hideCapsLockWarning() {
    const warning = document.getElementById("capsWarning");
    if (warning) {
        warning.style.display = "none";
    }
}

// Listen for changes in editors to update undo/redo buttons
htmlEditor.on('change', updateUndoRedoButtons);
cssEditor.on('change', updateUndoRedoButtons);
jsEditor.on('change', updateUndoRedoButtons);

// Show HTML editor by default
toggleFile('html');

// Initialize preview with default content
updatePreview();

// Chat Window Functions
function toggleChat() {
    const chatWindow = document.querySelector('.chat-window');
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
}

function showFAQs() {
    const chatBody = document.getElementById('chat-body');
    chatBody.innerHTML = `
        <div class="message bot">
            <p>Here are some FAQs:</p>
        </div>
        <div class="action-buttons">
            <button onclick="selectFAQ('How do I add an image?')">How do I add an image?</button>
            <button onclick="selectFAQ('How do I style my page?')">How do I style my page?</button>
            <button onclick="selectFAQ('How do I add JavaScript?')">How do I add JavaScript?</button>
        </div>
    `;
}

function selectFAQ(faq) {
    const chatBody = document.getElementById('chat-body');
    chatBody.innerHTML += `
        <div class="message user">
            <p>${faq}</p>
        </div>
    `;
    // Simulate a bot response
    setTimeout(() => {
        chatBody.innerHTML += `
            <div class="message bot">
                <p>This is a response to: "${faq}".</p>
            </div>
        `;
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
}

function showCustomMessageInput() {
    const chatFooter = document.getElementById('chat-footer');
    chatFooter.style.display = 'flex';
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    // Add user message to chat
    const chatBody = document.getElementById('chat-body');
    chatBody.innerHTML += `
        <div class="message user">
            <p>${message}</p>
        </div>
    `;

    // Clear input
    input.value = '';

    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;

    // Send message to API (mock API for demonstration)
    const response = await mockApiCall(message);

    // Add bot response to chat
    chatBody.innerHTML += `
        <div class="message bot">
            <p>${response}</p>
        </div>
    `;

    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Mock API call (replace with actual API call)
async function mockApiCall(message) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`You said: "${message}". This is a mock response.`);
        }, 1000);
    });
}

// Toggle Preview Layout
function togglePreviewLayout() {
    const mainContainer = document.getElementById('main-container');
    const previewToggleButton = document.getElementById('preview-toggle-button');

    if (mainContainer.classList.contains('preview-right')) {
        mainContainer.classList.remove('preview-right');
        mainContainer.classList.add('preview-bottom');
    } else {
        mainContainer.classList.remove('preview-bottom');
        mainContainer.classList.add('preview-right');
    }
}

// Function to select all text in the active editor
function selectAll() {
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        activeEditor.execCommand('selectAll');
    }
}

// Function to copy selected text in the active editor
function copyText() {
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        const selectedText = activeEditor.getSelection();
        if (selectedText) {
            navigator.clipboard.writeText(selectedText).then(() => {
                console.log('Text copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    }
}

// Function to paste text into the active editor
function pasteText() {
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        navigator.clipboard.readText().then(text => {
            const cursor = activeEditor.getCursor();
            activeEditor.replaceRange(text, cursor);
        });
    }
}

// Function to clear the active editor
function clearEditor() {
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        activeEditor.setValue('');
    }
}

// Function to toggle the visibility of the special character buttons
function toggleSpecialChars() {
    const specialCharButtons = document.getElementById('special-char-buttons');
    if (specialCharButtons.classList.contains('hidden')) {
        specialCharButtons.classList.remove('hidden');
    } else {
        specialCharButtons.classList.add('hidden');
    }
}

// Function to toggle autocomplete on/off
function toggleAutocomplete() {
    const autocompleteButton = document.getElementById('autocomplete-button');
    const isOn = autocompleteButton.textContent.includes('On');
    autocompleteButton.textContent = `💡: ${isOn ? '❌Off' : '✅On'}`;
}

// Function to prettify code in the active editor
function prettifyCode() {
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        const code = activeEditor.getValue();
        const mode = activeEditor.getOption('mode');
        let formattedCode;
        if (mode === 'htmlmixed') {
            formattedCode = html_beautify(code);
        } else if (mode === 'css') {
            formattedCode = css_beautify(code);
        } else if (mode === 'javascript') {
            formattedCode = js_beautify(code);
        }
        activeEditor.setValue(formattedCode);
    }
}

// New preserves the current file until the user successfully saves it.
function createNewFile() {
    const editor = getActiveEditor();
    if (!editor) return;
    if (editor.getValue()) saveFile(true);
    else document.getElementById('current-file-name').textContent = 'untitled.' + editorFileExtension(editor);
}

// Keep IDE files separate from authentication, settings, and other apps' storage.
const IDE_FILE_PREFIX = 'html-ide:file:';
const IDE_FILE_EXTENSION = /\.(html|css|js)$/i;

function getSavedIdeFiles() {
    const files = new Map();
    for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (!key) continue;
        const scoped = key.startsWith(IDE_FILE_PREFIX);
        const name = scoped ? key.slice(IDE_FILE_PREFIX.length) : key;
        // Recognize old code-file saves, while ignoring tokens and app settings.
        if (!IDE_FILE_EXTENSION.test(name)) continue;
        if (scoped || !files.has(name)) files.set(name, key);
    }
    return [...files].sort(([a], [b]) => a.localeCompare(b));
}

function viewAutosavedFiles() {
    const list = document.getElementById('saved-files-list');
    const heading = document.getElementById('saved-files-container');
    list.replaceChildren();
    heading.classList.remove('hidden');
    list.classList.remove('hidden');
    const files = getSavedIdeFiles();
    const displayedKeys = new Set(files.map(([, key]) => key));
    const storageDebug = [];
    for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (!key) continue;
        const scoped = key.startsWith(IDE_FILE_PREFIX);
        const name = scoped ? key.slice(IDE_FILE_PREFIX.length) : key;
        storageDebug.push({
            key,
            filename: name,
            source: scoped ? 'HTML IDE' : 'Legacy / other storage',
            result: displayedKeys.has(key) ? 'Displayed' :
                IDE_FILE_EXTENSION.test(name) ? 'Skipped: newer scoped save exists' : 'Skipped: unsupported file extension'
        });
    }
    console.groupCollapsed(`[HTML IDE] viewAutosavedFiles: ${files.length} file(s), ${storageDebug.length} storage key(s)`);
    console.table(storageDebug);
    console.log('Displayed files:', files.map(([name]) => name));
    if (!files.length) console.info('No saved HTML, CSS or JavaScript files found.');
    console.groupEnd();
    if (!files.length) {
        const empty = document.createElement('li');
        empty.textContent = 'No saved HTML, CSS or JavaScript files.';
        list.appendChild(empty);
    }
    files.forEach(([name, key]) => {
        const item = document.createElement('li');
        item.className = 'hover';
        item.textContent = name;
        item.onclick = () => loadFile(name, key);
        list.appendChild(item);
    });
}

function loadFile(fileName, storageKey) {
    if (!IDE_FILE_EXTENSION.test(fileName)) return;
    const key = storageKey || getSavedIdeFiles().find(([name]) => name === fileName)?.[1];
    if (!key) return;
    const content = localStorage.getItem(key);
    if (content === null) return;
    const type = fileName.split('.').pop().toLowerCase();
    const editor = {html: htmlEditor, css: cssEditor, js: jsEditor}[type];
    editor.setValue(content);
    toggleFile(type);
    document.getElementById('current-file-name').textContent = fileName;
}

let pendingFileSave = null;

function editorFileExtension(editor) {
    return editor === cssEditor ? 'css' : editor === jsEditor ? 'js' : 'html';
}

function clearSaveFileError() {
    document.getElementById('save-file-error').textContent = '';
    document.getElementById('save-file-name').removeAttribute('aria-invalid');
}

function saveFile(createNew = false) {
    const editor = getActiveEditor();
    if (!editor) return;
    pendingFileSave = {editor, createNew, previousFocus: document.activeElement};
    const name = document.getElementById('save-file-name');
    const currentName = document.getElementById('current-file-name').textContent.trim();
    name.value = IDE_FILE_EXTENSION.test(currentName) ? currentName : 'untitled.' + editorFileExtension(editor);
    clearSaveFileError();
    document.getElementById('save-file-title').textContent = createNew ? 'Save before creating a new file' : 'Save file';
    document.getElementById('save-file-submit').textContent = createNew ? 'Save & New' : 'Save';
    const dialog = document.getElementById('save-file-dialog');
    if (!dialog.open) dialog.showModal();
    name.focus();
    name.select();
}

function cancelSaveFile() {
    const previousFocus = pendingFileSave?.previousFocus;
    pendingFileSave = null;
    document.getElementById('save-file-dialog').close();
    previousFocus?.focus();
}

function submitSaveFile(event) {
    event.preventDefault();
    if (!pendingFileSave) return;
    const input = document.getElementById('save-file-name');
    const name = input.value.trim();
    const error = document.getElementById('save-file-error');
    if (!/^.+\.(html|css|js)$/i.test(name)) {
        error.textContent = 'Enter a filename including .html, .css or .js (for example, index.html).';
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
    }
    const {editor, createNew} = pendingFileSave;
    try {
        localStorage.setItem(IDE_FILE_PREFIX + name, editor.getValue());
    } catch (_) {
        error.textContent = 'Could not save this file. Browser storage may be full or unavailable.';
        return;
    }
    viewAutosavedFiles();
    if (createNew) editor.setValue('');
    document.getElementById('current-file-name').textContent = createNew ? 'untitled.' + editorFileExtension(editor) : name;
    cancelSaveFile();
    editor.focus();
}
