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
window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const fileUrl = urlParams.get("file");
  if (fileUrl) {
    const res = await fetch(fileUrl);
    const content = await res.text();
    const extension = fileUrl.split('.').pop();

    if (extension === 'html') htmlEditor.setValue(content);
    else if (extension === 'css') cssEditor.setValue(content);
    else if (extension === 'js') jsEditor.setValue(content);

    updatePreview();
  }
};
window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const fileUrl = urlParams.get("file");
  if (fileUrl) {
    const res = await fetch(fileUrl);
    const content = await res.text();
    const extension = fileUrl.split('.').pop();

    if (extension === 'html') htmlEditor.setValue(content);
    else if (extension === 'css') cssEditor.setValue(content);
    else if (extension === 'js') jsEditor.setValue(content);

    updatePreview();
  }
};

