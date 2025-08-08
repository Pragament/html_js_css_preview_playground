// Default sample code
const defaultHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Playground</title>
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
let isUnsaved = false; // Tracks unsaved changes


// Initialize CodeMirror editors with default content
let currentFileName = ''; // Global variable to track current file name

const htmlEditor = CodeMirror.fromTextArea(document.getElementById('html-code'), {
    mode: 'htmlmixed',
    theme: 'eclipse',
    lineNumbers: true,
    autoCloseTags: true,
    value: defaultHTML,
    extraKeys: { "Ctrl-Space": "autocomplete" },
});
const cssEditor = CodeMirror.fromTextArea(document.getElementById('css-code'), {
    mode: 'css',
    theme: 'eclipse',
    lineNumbers: true,
    value: defaultCSS,
    extraKeys: { "Ctrl-Space": "autocomplete" },
});
const jsEditor = CodeMirror.fromTextArea(document.getElementById('js-code'), {
    mode: 'javascript',
    theme: 'eclipse',
    lineNumbers: true,
    value: defaultJS,
    extraKeys: { "Ctrl-Space": "autocomplete" },
});

// Automatically show hints while typing
cssEditor.on("inputRead", function (cm, event) {
    if (!cm.state.completionActive) {
        CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
    }
});

htmlEditor.on("inputRead", function (cm, event) {
    const autocompleteButton = document.getElementById('autocomplete-button');
    const isOn = autocompleteButton.textContent.includes('On');
    if (isOn && !cm.state.completionActive) {
        CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
    }
});

jsEditor.on("inputRead", function (cm, event) {
    if (!cm.state.completionActive) {
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
htmlEditor.on('change', () => {
    isUnsaved = true;
    updatePreview();
    updateUndoRedoButtons();
});

cssEditor.on('change', () => {
    isUnsaved = true;
    updatePreview();
    updateUndoRedoButtons();
});

jsEditor.on('change', () => {
    isUnsaved = true;
    updatePreview();
    updateUndoRedoButtons();
});


// Function to toggle files
function toggleFile(type) {
    console.log("toggleFile called with type:", type);
    const htmlEditorElement = htmlEditor.getWrapperElement();
    const cssEditorElement = cssEditor.getWrapperElement();
    const jsEditorElement = jsEditor.getWrapperElement();
    const lectureDisplayArea = document.getElementById('lecture-display-area');
    const editorContainer = document.getElementById('editor-container'); // Get editor container

    // Hide lecture display when switching to code editors
    if (lectureDisplayArea) {
        lectureDisplayArea.classList.add('hidden');
    }
    editorContainer.classList.remove('lecture-active'); // Remove lecture-active class

    htmlEditorElement.classList.add('hidden');
    cssEditorElement.classList.add('hidden');
    jsEditorElement.classList.add('hidden');
    document.getElementById('preview').classList.remove('hidden'); // Ensure preview is shown with editors

    if (type === 'html') {
        console.log("Showing HTML editor");
        htmlEditorElement.classList.remove('hidden');
    } else if (type === 'css') {
        console.log("Showing CSS editor");
        cssEditorElement.classList.remove('hidden');
    } else if (type === 'js') {
        console.log("Showing JS editor");
        jsEditorElement.classList.remove('hidden');
    }
    updateUndoRedoButtons(); // Update button states after toggle
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
        const wrappedText = `<!DOCTYPE html>
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
        clearEditor(); // Clear existing content before inserting template
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
    const lectureDisplayArea = document.getElementById('lecture-display-area');

    // If lecture display is active, no CodeMirror editor is "active"
    if (!lectureDisplayArea.classList.contains('hidden')) {
        return null;
    }

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
    const undoButton = document.getElementById('undo-button');
    const redoButton = document.getElementById('redo-button');

    if (activeEditor) {
        const history = activeEditor.historySize();
        undoButton.disabled = !history.undo;
        redoButton.disabled = !history.redo;
    } else {
        // If no editor is active (e.g., lecture view is open), disable buttons
        undoButton.disabled = true;
        redoButton.disabled = true;
    }
    // checkCapsLock(); // This listener should be on document, not updated here
}

// Caps Lock Warning functions
// These event listeners should only be attached once, preferably on DOMContentLoaded
document.addEventListener('keydown', function (event) {
    if (event.getModifierState && event.getModifierState("CapsLock")) { // check for getModifierState existence
        showCapsLockWarning();
    } else {
        hideCapsLockWarning();
    }
});

document.addEventListener('keyup', function (event) {
    if (event.getModifierState && !event.getModifierState("CapsLock")) {
        hideCapsLockWarning();
    }
});

function showCapsLockWarning() {
    let warning = document.getElementById("capsWarning");
    if (!warning) {
        // This case should ideally not happen if the HTML is loaded correctly
        // and the warning element is already present as per index.html.
        // But for robustness:
        warning = document.createElement("p"); // Changed to p as in your HTML
        warning.id = "capsWarning";
        warning.innerHTML = "⚠️ Caps Lock is ON!";
        // Styles are already in CSS, no need to duplicate here
        document.querySelector('.toolbar .button-group').appendChild(warning); // Append to the group
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

// Initial call to update preview and set default editor
// These are now part of the DOMContentLoaded listener below
// toggleFile('html');
// updatePreview();

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
    // previewToggleButton is not directly used for class toggling here
    // const previewToggleButton = document.getElementById('preview-toggle-button'); 

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
async function confirmDiscardChanges() {
    if (!isUnsaved) return true;
    const confirmMsg = confirm("You have unsaved changes. Do you want to save them?");
    if (confirmMsg) {
        const success = await saveFile();
        return success;
    }
    return confirm("Are you sure you want to discard the changes?");
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

async function createNewFile() {
    const confirmed = await confirmDiscardChanges();
    if (!confirmed) return;

    const fileName = prompt("Enter the new file name with extension (e.g., index.html, style.css, script.js):");
    if (!fileName) return;

    const extension = fileName.split('.').pop().toLowerCase();
    if (!['html', 'css', 'js'].includes(extension)) {
        alert("Unsupported file extension. Please enter html, css, or js.");
        return;
    }

    clearEditor();

    if (extension === 'html') toggleFile('html');
    else if (extension === 'css') toggleFile('css');
    else toggleFile('js');

    currentFileName = fileName;
    isUnsaved = false;
    document.getElementById('current-file-name').textContent = fileName;
}


    // Clear all editors and hide lecture display
    clearEditor();
    const htmlEditorElement = htmlEditor.getWrapperElement();
    const cssEditorElement = cssEditor.getWrapperElement();
    const jsEditorElement = jsEditor.getWrapperElement();


async function loadFile(fileName) {
    const confirmed = await confirmDiscardChanges();
    if (!confirmed) return;

    const content = localStorage.getItem(fileName);
    const extension = fileName.split('.').pop().toLowerCase();

    if (extension === 'html') {
        toggleFile('html');
        htmlEditor.setValue(content);
        htmlEditor.focus();
    } else if (extension === 'css') {
        toggleFile('css');
        cssEditor.setValue(content);
        cssEditor.focus();
    } else if (extension === 'js') {
        toggleFile('js');
        jsEditor.setValue(content);
        jsEditor.focus();
    }

    currentFileName = fileName;
    isUnsaved = false;
    document.getElementById('current-file-name').textContent = fileName;

    document.getElementById('saved-files-container').classList.add('hidden');
    document.getElementById('saved-files-list').classList.add('hidden');

    updatePreview();
}


function saveFile() {
    return new Promise((resolve) => {
        let fileName = currentFileName;
        if (!fileName) {
            fileName = prompt('Enter file name to save:');
            if (!fileName) return resolve(false);
        }

        const editor = getActiveEditor();
        if (!editor) return resolve(false);

        const content = editor.getValue();
        localStorage.setItem(fileName, content);

        currentFileName = fileName;
        isUnsaved = false;
        document.getElementById('current-file-name').textContent = fileName;

        alert("✅ File saved as " + fileName);
        resolve(true);
    });
}

function viewAutosavedFiles() {
  const modal = document.getElementById('savedFilesModal');
  const list = document.getElementById('saved-files-modal-list');
  list.innerHTML = '';

  for (let i = 0; i < localStorage.length; i++) {
    const fileName = localStorage.key(i);
    const ext = fileName.split('.').pop().toLowerCase();
    if (['html', 'css', 'js'].includes(ext)) {
      const li = document.createElement('li');
      li.textContent = fileName;
      li.onclick = () => {
        loadFile(fileName);
        closeSavedFilesModal();
      };
      list.appendChild(li);
    }
  }

  if (list.children.length === 0) {
    const li = document.createElement('li');
    li.textContent = "⚠️ No saved files found.";
    list.appendChild(li);
  }

  modal.classList.remove('hidden');
}
function closeSavedFilesModal() {
  document.getElementById('savedFilesModal').classList.add('hidden');
}

    


// **NEW: Tutorial Sidebar Functions**

const chaptersListElement = document.getElementById('chapters-list');
const lectureDisplayArea = document.getElementById('lecture-display-area');
const editorContainer = document.getElementById('editor-container'); // Get reference to the editor container

// Define the base URL for fetching individual lecture Markdown files
// THIS IS THE CRITICAL LINE THAT NEEDS TO BE ABSOLUTELY CORRECT.
// Based on HR's example and your failing URLs, this is the full prefix.
const BASE_TOPIC_CONTENT_URL = 'https://raw.githubusercontent.com/freeCodeCamp/freeCodeCamp/refs/heads/main/curriculum/challenges/english/25-front-end-development/';


async function fetchChaptersAndTopics() {
    try {
        const response = await fetch('https://staticapis.pragament.com/online_courses/freecodecamp-html.json');
        const data = await response.json();
        renderChapters(data.chapters);
    } catch (error) {
        console.error('Error fetching chapters and topics:', error);
        chaptersListElement.innerHTML = '<li style="color: red; padding: 10px;">Failed to load tutorial content. Please check your internet connection or try again later.</li>';
        lectureDisplayArea.innerHTML = '<p style="color: red;">Failed to load tutorial content. Please check your internet connection or try again later.</p>';
    }
}

function renderChapters(chapters) {
    chaptersListElement.innerHTML = ''; // Clear previous content
    chapters.forEach(chapter => {
        const chapterLi = document.createElement('li');
        const chapterTitle = document.createElement('div');
        chapterTitle.classList.add('chapter-title');
        chapterTitle.textContent = chapter.name; // Use chapter.name as per your API
        chapterLi.appendChild(chapterTitle);

        const topicUl = document.createElement('ul');
        topicUl.classList.add('topic-list');

        chapter.topics.forEach(topic => {
            const topicLi = document.createElement('li');
            topicLi.classList.add('topic-item');
            
            // --- CRITICAL FIX FOR FOLDER NAME ---
            // Use chapter.dashedName directly. The full path is now in BASE_TOPIC_CONTENT_URL.
            // The previous attempts to remove 'lecture-' were incorrect for the overall path structure.
            const folderName = chapter.dashedName; 
            // --- END CRITICAL FIX ---

            const fullTopicUrl = `${BASE_TOPIC_CONTENT_URL}${folderName}/${topic.id}.md`;
            topicLi.dataset.topicUrl = fullTopicUrl; // Store the constructed URL on the element

            topicLi.textContent = topic.title;
            topicUl.appendChild(topicLi);

            // Event listener for clicking a topic
            topicLi.addEventListener('click', () => {
                // Remove 'active' class from all topics
                document.querySelectorAll('.topic-item').forEach(item => item.classList.remove('active'));
                // Add 'active' class to the clicked topic
                topicLi.classList.add('active');
                
                // Use the stored full URL to fetch lecture detail
                fetchLectureDetail(topicLi.dataset.topicUrl);
            });
        });

        chapterLi.appendChild(topicUl);
        chaptersListElement.appendChild(chapterLi);

        // Toggle topic list visibility on chapter title click
        chapterTitle.addEventListener('click', () => {
            topicUl.classList.toggle('expanded'); // Use a class for toggling display
        });
    });
}

async function fetchLectureDetail(topicUrl) {
    // Hide code editors and show lecture display area
    hideEditorsAndShowLecture();

    try {
        const response = await fetch(topicUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} from ${topicUrl}`);
        }
        const markdownContent = await response.text();
        renderMarkdown(markdownContent);
    } catch (error) {
        console.error('Error fetching lecture detail:', error);
        lectureDisplayArea.innerHTML = `<p style="color: red;">Failed to load lecture content: ${error.message}. Please check the console for details.</p>`;
    }
}

function renderMarkdown(markdownContent) {
    // Use marked.parse to convert Markdown to HTML
    lectureDisplayArea.innerHTML = marked.parse(markdownContent);

    // Add "Try it yourself" buttons to code blocks
    lectureDisplayArea.querySelectorAll('pre code').forEach(codeBlock => {
        const preElement = codeBlock.parentNode; // The <pre> tag
        const tryItButton = document.createElement('button');
        tryItButton.textContent = 'Try it yourself';
        tryItButton.classList.add('try-it-button');
        
        // Insert button after the pre element
        preElement.insertAdjacentElement('afterend', tryItButton);

        tryItButton.addEventListener('click', () => {
            const codeToInsert = codeBlock.textContent.trim(); // Get the code content
            // The classNames will be like "language-html", "language-css", etc.
            // Split by '-' and take the last part.
            const codeLanguage = codeBlock.className.split('-').pop(); 

            // Determine which editor to use and insert code
            if (codeLanguage === 'html' || codeLanguage === 'xml') { // Marked.js might tag HTML as xml
                htmlEditor.setValue(codeToInsert);
                toggleFile('html'); // Show the HTML editor and hide lecture
            } else if (codeLanguage === 'css') {
                cssEditor.setValue(codeToInsert);
                toggleFile('css'); // Show the CSS editor and hide lecture
            } else if (codeLanguage === 'js' || codeLanguage === 'javascript') {
                jsEditor.setValue(codeToInsert);
                toggleFile('js'); // Show the JS editor and hide lecture
            } else {
                // Fallback: If language not detected, put in HTML editor and alert
                htmlEditor.setValue(codeToInsert);
                toggleFile('html');
                alert(`Code inserted into HTML editor. Language '${codeLanguage}' not specifically handled.`);
            }
            htmlEditor.focus(); // Focus on the HTML editor (or the specific one if toggled)
            updatePreview(); // Update the preview after inserting code
        });
    });
}

// Utility function to hide editors and show lecture area
function hideEditorsAndShowLecture() {
    htmlEditor.getWrapperElement().classList.add('hidden');
    cssEditor.getWrapperElement().classList.add('hidden');
    jsEditor.getWrapperElement().classList.add('hidden');
    document.getElementById('preview').classList.add('hidden'); // Hide preview as well
    lectureDisplayArea.classList.remove('hidden'); // Show lecture display
    editorContainer.classList.add('lecture-active'); // Add class to editor container to hide its children
}


// Combined window.onload / DOMContentLoaded for initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Original window.onload content for loading files from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const fileUrl = urlParams.get("file");
    if (fileUrl) {
        try {
            const res = await fetch(fileUrl);
            const content = await res.text();
            const extension = fileUrl.split('.').pop();

            if (extension === 'html') htmlEditor.setValue(content);
            else if (extension === 'css') cssEditor.setValue(content);
            else if (extension === 'js') jsEditor.setValue(content);

            updatePreview();
            lectureDisplayArea.classList.add('hidden'); // Ensure lecture is hidden if a file is loaded
            editorContainer.classList.remove('lecture-active'); // Ensure editors are shown
            toggleFile(extension); // Show the specific editor loaded
        } catch (err) {
            alert('Failed to load file from URL: ' + err.message);
            // If file load fails, revert to default tutorial view
            fetchChaptersAndTopics();
            toggleFile('html'); // Still show HTML editor as default
        }
    } else {
        // If no file was loaded from URL, initialize tutorial sidebar and show lecture by default
        fetchChaptersAndTopics();
        hideEditorsAndShowLecture(); // Show lecture area by default
    }
    
    updateUndoRedoButtons(); // Initial update for buttons
    // checkCapsLock() listener is attached directly to document, no need to call it here.
});

// ==== Activity bar toggle logic (ensure only one sidebar shows at a time) ====
function showOnlySidebar(sidebarId) {
    const explorer = document.getElementById('file-explorer');
    const tutorial = document.getElementById('tutorial-sidebar');
    const btnExplorer = document.getElementById('btn-activity-explorer');
    const btnTutorial = document.getElementById('btn-activity-tutorial');

    const all = [explorer, tutorial];
    const buttons = [btnExplorer, btnTutorial];

    // Toggle target; hide others
    all.forEach(el => {
        if (!el) return;
        if (el.id === sidebarId) {
            // Remove legacy classes that might keep it hidden
            el.classList.remove('hidden');
            const mainContainer = document.getElementById('main-container');
            mainContainer?.classList.remove('full-width');
            // Toggle visibility
            if (el.classList.contains('sidebar-hidden')) {
                el.classList.remove('sidebar-hidden');
            } else {
                el.classList.add('sidebar-hidden');
            }
        } else {
            el.classList.add('sidebar-hidden');
        }
    });

    // Active state only if shown
    buttons.forEach(b => b?.classList.remove('active'));
    if (!document.getElementById(sidebarId)?.classList.contains('sidebar-hidden')) {
        if (sidebarId === 'file-explorer') btnExplorer?.classList.add('active');
        if (sidebarId === 'tutorial-sidebar') btnTutorial?.classList.add('active');
    }

    // Keep toolbar on top after DOM reflow
    requestAnimationFrame(() => {
        document.querySelector('.toolbar')?.classList.add('toolbar-top');
    });
}

// Public handlers for activity bar buttons
function toggleExplorerSidebar() {
    showOnlySidebar('file-explorer');
}
function toggleTutorialSidebar() {
    showOnlySidebar('tutorial-sidebar');
}

// Keep existing hide/show explorer functions compatible (override safely)
hideFileExplorer = function () {
    const fileExplorer = document.getElementById('file-explorer');
    fileExplorer?.classList.add('sidebar-hidden');
    fileExplorer?.classList.remove('hidden'); // ensure legacy class removed so it can reopen
    document.getElementById('btn-activity-explorer')?.classList.remove('active');
};

function showFileExplorer() {
    const fileExplorer = document.getElementById('file-explorer');
    const mainContainer = document.getElementById('main-container');
    fileExplorer?.classList.remove('sidebar-hidden', 'hidden');
    mainContainer?.classList.remove('full-width');
    document.getElementById('btn-activity-explorer')?.classList.add('active');
}

// Toggle output/preview panel visibility (VS Code-like)
function toggleOutputPanel() {
    const previewContainer = document.querySelector('.preview-container');
    if (!previewContainer) return;
    previewContainer.classList.toggle('hidden');
}

// ===== Demo GitHub login (non-OAuth) to avoid conflicts for now =====
window.UserSignin = function () {
    // Simple demo: mark as logged in and show demo repos
    localStorage.setItem('githubToken', 'demo');
    document.getElementById('github-login-btn')?.setAttribute('style', 'display:none');
    document.getElementById('github-logout-btn')?.setAttribute('style', 'display:inline-block');
    const reposDiv = document.getElementById('github-repos');
    if (reposDiv) {
        reposDiv.innerHTML = '';
        ['demo/portfolio', 'demo/web-project', 'demo/learning-html'].forEach((name, i) => {
            const btn = document.createElement('button');
            btn.textContent = `${i + 1}. ${name}`;
            btn.onclick = () => {
                const filesDiv = document.getElementById('github-files');
                if (filesDiv) {
                    filesDiv.innerHTML = '';
                    ['index.html', 'style.css', 'script.js'].forEach(f => {
                        const fBtn = document.createElement('button');
                        fBtn.textContent = f;
                        fBtn.onclick = () => {
                            if (f.endsWith('.html')) { htmlEditor.setValue(defaultHTML); toggleFile('html'); }
                            else if (f.endsWith('.css')) { cssEditor.setValue(defaultCSS); toggleFile('css'); }
                            else { jsEditor.setValue(defaultJS); toggleFile('js'); }
                            updatePreview();
                        };
                        filesDiv.appendChild(fBtn);
                    });
                }
            };
            reposDiv.appendChild(btn);
        });
    }
};

window.UserLogout = function () {
    localStorage.removeItem('githubToken');
    document.getElementById('github-login-btn')?.setAttribute('style', 'display:inline-block');
    document.getElementById('github-logout-btn')?.setAttribute('style', 'display:none');
    const reposDiv = document.getElementById('github-repos');
    const filesDiv = document.getElementById('github-files');
    if (reposDiv) reposDiv.innerHTML = '<p style="color:#888;">Login to view repositories</p>';
    if (filesDiv) filesDiv.innerHTML = '<p style="color:#888;">Select a repository to view files</p>';
};