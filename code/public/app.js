 // Default sample code
const defaultHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Playground</title>
    <!-- Uncomment the following line to include an external CSS file -->
    <!-- <link rel="stylesheet" href="style.css"> -->
    <style>
        /* Add your internal CSS here */
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            text-align: center;
            padding: 50px;
        }
        h1 {
            color: #333;
        }
    </style>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to the Code Playground.</p>
    <!-- Uncomment the following line to include an external JS file -->
    <!-- <script src="script.js"><\/script> -->
    <script>
        // Add your internal JavaScript here
        console.log('Hello from the script!');
    <\/script>
</body>
</html>`;

const defaultCSS = `/* Add your CSS here */
body {
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
}`;

const defaultJS = `// Add your JavaScript here
console.log('Hello from script.js!');

document.querySelector('h1').addEventListener('click', () => {
    alert('You clicked the heading!');
});`;

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

// Automatically show hints while typing
cssEditor.on("inputRead", function (cm, event) {
    if (!cm.state.completionActive) {  // Prevent multiple popups
        CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
    }
});

// Automatically show hints while typing
htmlEditor.on("inputRead", function (cm, event) {
    const autocompleteButton = document.getElementById('autocomplete-button');
    const isOn = autocompleteButton.textContent.includes('On');
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
    const html = htmlEditor.getValue();
    const css = `<style>${cssEditor.getValue()}</style>`;
    const js = `<script>
                try {
                    ${jsEditor.getValue()}
                } catch (error) {
                    console.error(error);
                }
            <\/script>`;
    const preview = document.getElementById('preview');
    preview.srcdoc = html + css + js;
}

// Update preview on editor change
htmlEditor.on('change', updatePreview);
cssEditor.on('change', updatePreview);
jsEditor.on('change', updatePreview);

// Function to toggle files
function toggleFile(type) {
    const htmlEditorElement = htmlEditor.getWrapperElement();
    const cssEditorElement = cssEditor.getWrapperElement();
    const jsEditorElement = jsEditor.getWrapperElement();

    htmlEditorElement.classList.add('hidden');
    cssEditorElement.classList.add('hidden');
    jsEditorElement.classList.add('hidden');

    if (type === 'html') {
        htmlEditorElement.classList.remove('hidden');
    } else if (type === 'css') {
        cssEditorElement.classList.remove('hidden');
    } else if (type === 'js') {
        jsEditorElement.classList.remove('hidden');
    }
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

// Global flag to control preview update
let disablePreviewUpdate = false;

// Modified updatePreview function to respect disablePreviewUpdate flag
const originalUpdatePreview = updatePreview;
updatePreview = function() {
    if (disablePreviewUpdate) return;
    originalUpdatePreview();
};

// Function to insert text (e.g., special characters) at cursor position without triggering preview update
function insertLoremIpsum(text) {
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        disablePreviewUpdate = true;
        const cursor = activeEditor.getCursor();
        activeEditor.replaceRange(text, cursor);
        activeEditor.focus();
        disablePreviewUpdate = false;
        // Manually trigger updatePreview once after insertion if needed
        updatePreview();
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

// Function to create a new file and autosave in local storage
function createNewFile() {
    // If there's text in active editor, ask user to save it
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        const code = activeEditor.getValue();
        if (code) {
            saveFile();
            // Clear the active editor
            clearEditor();
        }
    }
}

// Function to view autosaved files in the file explorer
function viewAutosavedFiles() {
    const fileExplorer = document.querySelector('.file-explorer ul');
    fileExplorer.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
        const fileName = localStorage.key(i);
        const li = document.createElement('li');
        li.className = 'hover';
        li.textContent = fileName;
        li.onclick = () => loadFile(fileName);
        fileExplorer.appendChild(li);
    }
}

// Function to load a file from local storage
function loadFile(fileName) {
    console.log("loadFile " + fileName)
    const content = localStorage.getItem(fileName);
    console.log("content " + content)
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        activeEditor.setValue(content);
    }
}

// Save the content of the active editor to local storage
function saveFile(fileName) {
    console.log("saveFile " + fileName)
    const activeEditor = getActiveEditor();
    if (activeEditor) {
        const fileName = prompt('Enter the name of the new file:');
        if (fileName) {
            const content = activeEditor.getValue();
            console.log("content " + content)
            localStorage.setItem(fileName, content);
            viewAutosavedFiles();
        }
    }
}

const fs = window.fs || null; // Placeholder for file system access if available

// Show welcome screen and hide main UI
function showWelcomeScreen() {
    document.getElementById('welcome-section').style.display = 'flex';
    document.querySelector('.toolbar').style.display = 'none';
    document.getElementById('file-explorer').style.display = 'none';
    document.getElementById('main-container').style.display = 'none';
    const showExplorerBtn = document.getElementById('show-explorer-btn');
    if (showExplorerBtn) {
        showExplorerBtn.style.display = 'none';
    }
}

// Show main UI and hide welcome screen
function showMainUI() {
    document.getElementById('welcome-section').style.display = 'none';
    document.querySelector('.toolbar').style.display = 'flex';
    document.getElementById('file-explorer').style.display = 'block';
    document.getElementById('main-container').style.display = 'flex';
    const showExplorerBtn = document.getElementById('show-explorer-btn');
    if (showExplorerBtn) {
        showExplorerBtn.style.display = 'inline-block';
    }
}

// Load files from public directory and display in welcome section
async function loadWelcomeFiles() {
    const list = document.getElementById('welcome-files-list');
    list.innerHTML = '';

    // Since direct file system access is not available in browser,
    // we will simulate by listing known files in public directory.
    // In a real environment, this could be fetched from a server API.

    const publicFiles = [
        { name: 'index.html', type: 'html' },
        { name: 'app.css', type: 'css' },
        { name: 'app.js', type: 'js' },
        { name: 'sample1.jpg', type: 'image', path: './images/sample1.jpg' },
        { name: 'sample2.jpg', type: 'image', path: './images/sample2.jpg' },
        { name: 'sample3.jpg', type: 'image', path: './images/sample3.jpg' }
    ];

    publicFiles.forEach(file => {
        const li = document.createElement('li');
        li.className = 'hover';
        li.textContent = file.name;
        li.style.cursor = 'pointer';
        li.onclick = () => {
            loadPublicFile(file);
        };
        list.appendChild(li);
    });
}

// Load a file from public directory into editor or preview
async function loadPublicFile(file) {
    if (file.type === 'html' || file.type === 'css' || file.type === 'js') {
        try {
            const response = await fetch(file.name);
            const content = await response.text();
            if (file.type === 'html') {
                htmlEditor.setValue(content);
                toggleFile('html');
            } else if (file.type === 'css') {
                cssEditor.setValue(content);
                toggleFile('css');
            } else if (file.type === 'js') {
                jsEditor.setValue(content);
                toggleFile('js');
            }
            updatePreview();
            showMainUI();
        } catch (error) {
            alert('Failed to load file: ' + file.name);
        }
    } else if (file.type === 'image') {
        // Show image in preview iframe
        const preview = document.getElementById('preview');
        preview.srcdoc = `<html><body style="margin:0;display:flex;justify-content:center;align-items:center;background:#222;"><img src="${file.path}" style="max-width:100%;max-height:100%;" /></body></html>`;
        showMainUI();
    }
}

// Clear editors to start a new blank file
function startNewFile() {
    htmlEditor.setValue(defaultHTML);
    cssEditor.setValue(defaultCSS);
    jsEditor.setValue(defaultJS);
    toggleFile('html');
    updatePreview();
    showMainUI();
}

// Track last saved content for unsaved changes detection
let lastSavedContent = {
    html: defaultHTML,
    css: defaultCSS,
    js: defaultJS
};

// Check if current file has unsaved changes
function hasUnsavedChanges() {
    const htmlChanged = htmlEditor.getValue() !== lastSavedContent.html;
    const cssChanged = cssEditor.getValue() !== lastSavedContent.css;
    const jsChanged = jsEditor.getValue() !== lastSavedContent.js;
    return htmlChanged || cssChanged || jsChanged;
}

// Save current content as last saved content
function saveCurrentContent() {
    lastSavedContent.html = htmlEditor.getValue();
    lastSavedContent.css = cssEditor.getValue();
    lastSavedContent.js = jsEditor.getValue();
}

// Show modal for unsaved changes prompt
function showUnsavedChangesModal(callbacks) {
    const modal = document.getElementById('unsaved-changes-modal');
    modal.classList.remove('hidden');

    const saveBtn = document.getElementById('modal-save-btn');
    const discardBtn = document.getElementById('modal-discard-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    function cleanup() {
        saveBtn.removeEventListener('click', onSave);
        discardBtn.removeEventListener('click', onDiscard);
        cancelBtn.removeEventListener('click', onCancel);
        modal.classList.add('hidden');
    }

    function onSave() {
        cleanup();
        if (callbacks && callbacks.onSave) callbacks.onSave();
    }

    function onDiscard() {
        cleanup();
        if (callbacks && callbacks.onDiscard) callbacks.onDiscard();
    }

    function onCancel() {
        cleanup();
        if (callbacks && callbacks.onCancel) callbacks.onCancel();
    }

    saveBtn.addEventListener('click', onSave);
    discardBtn.addEventListener('click', onDiscard);
    cancelBtn.addEventListener('click', onCancel);
}

    // Event listeners for welcome button and new button
    document.addEventListener('DOMContentLoaded', () => {
        // Show welcome screen initially
        showWelcomeScreen();
        loadWelcomeFiles();

        // Preview button to toggle special char buttons visibility
        const previewBtn = document.getElementById('preview-toggle-button');
        const specialCharButtons = document.getElementById('special-char-buttons');
        if (previewBtn && specialCharButtons) {
            previewBtn.addEventListener('click', () => {
                specialCharButtons.classList.toggle('hidden');
            });
        }

        // GitHub login button event listener
        const githubLoginBtn = document.getElementById('github-login-btn');
        if (githubLoginBtn) {
            let githubWindow = null;
            githubLoginBtn.addEventListener('click', (event) => {
                event.preventDefault();
                if (!githubWindow || githubWindow.closed) {
                    githubWindow = window.open('https://github.com/login', '_blank', 'width=600,height=700');
                } else {
                    githubWindow.focus();
                }
            });
        }

        // GitHub logout button event listener
        const githubLogoutBtn = document.getElementById('github-logout-btn');
        if (githubLogoutBtn) {
            let githubLogoutWindow = null;
            githubLogoutBtn.addEventListener('click', (event) => {
                event.preventDefault();
                if (!githubLogoutWindow || githubLogoutWindow.closed) {
                    githubLogoutWindow = window.open('https://github.com/logout', '_blank', 'width=600,height=700');
                } else {
                    githubLogoutWindow.focus();
                }
            });
        }

        // File explorer close button event listener
        const fileExplorerCloseBtn = document.getElementById('file-explorer-close-btn');
        if (fileExplorerCloseBtn) {
            fileExplorerCloseBtn.addEventListener('click', () => {
                hideFileExplorer();
            });
        }

        // Show Explorer button event listener
        const showExplorerBtn = document.getElementById('show-explorer-btn');
        if (showExplorerBtn) {
            showExplorerBtn.addEventListener('click', () => {
                showFileExplorer();
            });
        }

        // Prettify button event listener
        const prettifyBtn = document.getElementById('prettify-button');
        if (prettifyBtn) {
            prettifyBtn.addEventListener('click', () => {
                prettifyCode();
            });
        }

        // Welcome button in toolbar
        const welcomeBtn = document.getElementById('welcome-button');
        if (welcomeBtn) {
            welcomeBtn.addEventListener('click', () => {
                if (hasUnsavedChanges()) {
                    showUnsavedChangesModal({
                        onSave: () => {
                            saveCurrentContent();
                            showWelcomeScreen();
                            loadWelcomeFiles();
                        },
                        onDiscard: () => {
                            // Discard changes by resetting editors to last saved content
                            htmlEditor.setValue(lastSavedContent.html);
                            cssEditor.setValue(lastSavedContent.css);
                            jsEditor.setValue(lastSavedContent.js);
                            showWelcomeScreen();
                            loadWelcomeFiles();
                        },
                        onCancel: () => {
                            // Do nothing, stay on current screen
                        }
                    });
                } else {
                    showWelcomeScreen();
                    loadWelcomeFiles();
                }
                // Show welcome screen and load files, do not auto-click new button
                showWelcomeScreen();
                loadWelcomeFiles();
                // Removed auto-click on new button to prevent UI reverting
            });
        }

        // New button in welcome section
        const newBtn = document.getElementById('welcome-new-btn');
        if (newBtn) {
            newBtn.addEventListener('click', () => {
                startNewFile();
                saveCurrentContent();
            });
        }
    });

    // Function to show file explorer and hide Show Explorer button
    function showFileExplorer() {
        const fileExplorer = document.getElementById('file-explorer');
        const showExplorerBtn = document.getElementById('show-explorer-btn');
        if (fileExplorer && showExplorerBtn) {
            fileExplorer.style.display = 'block';
            showExplorerBtn.style.display = 'none';
        }
    }

    // Function to hide file explorer and show Show Explorer button
    function hideFileExplorer() {
        const fileExplorer = document.getElementById('file-explorer');
        const showExplorerBtn = document.getElementById('show-explorer-btn');
        if (fileExplorer && showExplorerBtn) {
            fileExplorer.style.display = 'none';
            showExplorerBtn.style.display = 'inline-block';
        }
    }
