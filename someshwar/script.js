$(document).ready(function () {

    // --- Firebase Initialization & Auth State Listener ---
    let app; // Firebase App instance
    let auth; // Firebase Auth instance
    let githubProvider; // GitHub Auth Provider instance

    function initializeFirebase() {
        // IMPORTANT: Replace with your actual Firebase config if needed
        const firebaseConfig = {
            apiKey: "AIzaSyDVI-OzuRhPU_Cgi5_wumEmuMrYcZitTfU", // Using provided key
            authDomain: "code-playground-7560f.firebaseapp.com", // Using provided domain
            projectId: "code-playground-7560f", // Using provided project ID
            storageBucket: "code-playground-7560f.appspot.com", // Using provided bucket
            messagingSenderId: "964957504902", // Using provided sender ID
            appId: "1:964957504902:web:288a77e7e0d0a7e8875807", // Using provided app ID
            measurementId: "G-6T6YFFN7H9" // Using provided measurement ID
          };

        try {
            // Check if Firebase is loaded globally (using compat libraries)
            if (typeof firebase === 'undefined' || typeof firebase.initializeApp !== 'function') {
                console.error("Firebase SDK (compat) not loaded. Cannot initialize.");
                alert("Error: Firebase not loaded. Authentication will not work.");
                // Consider if sidebarGithubLoginBtn needs disabling here, though it's in a hidden sidebar
                return;
            }

            // Initialize Firebase using the compat libraries
            app = firebase.initializeApp(firebaseConfig);
            auth = firebase.auth(app); // Use compat auth
            githubProvider = new firebase.auth.GithubAuthProvider(); // Use compat provider
            // githubProvider.addScope('repo'); // Uncomment if you need private repo access (use carefully)

            console.log("Firebase initialized successfully.");

            // Auth State Change Listener (using compat syntax)
            auth.onAuthStateChanged((user) => {
                updateUIForAuthState(user); // Call function to handle UI updates
                if (user) {
                    console.log("User is signed in:", user.displayName);
                    // Attempt to fetch repos if user is logged in, in case token is still valid
                    // Get the token safely
                    user.getIdTokenResult()
                        .then(idTokenResult => {
                            // Check for the GitHub access token in the claims
                            // Note: Firebase Auth doesn't automatically store the GitHub OAuth token long-term by default.
                            // Fetching repos might require re-authentication or storing the token securely.
                            // For simplicity, we primarily fetch repos right after the signInWithPopup success.
                            console.log("User logged in, checking auth state.");
                            // We won't automatically fetch repos here unless we have a stored token.
                            // The fetch is primarily triggered by the signInWithGitHub function.
                            // Check if the repo list currently shows the default "Please sign in" message
                            const repoListContent = userReposList.html(); // Use jQuery's .html()
                            if (repoListContent && repoListContent.includes('Please sign in')) {
                                userReposList.html('<li>Click "Login with GitHub" again if needed to refresh token/repos.</li>');
                            }
                        })
                        .catch(error => {
                            console.error("Error getting ID token result on auth state change:", error);
                        });

                } else {
                    console.log("User is signed out.");
                }
            });

        } catch (error) {
            console.error("Firebase Initialization Error:", error);
            alert("Failed to initialize Firebase authentication.");
            // Consider if sidebarGithubLoginBtn needs disabling here
        }
    }

    // --- DOM Element Selection ---
    const themeToggleBtn = $('#themeToggleBtn');
    const navThemeToggleBtn = $('#navThemeToggleBtn');
    const hljsLightTheme = $('#hljs-light-theme');
    const hljsDarkTheme = $('#hljs-dark-theme');
    const codeMirrorDefaultThemeLink = $('link[href*="theme/default.min.css"]');
    const codeMirrorDarkThemeLink = $('link[href*="theme/material-darker.min.css"]');

    const editorTabs = $('#editorTabs'); // Now inside file sidebar
    const editorPanes = $('#editorPanes');
    const newFileBtn = $('#newFileBtn'); // Now inside file sidebar
    const navNewFileBtn = $('#navNewFileBtn'); // In vertical nav
    const newFileModalOverlay = $('#newFileModalOverlay');
    const closeModalBtn = $('#closeModalBtn');
    const cancelModalBtn = $('#cancelModalBtn');
    const createFileBtn = $('#createFileBtn');
    const newFileNameInput = $('#newFileName');
    const modalError = $('#modalError');
    const imageBtn = $('#imageBtn'); // Now inside file sidebar
    const navAddImageBtn = $('#navAddImageBtn'); // In vertical nav
    const imageUploadInput = $('#imageUploadInput'); // Now inside file sidebar

    const runBtn = $('#runBtn'); // In editor controls header
    const outputScreen = $('#outputScreen');
    const resetBtn = $('#navResetBtn'); // In vertical nav
    const downloadBtn = $('#navDownloadBtn'); // In vertical nav

    const viewToggleButton = $('#viewToggleButton'); // In editor controls header
    const editorLayoutContainer = $('#editorLayout');
    const toggleSpecialCharsBtn = $('#toggleSpecialCharsBtn'); // In editor controls header
    const specialCharContainer = $('#specialCharContainer');
    const undoBtn = $('#undoBtn'); // In editor controls header
    const redoBtn = $('#redoBtn'); // In editor controls header
    const insertDefaultCodeBtn = $('#insertDefaultCodeBtn'); // In special chars

    const editModeBtn = $('#editModeBtn'); // NEW: Edit mode button in editor controls header
    const learnPanel = $('#learnPanel');
    const navLearnBtn = $('#navLearnBtn'); // In vertical nav
    const closeLearnPanelBtn = $('#closeLearnPanelBtn');
    const learnMessageBox = $('#learnPanel .message-box'); // Use the message box for feedback
    const learnSelect = $('#mySelect');
    const defaultLearnMessage = '<div>Select a topic above to start learning.</div>';

    const menuToggleBtn = $('#menuToggleBtn'); // Vertical nav toggle
    const verticalNav = $('#verticalNav');

    // Left GitHub Sidebar Elements
    const leftSidebarNav = $('#leftSidebarNav');
    const leftSidebarToggleBtn = $('#leftSidebarToggleBtn'); // In activity bar now
    const closeLeftSidebarBtn = $('#closeLeftSidebarBtn');
    const sidebarOverlay = $('#sidebarOverlay');
    const sidebarGithubLoginBtn = $('#sidebarGithubLoginBtn'); // Login button in the GitHub sidebar
    const navLogoutBtn = $('#navLogoutBtn'); // Logout button in the left sidebar

    // NEW: File Sidebar Elements
    const fileSidebar = $('#fileSidebar');
    const activityBarFileToggleBtn = $('#fileSidebarToggleBtn'); // New toggle button in activity bar
    const fileSidebarResizeHandle = $('#fileSidebarResizeHandle');
    const mainContentArea = $('#mainContentArea');
    const editorControlsHeader = $('#editorControlsHeader'); // New header for controls
    const userProfileContainer = $('#userProfileContainer');
    const userProfileImage = $('#userProfileImage');
    const editorPlaceholder = $('#editorPlaceholder'); // New placeholder element
    const userProfileName = $('#userProfileName');
    const userProfileEmail = $('#userProfileEmail');
    const userReposContainer = $('#userReposContainer');
    const userReposList = $('#userReposList'); // The UL element for repos

    // NEW: Git Sidebar Elements
    const gitView = $('#gitView');
    const gitSidebarToggleBtn = $('#gitSidebarToggleBtn');
    const closeGitSidebarBtn = $('#closeGitSidebarBtn');
    // Git Action Elements (now inside gitView)
    const gitActionsContainer = $('#gitActionsContainer');
    const currentRepoNameSpan = $('#currentRepoName');
    const gitRepoUrlInput = $('#gitRepoUrlInput');
    const gitCloneBtn = $('#gitCloneBtn');
    const gitStatusBtn = $('#gitStatusBtn');
    const gitPullBtn = $('#gitPullBtn');
    const gitCommitMsgInput = $('#gitCommitMsgInput');
    const gitCommitBtn = $('#gitCommitBtn');
    const gitPushBtn = $('#gitPushBtn');
    // const gitFetchFilesBtn = $('#gitFetchFilesBtn'); // Assuming this might be added later
    const gitStatusOutput = $('#gitStatusOutput'); // Assuming this might be added later


    // Constants for resizing
    const MIN_SIDEBAR_WIDTH = 150;
    const MAX_SIDEBAR_WIDTH = 500;
    const DEFAULT_SIDEBAR_WIDTH = 250;
    const SIDEBAR_WIDTH_STORAGE_KEY = 'fileSidebarWidth';

    // --- Global Variables ---
    let currentGitHubToken = null; // Variable to store the GitHub token
    let isCurrentlyEditing = true; // MODIFIED: Tracks if the active editor is in edit mode, now defaults to true
    let editors = {}; // To hold CodeMirror instances
    const imageFiles = {}; // To hold added image data { 'filename': { blob: Blob, dataUrl: '...' } }
    const defaultContent = { // Default content snippets
        html: `<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is a paragraph.</p>
    <script src="script.js"></script>
</body>
</html>`,
        css: `body {
    font-family: sans-serif;
    background-color: #f0f0f0;
}

h1 {
    color: navy;
    text-align: center;
}

p {
    color: #333;
}`,
        js: `console.log("Hello from JavaScript!");

// Add event listener example
document.addEventListener('DOMContentLoaded', () => {
    const heading = document.querySelector('h1');
    if (heading) {
        heading.addEventListener('click', () => {
            alert('Heading clicked!');
        });
    }
});`,
        markdown: `# My Markdown File

This is a paragraph with some *italic* and **bold** text.

- List item 1
- List item 2

\`\`\`javascript
function greet(name) {
    console.log(\`Hello, \${name}!\`);
}
greet('User');
\`\`\`
`
    };
    // NEW: For Git Integration
    let currentRepoDetails = {
        owner: null,
        repo: null,
        branch: null, // e.g., 'main' or 'master'
        name: null, // To store the repo name for matching with tab's repoSource
        files: {} // To store SHA and original content of fetched files: { 'path/to/file.html': { sha: '...', originalContent: '...' } }
    };


    // --- Theme Management ---
    function applyTheme(theme) {
        const isDark = theme === 'dark';
        $('body').toggleClass('dark-theme', isDark);
        // Check if elements exist before trying to modify them
        if (hljsLightTheme.length) hljsLightTheme.prop('disabled', isDark);
        if (hljsDarkTheme.length) hljsDarkTheme.prop('disabled', !isDark);
        if (codeMirrorDefaultThemeLink.length) codeMirrorDefaultThemeLink.prop('disabled', isDark);
        if (codeMirrorDarkThemeLink.length) codeMirrorDarkThemeLink.prop('disabled', !isDark);


        // Use the correct theme name for CodeMirror
        const cmTheme = isDark ? 'material-darker' : 'default';
        Object.values(editors).forEach(editor => editor?.setOption('theme', cmTheme));
        localStorage.setItem('theme', theme);

        if (learnPanel.hasClass('visible')) {
            // Re-apply highlighting if learn panel is open and contains code
             learnMessageBox.find('pre code').each((i, block) => {
                 if (typeof hljs !== 'undefined') {
                     hljs.highlightElement(block);
                 }
             });
        }
    }

    function toggleTheme() {
        applyTheme($('body').hasClass('dark-theme') ? 'light' : 'dark');
    }

    // Apply initial theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

    // Attach theme toggle listeners only if buttons exist
    if (themeToggleBtn.length) themeToggleBtn.on('click', toggleTheme);
    if (navThemeToggleBtn.length) navThemeToggleBtn.on('click', toggleTheme);


    // --- CodeMirror Initialization ---
    function initializeCodeMirror(textareaId, mode, content = '') {
        const textareaElement = document.getElementById(textareaId);
        if (!textareaElement) {
            console.error(`Textarea element with ID "${textareaId}" not found.`);
            return null;
        }
        try {
            const editor = CodeMirror.fromTextArea(textareaElement, {
                lineNumbers: true,
                mode: mode,
                theme: $('body').hasClass('dark-theme') ? 'material-darker' : 'default', // Set initial theme correctly
                autoCloseTags: mode === 'xml' || mode === 'htmlmixed',
                autoCloseBrackets: true,
                lineWrapping: true,
            });
            editor.setValue(content);
            editors[textareaId] = editor;

            // Refresh on tab switch and view toggle
            const paneId = $(textareaElement).closest('.editor-pane').attr('id');
            // Use a generic event listener if not using Bootstrap tabs
            // Ensure the selector targets the correct button based on your HTML structure
            $(`.tab-button[data-target="${paneId}"]`).on('click', () => { // Refresh on tab click
                 // Use setTimeout to ensure pane is visible before refresh
                 console.log(`Refreshing editor on tab switch: ${textareaId}`);
                setTimeout(() => editor.refresh(), 0);
            });
            viewToggleButton.on('click', () => setTimeout(() => editor.refresh(), 50)); // Refresh after layout shift

            return editor;
        } catch (error) {
            console.error(`Error initializing CodeMirror for ${textareaId}:`, error);
            // Optionally display an error message to the user in the editor area
            $(textareaElement).replaceWith(`<div style="color: red; padding: 10px;">Error loading editor: ${error.message}</div>`);
            return null; // Indicate failure
        }
    }

    // --- Active Editor Helper ---
    function getActiveEditor() {
        const activePane = editorPanes.find('.editor-pane.active');
        if (!activePane.length) return null; // No active pane
        const textareaId = activePane.find('textarea').attr('id');
        return editors[textareaId] || null; // Return editor or null
    }

    // --- NEW: Edit Mode Button Functionality ---
    if (editModeBtn.length) {
        editModeBtn.on('click', function() {
            const currentEditor = getActiveEditor();
            if (!currentEditor) {
                console.warn("No active editor instance to toggle edit mode.");
                alert("Please open or select a file in the editor first.");
                return;
            }

            isCurrentlyEditing = !isCurrentlyEditing; // Toggle the state
            currentEditor.setOption("readOnly", !isCurrentlyEditing);

            if (isCurrentlyEditing) {
                editModeBtn.attr('title', "Disable Editing (View Mode)");
                editModeBtn.addClass('editing-active'); // Optional: for styling
                currentEditor.focus(); // Initial focus attempt
                console.log("Editing enabled for the current file.");
                console.log("Current editor readOnly state (after button click):", currentEditor.getOption("readOnly"));

                setTimeout(() => {
                    currentEditor.refresh();
                    // More robust focus attempt
                    if (document.activeElement !== currentEditor.getInputField()) {
                        currentEditor.focus();
                    }
                    console.log("Focus attempted on editor after button click and refresh.");
                }, 0);
            } else {
                editModeBtn.attr('title', "Enable Editing");
                editModeBtn.removeClass('editing-active'); // Optional: for styling
                console.log("Editing disabled. View mode active.");
            }
        });
    } else {
        console.error("Edit mode button (#editModeBtn) not found.");
    }

    // Function to show the edit button and set editor to read-only
    function showEditButton(editorInstance) {
        if (editModeBtn.length && editorInstance) {
            editModeBtn.removeClass('hidden');
            // Respect the global isCurrentlyEditing state
            editorInstance.setOption("readOnly", !isCurrentlyEditing);
            // DIAGNOSTIC: Check CodeMirror's actual readOnly state
            console.log(`Editor ${editorInstance.getTextArea().id} readOnly state (in showEditButton):`, editorInstance.getOption("readOnly"), "isCurrentlyEditing:", isCurrentlyEditing);


            if (isCurrentlyEditing) {
                editModeBtn.attr('title', "Disable Editing (View Mode)");
                editModeBtn.addClass('editing-active');
            } else {
                editModeBtn.attr('title', "Enable Editing");
                editModeBtn.removeClass('editing-active');
            }
        } else if (!editorInstance) {
            hideEditButton(); // Hide if no valid editor instance
        }
    }

    // Function to hide the edit button
    function hideEditButton() {
        if (editModeBtn.length) {
            editModeBtn.addClass('hidden');
            // isCurrentlyEditing = false; // REMOVED: Don't reset global state here
            editModeBtn.removeClass('editing-active');
        }
    }

    // --- Tab Management ---
    function switchTab(targetId) {
        if (!targetId) return; // Exit if targetId is invalid
        editorPlaceholder.hide(); // Hide placeholder when switching to any tab
        editorTabs.find('.tab-button.active').removeClass('active');
        editorPanes.find('.editor-pane.active').removeClass('active');

        const newTab = editorTabs.find(`.tab-button[data-target="${targetId}"]`);
        const newPane = editorPanes.find(`#${targetId}`);

        if (!newTab.length || !newPane.length) {
            console.warn(`Could not find tab or pane for target ID: ${targetId}`);
            // If no tabs are left, show placeholder
            if (editorTabs.find('.tab-button').length === 0) {
                editorPlaceholder.show();
            }
            return;
        }

        newTab.addClass('active');
        newPane.addClass('active');

        const textareaId = newPane.find('textarea').attr('id');
        if (editors[textareaId]) {
            setTimeout(() => {
                console.log(`Refreshing editor on tab switch (manual): ${textareaId}`);
                const editorToFocus = editors[textareaId];
                editorToFocus.refresh();
                // More robust focus attempt
                if (document.activeElement !== editorToFocus.getInputField()) {
                    editorToFocus.focus();
                }
                console.log(`Focus attempted on editor ${textareaId} during tab switch.`);
                showEditButton(editors[textareaId]); // Show edit button for the new active editor
            }, 0);
        } else {
            // If no editor for this tab (e.g., image pane), hide edit button
            if (newPane.hasClass('image-pane')) {
                hideEditButton();
            }
        }
    }

    // Ensure editorTabs exists before attaching listener
    if (editorTabs.length) {
        editorTabs.on('click', '.tab-button:not(.tab-close-button)', function () {
            switchTab($(this).data('target'));
        });
    } else {
        console.error("Editor tabs container (#editorTabs) not found.");
    }


    // --- New File Modal ---
    function openNewFileModal() {
        newFileNameInput.val('');
        modalError.text('');
        newFileModalOverlay.addClass('visible');
        newFileNameInput.focus();
    }

    function closeNewFileModal() {
        newFileModalOverlay.removeClass('visible');
    }

    // Attach listeners only if elements exist
    if (newFileBtn.length) newFileBtn.on('click', openNewFileModal);
    if (navNewFileBtn.length) navNewFileBtn.on('click', openNewFileModal);
    if (closeModalBtn.length) closeModalBtn.on('click', closeNewFileModal);
    if (cancelModalBtn.length) cancelModalBtn.on('click', closeNewFileModal);
    if (newFileModalOverlay.length) newFileModalOverlay.on('click', function(e) { if (e.target === this) closeNewFileModal(); });


    // --- Create File ---
    if (createFileBtn.length) {
        createFileBtn.on('click', function () {
            const fileName = newFileNameInput.val().trim();
            modalError.text('');

            if (!fileName) {
                modalError.text('File name cannot be empty.'); return;
            }

            // Determine mode and initial content based on extension
            const extension = fileName.split('.').pop().toLowerCase();
            let mode = 'plaintext', initialContent = '', isImage = false;

            switch (extension) {
                case 'html': mode = 'xml'; initialContent = defaultContent.html; break;
                case 'css': mode = 'css'; initialContent = defaultContent.css; break;
                case 'js': mode = 'javascript'; initialContent = defaultContent.js; break;
                case 'md': case 'markdown': mode = 'markdown'; initialContent = defaultContent.markdown; break;
                case 'json': mode = 'javascript'; initialContent = '{}'; break;
                case 'xml': mode = 'xml'; initialContent = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n</root>'; break;
                case 'txt': break;
                case 'png': case 'jpg': case 'jpeg': case 'gif': case 'svg': case 'webp': case 'bmp': case 'ico':
                    isImage = true; break;
                default: console.warn(`Unknown file extension ".${extension}". Using plaintext.`);
            }

            if (isImage) {
                 alert("Please use the 'Add Image' button to upload image files.");
            } else {
                if (addFileToEditor(fileName, initialContent, mode)) {
                    const newTab = editorTabs.find(`.tab-button[data-filename="${fileName}"]`);
                    if (newTab.length) {
                        switchTab(newTab.data('target'));
                    }
                }
            }
            closeNewFileModal();
        });
    } else {
        console.error("Create file button (#createFileBtn) not found.");
    }


    // --- REFACTORED: Add File to Editor (Used by Create File & Import) ---
    function addFileToEditor(fileName, content, mode = 'plaintext', repoSource = '') {
        if (!editorTabs.length || !editorPanes.length) {
            console.error("Cannot add file: Editor tabs or panes container not found.");
            return false;
        }
        editorPlaceholder.hide();
        let nameExists = false;
        editorTabs.find('.tab-button').each(function() {
            if ($(this).data('filename')?.toLowerCase() === fileName.toLowerCase()) {
                nameExists = true; return false;
            }
        });
        if (nameExists || imageFiles[fileName]) {
            console.warn(`File or image named "${fileName}" already exists. Skipping.`);
            return false;
        }

        const timestamp = Date.now();
        const fileId = `file-${timestamp}-${Math.random().toString(36).substring(2, 7)}`;
        const textareaId = `code-${fileId}`;
        const safeFileName = fileName.replace(/"/g, '&quot;');

        const newTab = $(`
            <button class="tab-button" data-target="${fileId}" data-filename="${safeFileName}" data-is-image="false" title="${safeFileName}" data-repo-source="${repoSource}">
                <span>${safeFileName}</span>
                <span class="tab-close-button" title="Close ${safeFileName}" aria-label="Close ${safeFileName}">&times;</span>
            </button>
        `);
        editorTabs.append(newTab);

        const newPaneContent = `<div class="editor-pane" id="${fileId}"><textarea id="${textareaId}"></textarea></div>`;
        editorPanes.append(newPaneContent);

        if (!initializeCodeMirror(textareaId, mode, content)) {
            newTab.remove();
            editorPanes.find(`#${fileId}`).remove();
            console.error(`Failed to initialize editor for ${fileName}. File not added.`);
            if (editorTabs.find('.tab-button').length === 0) {
                editorPlaceholder.show();
            }
            return false;
        }
        const newEditorInstance = editors[textareaId];
        if (newEditorInstance) {
            // Directly set the readOnly state when the editor is first initialized
            newEditorInstance.setOption("readOnly", !isCurrentlyEditing);
            // DIAGNOSTIC: Check CodeMirror's actual readOnly state
            console.log(`New editor ${newEditorInstance.getTextArea().id} readOnly state (in addFileToEditor):`, newEditorInstance.getOption("readOnly"), "isCurrentlyEditing:", isCurrentlyEditing);
            showEditButton(newEditorInstance); // Still call this to update button UI
        }
        return true;
    }

    // --- Close Tab ---
    if (editorTabs.length) {
        editorTabs.on('click', '.tab-close-button', function (e) {
            e.stopPropagation();
            const tabToClose = $(this).closest('.tab-button');
            const targetId = tabToClose.data('target');
            const paneToClose = editorPanes.find(`#${targetId}`);
            const textareaId = paneToClose.find('textarea').attr('id');
            const isImage = tabToClose.data('is-image') === true;
            const fileName = tabToClose.data('filename');

            if (isImage && !confirm(`Remove the reference to image "${fileName}"? It won't be included in the download.`)) {
                return;
            }

            if (tabToClose.hasClass('active')) {
                const nextTab = tabToClose.next('.tab-button').length ? tabToClose.next('.tab-button') : tabToClose.prev('.tab-button');
                if (nextTab.length) {
                    switchTab(nextTab.data('target'));
                } else {
                    hideEditButton();
                    editorPlaceholder.show();
                }
            }

            tabToClose.remove();
            paneToClose.remove();
            if (textareaId && editors[textareaId]) delete editors[textareaId];
            if (isImage && imageFiles[fileName]) delete imageFiles[fileName];

            if (editorTabs.find('.tab-button').length === 0) {
                hideEditButton();
                editorPlaceholder.show();
            }
        });
    }


    // --- Add Image ---
    function handleImageUpload(files) {
        if (!files?.length) return;
        const file = files[0];
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.'); return;
        }
        const fileName = file.name;

        let nameExists = false;
        editorTabs.find('.tab-button').each(function() {
            if ($(this).data('filename')?.toLowerCase() === fileName.toLowerCase()) { nameExists = true; return false; }
        });
        if (imageFiles[fileName]) nameExists = true;

        if (nameExists) {
            alert(`An image or file named "${fileName}" already exists.`);
            imageUploadInput.val(''); return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const dataUrl = e.target.result;
            imageFiles[fileName] = { blob: file, dataUrl: dataUrl };

            const timestamp = Date.now();
            const fileId = `image-${timestamp}-${Math.random().toString(36).substring(2, 7)}`;
            const safeFileName = fileName.replace(/"/g, '&quot;');

            const newTab = $(`
                <button class="tab-button" data-target="${fileId}" data-filename="${safeFileName}" data-is-image="true" title="${safeFileName}" data-repo-source="">
                    <span>${safeFileName}</span>
                    <span class="tab-close-button" title="Remove ${safeFileName} reference" aria-label="Remove ${safeFileName} reference">&times;</span>
                </button>
            `);
            editorTabs.append(newTab);

            const newPane = $(`
                <div class="editor-pane image-pane" id="${fileId}">
                     <div style="padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; box-sizing: border-box; text-align: center;">
                        <p>Image added: <strong>${safeFileName}</strong></p>
                        <img src="${dataUrl}" alt="${safeFileName}" style="max-width: 80%; max-height: 60%; margin-top: 15px; border: 1px solid var(--editor-border);">
                        <p style="margin-top: 15px; font-size: 0.9em;"><i>Reference in HTML/CSS using <code>${safeFileName}</code>.</i></p>
                    </div>
                </div>
            `);
            editorPanes.append(newPane);
            editorPlaceholder.hide();
            hideEditButton();
            switchTab(fileId);
            imageUploadInput.val('');
        };
        reader.onerror = () => { alert("Failed to read image file."); imageUploadInput.val(''); };
        reader.readAsDataURL(file);
    }

    if (imageBtn.length) imageBtn.on('click', () => imageUploadInput.click());
    if (navAddImageBtn.length) navAddImageBtn.on('click', () => imageUploadInput.click());
    if (imageUploadInput.length) imageUploadInput.on('change', (e) => handleImageUpload(e.target.files));


    // --- Run Code ---
    if (runBtn.length) {
        runBtn.on('click', function () {
            let htmlCode = '', cssCode = '', jsCode = '';
            let htmlFileFound = false, cssFileFound = false, jsFileFound = false;

            editorTabs.find('.tab-button:not([data-is-image="true"])').each(function() {
                const $tab = $(this);
                const fileName = $tab.data('filename');
                const targetId = $tab.data('target');
                const textareaId = editorPanes.find(`#${targetId} textarea`).attr('id');
                const editorContent = editors[textareaId]?.getValue() || '';

                if (!htmlFileFound && fileName?.endsWith('.html')) {
                    htmlCode = editorContent; htmlFileFound = true;
                } else if (!cssFileFound && fileName?.endsWith('.css')) {
                    cssCode = editorContent; cssFileFound = true;
                } else if (!jsFileFound && fileName?.endsWith('.js')) {
                    jsCode = editorContent; jsFileFound = true;
                }
            });

            let processedHtml = htmlCode;
            for (const filename in imageFiles) {
                const regex = new RegExp(`src=(["'])${filename.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\1`, 'gi');
                processedHtml = processedHtml.replace(regex, `src="${imageFiles[filename].dataUrl}"`);
            }
            let processedCss = cssCode;
             for (const filename in imageFiles) {
                const regex = new RegExp(`url\\((["']?)${filename.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\1\\)`, 'gi');
                processedCss = processedCss.replace(regex, `url("${imageFiles[filename].dataUrl}")`);
            }

            const combinedCode = `
                <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${processedCss}</style></head>
                <body>${processedHtml}
                <script>
                    try {
                        ${jsCode}
                    } catch (error) {
                        console.error("JavaScript Error:", error);
                        const errorDiv = document.createElement('div');
                        errorDiv.style.color = 'red'; errorDiv.style.backgroundColor = '#fee';
                        errorDiv.style.border = '1px solid red'; errorDiv.style.padding = '10px';
                        errorDiv.style.marginTop = '10px'; errorDiv.textContent = 'JS Error: ' + error;
                        document.body.appendChild(errorDiv);
                    }
                <\/script></body></html>`;
            outputScreen.attr('srcdoc', combinedCode);
        });
    } else {
        console.error("Run button (#runBtn) not found.");
    }


    // --- Reset Code ---
    if (resetBtn.length) {
        resetBtn.on('click', function () {
            if (confirm('This will remove all current files, clear the output, and load the default HTML, CSS, and JS files. Are you sure?')) {
                outputScreen.attr('srcdoc', '');
                editorTabs.find('.tab-button').each(function() {
                    const targetId = $(this).data('target');
                    const paneToClose = editorPanes.find(`#${targetId}`);
                    const textareaId = paneToClose.find('textarea').attr('id');
                    const isImage = $(this).data('is-image') === true;
                    const fileName = $(this).data('filename');
                    if (textareaId && editors[textareaId]) delete editors[textareaId];
                    if (isImage && imageFiles[fileName]) delete imageFiles[fileName];
                    $(this).remove();
                    paneToClose.remove();
                });
                editors = {};
                Object.keys(imageFiles).forEach(key => delete imageFiles[key]);
                loadDefaultFiles();
                const htmlTab = editorTabs.find('.tab-button[data-filename="index.html"]');
                 if (htmlTab.length) {
                     switchTab(htmlTab.data('target'));
                 } else {
                     editorPlaceholder.show();
                     hideEditButton();
                 }
                console.log("Editor reset to default state.");
            }
        });
    } else {
        console.error("Reset button (#navResetBtn) not found.");
    }


    // --- Download Project ---
    if (downloadBtn.length) {
        downloadBtn.on('click', function () {
            if (typeof JSZip === 'undefined') {
                alert("Error: JSZip library not loaded. Cannot download project.");
                console.error("JSZip not found.");
                return;
            }
            const zip = new JSZip();
            let fileCount = 0;
            editorTabs.find('.tab-button').each(function() {
                const tab = $(this);
                const fileName = tab.data('filename');
                const targetId = tab.data('target');
                const isImage = tab.data('is-image') === true;
                if (!fileName) {
                    console.warn("Skipping tab without filename:", targetId); return;
                }
                fileCount++;
                if (isImage) {
                    if (imageFiles[fileName]) zip.file(fileName, imageFiles[fileName].blob);
                    else console.warn(`Image data for ${fileName} not found. Skipping image.`);
                } else {
                    const pane = editorPanes.find(`#${targetId}`);
                    const textareaId = pane.find('textarea').attr('id');
                    const editor = editors[textareaId];
                    if (editor) zip.file(fileName, editor.getValue());
                    else console.warn(`Editor instance for ${fileName} not found. Skipping file.`);
                }
            });
            if (fileCount === 0) {
                alert("No files to download."); return;
            }
            zip.generateAsync({ type: "blob" })
                .then(content => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = "web-project.zip";
                    document.body.appendChild(link); link.click();
                    document.body.removeChild(link); URL.revokeObjectURL(link.href);
                })
                .catch(error => {
                    console.error("Error generating zip file:", error);
                    alert("Failed to create project zip file.");
                });
        });
    } else {
        console.error("Download button (#navDownloadBtn) not found.");
    }


    // --- View Toggle ---
    if (viewToggleButton.length) {
        viewToggleButton.on('click', function() {
            editorLayoutContainer.toggleClass('side-by-side-view stacked-view');
            const isSideBySide = editorLayoutContainer.hasClass('side-by-side-view');
            localStorage.setItem('editorView', isSideBySide ? 'side-by-side' : 'stacked');
            setTimeout(() => {
                const activeEditor = getActiveEditor();
                if (activeEditor) activeEditor.refresh();
                else Object.values(editors).forEach(editor => editor?.refresh());
            }, 100);
        });
        const savedView = localStorage.getItem('editorView');
        editorLayoutContainer.removeClass('side-by-side-view stacked-view')
                             .addClass(savedView === 'stacked' ? 'stacked-view' : 'side-by-side-view');
    } else {
        console.error("View toggle button (#viewToggleButton) not found.");
    }


    // --- Special Characters ---
    window.insertCharacter = function(char) {
        const activeEditor = getActiveEditor();
        if (activeEditor) {
            activeEditor.replaceSelection(char);
            activeEditor.focus();
        } else {
            console.warn("No active CodeMirror editor found to insert character.");
        }
    };
    if (toggleSpecialCharsBtn.length) {
        toggleSpecialCharsBtn.on('click', () => specialCharContainer.toggleClass('visible'));
    } else {
        console.error("Toggle special chars button (#toggleSpecialCharsBtn) not found.");
    }
    const specialCharButtonsContainer = $('#special-char-buttons');
    if (specialCharButtonsContainer.length) {
        specialCharButtonsContainer.on('click', 'button[data-char]', function() {
            const charToInsert = $(this).data('char');
            const activeEditor = getActiveEditor();
            if (activeEditor) {
                activeEditor.replaceSelection(charToInsert);
                activeEditor.focus();
            } else {
                console.warn("No active CodeMirror editor found to insert character via data-char button.");
            }
        });
    }


    // --- Insert Default Code Snippets ---
    function loadDefaultFiles() {
        if (!editorTabs.find('.tab-button[data-filename="index.html"]').length) {
            addFileToEditor('index.html', defaultContent.html, 'xml');
        } else { console.log("index.html already exists."); }
        if (!editorTabs.find('.tab-button[data-filename="style.css"]').length) {
            addFileToEditor('style.css', defaultContent.css, 'css');
        } else { console.log("style.css already exists."); }
        if (!editorTabs.find('.tab-button[data-filename="script.js"]').length) {
            addFileToEditor('script.js', defaultContent.js, 'javascript');
        } else { console.log("script.js already exists."); }

        const htmlTab = editorTabs.find('.tab-button[data-filename="index.html"]');
        if (htmlTab.length) {
            const htmlTargetId = htmlTab.data('target');
            switchTab(htmlTargetId);
            const htmlTextareaId = editorPanes.find(`#${htmlTargetId} textarea`).attr('id');
            editors[htmlTextareaId]?.focus();
        } else if (editorTabs.find('.tab-button').length > 0) {
            switchTab(editorTabs.find('.tab-button').first().data('target'));
        } else {
            editorPlaceholder.show();
            hideEditButton();
        }
        console.log("Attempted to load default files.");
    }
    if (insertDefaultCodeBtn.length) {
        insertDefaultCodeBtn.on('click', loadDefaultFiles);
    } else {
        console.error("Insert default code button (#insertDefaultCodeBtn) not found.");
    }


    // --- Undo/Redo ---
    if (undoBtn.length) undoBtn.on('click', () => getActiveEditor()?.undo());
    if (redoBtn.length) redoBtn.on('click', () => getActiveEditor()?.redo());

    // --- Learn Panel ---
    if (learnSelect.length && $.fn.select2) {
        learnSelect.select2({
            placeholder: "Search and Learn...",
            ajax: {
                url: 'https://staticapis.pragament.com/online_courses/freecodecamp-html.json',
                dataType: 'json',
                delay: 250,
                processResults: function (data, params) {
                    let searchTerm = params.term ? params.term.toLowerCase() : '';
                    let results = [];
                    if (data && data.chapters && Array.isArray(data.chapters)) {
                        data.chapters.forEach(chapter => {
                            if (chapter && chapter.name) {
                                let chapterMatches = chapter.name.toLowerCase().includes(searchTerm);
                                let topicChildren = [];
                                if (chapter.topics && Array.isArray(chapter.topics)) {
                                    chapter.topics.forEach(topic => {
                                        if (topic && topic.title && topic.title.toLowerCase().includes(searchTerm)) {
                                            topicChildren.push({
                                                id: `${chapter.dashedName}|${topic.id}`,
                                                text: topic.title,
                                                dashedName: chapter.dashedName,
                                                topicId: topic.id
                                            });
                                        }
                                    });
                                }
                                if (chapterMatches || topicChildren.length > 0) {
                                    results.push({
                                        text: chapter.name,
                                        children: topicChildren
                                    });
                                }
                            }
                        });
                    }
                    return { results: results };
                },
                cache: true
            },
            minimumInputLength: 0,
            templateResult: function (data) {
                if (!data.id) return $('<span><b>' + data.text + '</b></span>');
                return data.text;
            },
            escapeMarkup: function (markup) { return markup; }
        });

        learnSelect.on('select2:select', function (e) {
            var selectedData = e.params.data;
            const [dashedName, id] = selectedData.id ? selectedData.id.split('|') : [null, null];
            if (!dashedName || !id) {
                console.error('Error: dashedName or id not found in selected data.', selectedData);
                if (learnMessageBox.length) learnMessageBox.text('Error: Could not identify selected topic.');
                return;
            }
            let markdownUrl = `https://raw.githubusercontent.com/freeCodeCamp/freeCodeCamp/refs/heads/main/curriculum/challenges/english/25-front-end-development/${dashedName}/${id}.md`;
            if (learnMessageBox.length) learnMessageBox.html('<div class="message-box loading"><div class="spinner"></div> Loading content...</div>');
            fetch(markdownUrl)
                .then(response => {
                    if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);
                    return response.text();
                })
                .then(markdownText => loadAndDisplayTranscript(markdownText))
                .catch(error => {
                    console.error('Fetch Error:', error);
                    if (learnMessageBox.length) learnMessageBox.html(`<div class="message-box error">Error loading content: ${error.message}</div>`);
                });
        });
    } else {
        if (!learnSelect.length) console.error("Learn panel select element (#mySelect) not found.");
        if (!$.fn.select2) console.error("Select2 library not loaded.");
    }

    function extractTranscript(markdown) {
        const transcriptMarker = '# --transcript--';
        const lines = markdown.split('\n');
        let transcriptMarkdown = '';
        let capture = false;
        for (const line of lines) {
            if (line.trim() === transcriptMarker) {
                capture = true; continue;
            }
            if (capture && line.trim().startsWith('# --')) break;
            if (capture) transcriptMarkdown += line + '\n';
        }
        return transcriptMarkdown.trim() || null;
    }

    function loadAndDisplayTranscript(markdownText) {
        const transcript = extractTranscript(markdownText);
        if (transcript && typeof marked !== 'undefined') {
            marked.setOptions({
                highlight: (code, lang) => {
                    if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
                        try { return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value; }
                        catch (__) { /* ignore */ }
                    }
                    return typeof hljs !== 'undefined' ? hljs.highlightAuto(code).value : code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                },
                gfm: true, breaks: false, pedantic: false, smartLists: true, smartypants: false
            });
            const transcriptHtml = marked.parse(transcript);
            if (learnMessageBox.length) learnMessageBox.html(transcriptHtml);
            learnMessageBox.find('pre code').each((i, block) => {
                if (typeof hljs !== 'undefined') {
                    try { hljs.highlightElement(block); }
                    catch (error) { console.error("Error applying highlight.js:", error, block); }
                }
                const preElement = block.parentNode;
                if ($(preElement).find('.copy-code-button').length === 0) {
                    const copyButton = $(`<button class="copy-code-button" title="Copy code to active editor">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                                              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                                              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                                            </svg> Copy
                                        </button>`);
                    $(preElement).css('position', 'relative').prepend(copyButton);
                    copyButton.on('click', () => {
                        copyCodeToEditor(block.textContent);
                        copyButton.html(`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022z"/></svg> Copied!`);
                        setTimeout(() => copyButton.html(`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg> Copy`), 1500);
                    });
                }
            });
        } else if (transcript) {
             console.error("Marked library is not loaded. Cannot parse Markdown.");
             if (learnMessageBox.length) learnMessageBox.html(`<pre>${transcript.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`);
        } else {
            if (learnMessageBox.length) learnMessageBox.html('<p><em>Transcript section not found or empty.</em></p>');
        }
    }

    function copyCodeToEditor(code) {
        const activeEditor = getActiveEditor();
        if (activeEditor) {
            activeEditor.replaceSelection(code);
            activeEditor.focus();
        } else {
            console.warn("No active editor found to copy code into.");
            alert("Please open or select a file in the editor first.");
        }
    }

    if (navLearnBtn.length) {
        navLearnBtn.on('click', () => {
            learnPanel.addClass('visible');
            if (!learnSelect.val() && learnMessageBox.length) {
                learnMessageBox.html(defaultLearnMessage);
            }
        });
    }
    if (closeLearnPanelBtn.length) {
        closeLearnPanelBtn.on('click', () => learnPanel.removeClass('visible'));
    }

    // --- Vertical Nav Menu (Right Side) ---
    if (menuToggleBtn.length) {
        menuToggleBtn.on('click', function(e) {
            e.stopPropagation();
            verticalNav.toggleClass('show');
            $(this).attr('aria-expanded', verticalNav.hasClass('show'));
        });
        $(document).on('click', function(e) {
            if (!verticalNav.is(e.target) && verticalNav.has(e.target).length === 0 &&
                !menuToggleBtn.is(e.target) && menuToggleBtn.has(e.target).length === 0) {
                if (verticalNav.hasClass('show')) {
                    verticalNav.removeClass('show');
                    menuToggleBtn.attr('aria-expanded', 'false');
                }
            }
        });
        verticalNav.find('button').on('click', () => {
            if (verticalNav.hasClass('show')) {
                verticalNav.removeClass('show');
                menuToggleBtn.attr('aria-expanded', 'false');
            }
        });
    } else {
        console.error("Menu toggle button (#menuToggleBtn) not found.");
    }


    // --- Left Sidebar Toggle ---
    function toggleLeftSidebar(show) {
        const isOpen = typeof show === 'boolean' ? show : !leftSidebarNav.hasClass('open');
        if (isOpen && !fileSidebar.hasClass('collapsed')) toggleFileSidebar(false);
        if (isOpen && gitView.hasClass('open')) toggleGitSidebar(false);
        leftSidebarNav.toggleClass('open', isOpen).attr('aria-hidden', !isOpen);
        sidebarOverlay.toggleClass('active', isOpen);
        leftSidebarToggleBtn.toggleClass('active', isOpen).attr('aria-expanded', isOpen);
        if (isOpen) {
            activityBarFileToggleBtn.removeClass('active').attr('aria-expanded', 'false');
            gitSidebarToggleBtn.removeClass('active').attr('aria-expanded', 'false');
        }
    }
    if (leftSidebarToggleBtn.length) leftSidebarToggleBtn.on('click', () => toggleLeftSidebar());
    if (closeLeftSidebarBtn.length) closeLeftSidebarBtn.on('click', () => toggleLeftSidebar(false));
    if (sidebarOverlay.length) sidebarOverlay.on('click', () => {
        if (leftSidebarNav.hasClass('open')) toggleLeftSidebar(false);
        if (gitView.hasClass('open')) toggleGitSidebar(false);
    });

    // --- NEW: Git Sidebar Toggle ---
    function toggleGitSidebar(show) {
        const isOpen = typeof show === 'boolean' ? show : !gitView.hasClass('open');
        if (isOpen && !fileSidebar.hasClass('collapsed')) toggleFileSidebar(false);
        if (isOpen && leftSidebarNav.hasClass('open')) toggleLeftSidebar(false);
        gitView.toggleClass('open', isOpen).attr('aria-hidden', !isOpen);
        sidebarOverlay.toggleClass('active', isOpen);
        gitSidebarToggleBtn.toggleClass('active', isOpen).attr('aria-expanded', isOpen);
        if (isOpen) {
            activityBarFileToggleBtn.removeClass('active').attr('aria-expanded', 'false');
            leftSidebarToggleBtn.removeClass('active').attr('aria-expanded', 'false');
        }
    }
    if (gitSidebarToggleBtn.length) gitSidebarToggleBtn.on('click', () => toggleGitSidebar());
    if (closeGitSidebarBtn.length) closeGitSidebarBtn.on('click', () => toggleGitSidebar(false));


    // --- NEW: File Sidebar Toggle & Resize ---
    function refreshEditorsOnResize() {
        const activeEditor = getActiveEditor();
        if (activeEditor) activeEditor.refresh();
    }

    function toggleFileSidebar(show) {
        const isCollapsed = fileSidebar.hasClass('collapsed');
        const shouldBeOpen = typeof show === 'boolean' ? show : isCollapsed;
        if (shouldBeOpen && leftSidebarNav.hasClass('open')) toggleLeftSidebar(false);
        if (shouldBeOpen && gitView.hasClass('open')) toggleGitSidebar(false);
        fileSidebar.toggleClass('collapsed', !shouldBeOpen);
        activityBarFileToggleBtn.toggleClass('active', shouldBeOpen).attr('aria-expanded', shouldBeOpen);
        if (shouldBeOpen) {
            leftSidebarToggleBtn.removeClass('active').attr('aria-expanded', 'false');
            gitSidebarToggleBtn.removeClass('active').attr('aria-expanded', 'false');
        }
        setTimeout(refreshEditorsOnResize, 350);
    }
    if (activityBarFileToggleBtn.length) activityBarFileToggleBtn.on('click', () => toggleFileSidebar());

    let isResizing = false;
    let startX, startWidth;
    if (fileSidebarResizeHandle.length) {
        fileSidebarResizeHandle.on('mousedown', function(e) {
            isResizing = true;
            startX = e.clientX;
            startWidth = fileSidebar.width();
            $('body').addClass('resizing-ew');
            e.preventDefault();
            $(document).on('mousemove.resizing', handleMouseMove);
            $(document).on('mouseup.resizing', handleMouseUp);
        });
    } else {
        console.warn("File sidebar resize handle not found.");
    }

    function handleMouseMove(e) {
        if (!isResizing) return;
        const activityBarWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--activity-bar-width') || '50px');
        let newWidth = e.clientX - activityBarWidth;
        newWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(newWidth, MAX_SIDEBAR_WIDTH));
        document.documentElement.style.setProperty('--file-sidebar-width', `${newWidth}px`);
        refreshEditorsOnResize();
    }

    function handleMouseUp() {
        if (isResizing) {
            isResizing = false;
            $('body').removeClass('resizing-ew');
            $(document).off('mousemove.resizing mouseup.resizing');
            localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, document.documentElement.style.getPropertyValue('--file-sidebar-width') || `${DEFAULT_SIDEBAR_WIDTH}px`);
            refreshEditorsOnResize();
        }
    }

    // --- GitHub Authentication Functions ---
    async function signInWithGitHub() {
        if (!auth || !githubProvider) {
            console.error("Auth service not ready.");
            alert("Authentication service not ready. Please wait or refresh.");
            return;
        }
        console.log("Attempting GitHub Sign-In (Compat SDK)...");
        if (userReposList.length) userReposList.html('<li>Attempting sign-in...</li>');
        if (userReposContainer.length) userReposContainer.show();

        try {
            const result = await auth.signInWithPopup(githubProvider);
            const credential = result.credential;
            const githubAccessToken = credential?.accessToken;
            const user = result.user;
            console.log("Sign-in successful:", user?.displayName);
            currentGitHubToken = githubAccessToken;
            if (githubAccessToken) {
                console.log("GitHub OAuth Access Token obtained.");
                await fetchGitHubRepositories(githubAccessToken);
            } else {
                console.error("CRITICAL: GitHub OAuth Access Token was NOT found in credential after successful sign-in.");
                if (userReposList.length) userReposList.html('<li>Sign-in successful, but could not retrieve GitHub token. Cannot load repositories.</li>');
                currentGitHubToken = null;
            }
            toggleLeftSidebar(true);
        } catch (error) {
            console.error("signInWithPopup Error:", error);
            let alertMessage = `GitHub Sign-In Error: ${error.message}`;
            if (error.code === 'auth/account-exists-with-different-credential') {
                alertMessage = `An account already exists with the email address ${error.customData?.email || 'provided'}. Please sign in using the provider associated with that email address.`;
            } else if (error.code === 'auth/popup-closed-by-user') {
                alertMessage = 'Sign-in process cancelled by user.';
            } else if (error.code === 'auth/cancelled-popup-request') {
                alertMessage = 'Sign-in cancelled. Only one sign-in window can be open at a time.';
            }
            alert(alertMessage);
            if (userReposList.length) userReposList.html(`<li>Sign-in failed: ${error.message || error.code}</li>`);
            currentGitHubToken = null;
            updateUIForAuthState(null);
        }
    }

    async function signOutUser() {
         if (!auth) {
            console.error("Auth service not ready for sign out."); return;
         }
        console.log("Attempting Sign Out (Compat SDK)...");
        try {
            await auth.signOut();
            console.log("Sign-out successful.");
            currentGitHubToken = null;
            toggleLeftSidebar(false);
            toggleGitSidebar(false);
        } catch (error) {
            console.error("Sign Out Error:", error);
            alert(`Sign Out Error: ${error.message}`);
        }
    }

    async function fetchGitHubRepositories(token) {
        if (!userReposList.length) {
            console.warn("Repository list element (#userReposList) not found in DOM."); return;
        }
        if (!token) {
            console.error("fetchGitHubRepositories called without an access token.");
            userReposList.html('<li>Error: Missing GitHub access token.</li>');
            if (userReposContainer.length) userReposContainer.show(); return;
        }
        userReposList.html('<li>Loading repositories...</li>');
        if (userReposContainer.length) userReposContainer.show();
        try {
            const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=15', {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' }
            });
            if (!response.ok) {
                let errorDetail = `${response.status} ${response.statusText}`;
                try { const errorData = await response.json(); errorDetail = errorData.message || errorDetail; } catch (e) {}
                throw new Error(`GitHub API request failed: ${errorDetail}`);
            }
            const repos = await response.json();
            displayRepos(repos);
            return repos;
        } catch (error) {
            console.error("Error fetching GitHub repositories:", error);
            userReposList.html(`<li>Error loading repositories: ${error.message}</li>`);
            if (userReposContainer.length) userReposContainer.show();
            return null;
        }
    }

    function displayRepos(repos) {
        if (!userReposList.length) return;
        userReposList.empty();
        if (repos?.length > 0) {
            const importIconSvg = `<svg class="import-repo-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" title="Import files from this repository">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>`;
            repos.forEach(repo => {
                const repoContentsUrl = repo.contents_url.replace('{+path}', '');
                const listItem = $('<li></li>').attr('data-repo-url', repoContentsUrl).attr('data-repo-name', repo.name);
                const link = $('<a></a>').attr('href', repo.html_url).text(repo.name).attr('target', '_blank').attr('rel', 'noopener noreferrer');
                listItem.append(link).append(importIconSvg);
                userReposList.append(listItem);
            });
        } else {
            userReposList.html('<li>No public repositories found or accessible.</li>');
        }
        if (userReposContainer.length) userReposContainer.show();
    }

    function updateUIForAuthState(user) {
        if (user) {
            if (userProfileContainer.length) userProfileContainer.show();
            if (navLogoutBtn.length) navLogoutBtn.show();
            if (userReposContainer.length) userReposContainer.show();
            if (sidebarGithubLoginBtn.length) sidebarGithubLoginBtn.hide(); // Hide new button in sidebar

            if (gitActionsContainer.length) {
                gitActionsContainer.show();
                const repoName = currentRepoNameSpan.length ? currentRepoNameSpan.text().trim() : '';
                if (repoName && repoName !== '...') {
                    if ($('#gitCloneSection').length) $('#gitCloneSection').hide();
                    if ($('#currentRepoActions').length) $('#currentRepoActions').show();
                } else {
                    if ($('#gitCloneSection').length) $('#gitCloneSection').show();
                    if ($('#currentRepoActions').length) $('#currentRepoActions').hide();
                }
            }
            if (userProfileImage.length) userProfileImage.attr('src', user.photoURL || 'placeholder.png');
            if (userProfileName.length) userProfileName.text(user.displayName || 'GitHub User');
            if (userProfileEmail.length) userProfileEmail.text(user.email || 'No Email Provided');
            if (userReposList.length && userReposList.html().includes('Please sign in')) {
                 userReposList.html('<li>Attempting to load repositories...</li>');
            }
        } else {
            if (userProfileContainer.length) userProfileContainer.hide();
            if (navLogoutBtn.length) navLogoutBtn.hide();
            if (userReposContainer.length) userReposContainer.hide();
            if (sidebarGithubLoginBtn.length) sidebarGithubLoginBtn.show(); // Show new button in sidebar
            if (gitActionsContainer.length) gitActionsContainer.hide();
            if ($('#gitCloneSection').length) $('#gitCloneSection').hide();
            if ($('#currentRepoActions').length) $('#currentRepoActions').hide();
            if (userProfileImage.length) userProfileImage.attr('src', 'placeholder.png');
            if (userProfileName.length) userProfileName.text('');
            if (userProfileEmail.length) userProfileEmail.text('');
            if (userReposList.length) userReposList.html('<li>Please sign in to load repositories.</li>');
            currentGitHubToken = null;
            if (currentRepoNameSpan.length) currentRepoNameSpan.text('...');
            // Reset currentRepoDetails when user logs out
            currentRepoDetails = { owner: null, repo: null, branch: null, name: null, files: {} };
        }
    }

    // --- GitHub Repository Import Logic ---
    async function importRepoFiles(repoContentsUrl, repoName) {
        if (!currentGitHubToken) {
            alert("GitHub token not available. Please log in again."); return;
        }
        if (!repoContentsUrl) {
            alert("Repository URL is missing. Cannot import."); return;
        }
        console.log(`Starting import from: ${repoContentsUrl}`);
        if (userReposList.length) userReposList.html(`<li>Importing files from ${repoName}...</li>`);
        toggleFileSidebar(true);

        // Reset currentRepoDetails before importing a new one
        currentRepoDetails = { owner: null, repo: null, branch: null, name: repoName, files: {} };
        // Attempt to parse owner and repo from a typical GitHub contents URL
        // Example: https://api.github.com/repos/OWNER/REPO/contents/
        const urlParts = repoContentsUrl.match(/api\.github\.com\/repos\/([^\/]+)\/([^\/]+)\/contents/);
        if (urlParts && urlParts.length >= 3) {
            currentRepoDetails.owner = urlParts[1];
            currentRepoDetails.repo = urlParts[2];
            // You might need to fetch default branch separately if not known
            // For now, we'll assume 'main' or rely on commit function to use default
            console.log(`Parsed owner: ${currentRepoDetails.owner}, repo: ${currentRepoDetails.repo}`);
        } else {
            console.warn("Could not parse owner/repo from contents URL. Commit functionality might be limited.");
        }
         // Update the Git sidebar UI
        if (currentRepoNameSpan.length) currentRepoNameSpan.text(repoName);
        if ($('#gitCloneSection').length) $('#gitCloneSection').hide();
        if ($('#currentRepoActions').length) $('#currentRepoActions').show();


        try {
            const response = await fetch(repoContentsUrl, {
                headers: { 'Authorization': `Bearer ${currentGitHubToken}`, 'Accept': 'application/vnd.github.v3+json' }
            });
            if (!response.ok) {
                let errorDetail = `${response.status} ${response.statusText}`;
                try { const errorData = await response.json(); errorDetail = errorData.message || errorDetail; } catch (e) {}
                throw new Error(`Failed to fetch repository contents: ${errorDetail}`);
            }
            const contents = await response.json();
            let filesAddedCount = 0;
            let filesSkippedCount = 0;
            const fetchPromises = [];

            for (const item of contents) {
                if (item.type === 'file') {
                    const extension = item.name.split('.').pop().toLowerCase();
                    const allowedExtensions = ['html', 'css', 'js', 'json', 'md', 'markdown', 'txt', 'xml'];
                    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'bmp'];

                    if (allowedExtensions.includes(extension)) {
                        fetchPromises.push(
                            fetch(item.url, {
                                headers: { 'Authorization': `Bearer ${currentGitHubToken}`, 'Accept': 'application/vnd.github.v3.raw'}
                            })
                            .then(fileResponse => {
                                if (!fileResponse.ok) throw new Error(`Failed to fetch file ${item.name}`);
                                return fileResponse.text().then(fileContent => ({name: item.name, content: fileContent, sha: item.sha, path: item.path })); // Pass SHA and path
                            })
                            .then(fileData => {
                                let mode = 'plaintext';
                                const fileExt = fileData.name.split('.').pop().toLowerCase();
                                switch (fileExt) {
                                    case 'html': mode = 'xml'; break;
                                    case 'css': mode = 'css'; break;
                                    case 'js': case 'json': mode = 'javascript'; break;
                                    case 'md': case 'markdown': mode = 'markdown'; break;
                                    case 'xml': mode = 'xml'; break;
                                }
                                if (addFileToEditor(fileData.name, fileData.content, mode, repoName)) {
                                    filesAddedCount++;
                                    // Store file details for commit
                                    currentRepoDetails.files[fileData.path] = { // Use item.path as key
                                        sha: fileData.sha,
                                        originalContent: fileData.content
                                    };
                                } else {
                                    filesSkippedCount++;
                                }
                            })
                            .catch(fileError => {
                                console.error(`Error processing file ${item.name}:`, fileError);
                                filesSkippedCount++;
                            })
                        );
                    } else if (imageExtensions.includes(extension)) {
                        console.log(`Skipping image file: ${item.name}`); filesSkippedCount++;
                    } else {
                        console.log(`Skipping unsupported file type: ${item.name}`); filesSkippedCount++;
                    }
                } else if (item.type === 'dir') {
                    console.log(`Skipping directory: ${item.name}`);
                }
            }
            await Promise.all(fetchPromises);
            alert(`Import complete for ${repoName}.\nFiles added: ${filesAddedCount}\nFiles skipped/existing: ${filesSkippedCount}`);
            await fetchGitHubRepositories(currentGitHubToken); // Refresh repo list
            const firstImportedTab = editorTabs.find(`.tab-button[data-repo-source="${repoName}"]`).first();
            if (firstImportedTab.length) switchTab(firstImportedTab.data('target'));
            else if (editorTabs.find('.tab-button').length === 0) editorPlaceholder.show();
        } catch (error) {
            console.error("Error importing repository files:", error);
            alert(`Error importing repository: ${error.message}`);
            await fetchGitHubRepositories(currentGitHubToken);
            if (editorTabs.find('.tab-button').length === 0) editorPlaceholder.show();
        }
    }

    if (userReposList.length) {
        userReposList.on('click', '.import-repo-icon', function(e) {
            e.stopPropagation();
            const listItem = $(this).closest('li');
            const repoUrl = listItem.data('repo-url');
            const repoName = listItem.data('repo-name');
            if (repoUrl && repoName) {
                if (confirm(`Import files from "${repoName}"? This will add files to your current editor session. Existing files with the same name will be skipped.`)) {
                    importRepoFiles(repoUrl, repoName);
                }
            } else {
                alert("Error: Could not initiate import. Repository data missing.");
            }
        });
    }

    // --- Git Commit and Push Logic ---
    async function handleGitCommit() {
        if (!currentGitHubToken) {
            alert("Not authenticated with GitHub."); return;
        }
        if (!currentRepoDetails.owner || !currentRepoDetails.repo) {
            alert("No active repository selected/cloned."); return;
        }
        const commitMessage = gitCommitMsgInput.val().trim();
        if (!commitMessage) {
            alert("Please enter a commit message."); gitCommitMsgInput.focus(); return;
        }

        gitCommitBtn.prop('disabled', true).text('Committing...');
        if (gitStatusOutput.length) gitStatusOutput.html('Committing changes...');
        let changesCommitted = 0;
        let errorsEncountered = 0;

        const openFileTabs = editorTabs.find('.tab-button:not([data-is-image="true"])');
        for (let i = 0; i < openFileTabs.length; i++) {
            const tab = $(openFileTabs[i]);
            const filePath = tab.data('filename'); // Assuming filename is the path in repo
            const repoSource = tab.data('repo-source');

            if (repoSource !== currentRepoDetails.name) { // Match against stored repo name
                console.log(`Skipping ${filePath}, not part of the active repo ${currentRepoDetails.name}`);
                continue;
            }

            const targetId = tab.data('target');
            const textareaId = editorPanes.find(`#${targetId} textarea`).attr('id');
            const editor = editors[textareaId];

            if (editor) {
                const currentContent = editor.getValue();
                const fileDetails = currentRepoDetails.files[filePath]; // Use filePath as key

                if (fileDetails && currentContent !== fileDetails.originalContent) { // Check for actual modification
                    try {
                        const contentEncoded = btoa(unescape(encodeURIComponent(currentContent)));
                        const apiUrl = `https://api.github.com/repos/${currentRepoDetails.owner}/${currentRepoDetails.repo}/contents/${filePath}`;
                        const response = await fetch(apiUrl, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${currentGitHubToken}`,
                                'Accept': 'application/vnd.github.v3+json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                message: commitMessage,
                                content: contentEncoded,
                                sha: fileDetails.sha,
                                branch: currentRepoDetails.branch || 'main'
                            })
                        });
                        const responseData = await response.json();
                        if (response.ok) {
                            console.log(`Successfully committed ${filePath}`, responseData);
                            currentRepoDetails.files[filePath].sha = responseData.content.sha;
                            currentRepoDetails.files[filePath].originalContent = currentContent;
                            changesCommitted++;
                            if (gitStatusOutput.length) gitStatusOutput.append(`<br>Committed: ${filePath}`);
                        } else {
                            console.error(`Failed to commit ${filePath}:`, responseData.message || response.statusText);
                            errorsEncountered++;
                            if (gitStatusOutput.length) gitStatusOutput.append(`<br><span class="error">Error committing ${filePath}: ${responseData.message || response.statusText}</span>`);
                        }
                    } catch (error) {
                        console.error(`Error during commit for ${filePath}:`, error);
                        errorsEncountered++;
                        if (gitStatusOutput.length) gitStatusOutput.append(`<br><span class="error">Exception committing ${filePath}: ${error.message}</span>`);
                    }
                } else if (!fileDetails) {
                     console.log(`Skipping ${filePath}, no SHA found (new file or not from repo). Consider implementing new file commit.`);
                } else {
                    console.log(`Skipping ${filePath}, content unchanged.`);
                }
            }
        }
        gitCommitBtn.prop('disabled', false).text('Commit');
        let finalMessage = `Commit attempt finished. Files committed: ${changesCommitted}. Errors: ${errorsEncountered}.`;
        if (changesCommitted === 0 && errorsEncountered === 0 && openFileTabs.length > 0) {
            finalMessage = "No changes to commit in open files belonging to the repository.";
        }
        if (gitStatusOutput.length) gitStatusOutput.append(`<br><b>${finalMessage}</b>`);
        alert(finalMessage);
        gitCommitMsgInput.val('');
    }

    async function handleGitPush() {
        if (!currentGitHubToken) {
            alert("Not authenticated with GitHub."); return;
        }
        if (!currentRepoDetails.owner || !currentRepoDetails.repo) {
            alert("No active repository selected/cloned."); return;
        }
        // Since "Commit" already pushes changes for each file,
        // this "Push" button is more of a confirmation or a placeholder for future, more complex Git operations.
        let message = "All committed changes have already been pushed to GitHub.";
        if (gitStatusOutput.length) {
            gitStatusOutput.html(message + "<br>Use 'Commit' to save and push new changes.");
        }
        alert(message);
        // Optionally, you could re-fetch repo status or perform a no-op check here
        // to make it feel like it's doing something, but it's not strictly necessary
        // for pushing content in the current model.
    }

    if (gitCommitBtn.length) gitCommitBtn.on('click', handleGitCommit);
    if (gitPushBtn.length) gitPushBtn.on('click', handleGitPush);


    // --- Attach Authentication Event Listeners ---
    if (sidebarGithubLoginBtn.length) sidebarGithubLoginBtn.on('click', signInWithGitHub);
    if (navLogoutBtn.length) navLogoutBtn.on('click', signOutUser);


    // --- Initialize Firebase ---
    initializeFirebase();

    // --- Initialize File Sidebar Width ---
    const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
    const initialWidth = savedWidth ? parseInt(savedWidth, 10) : DEFAULT_SIDEBAR_WIDTH;
    const clampedInitialWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(initialWidth, MAX_SIDEBAR_WIDTH));
    document.documentElement.style.setProperty('--file-sidebar-width', `${clampedInitialWidth}px`);
    refreshEditorsOnResize();

    // --- Make Learn Panel Draggable (Requires jQuery UI) ---
    if ($.fn.draggable && learnPanel.length) {
        learnPanel.draggable({ handle: ".learn-panel-header", containment: "window" });
        console.log("Learn Panel is now draggable.");
    } else {
        if (!$.fn.draggable) console.warn("jQuery UI Draggable not found. Learn Panel will not be movable.");
        if (!learnPanel.length) console.warn("Learn Panel element not found.");
    }

    // --- Clear Output Initially ---
    if (outputScreen.length) outputScreen.attr('srcdoc', '');

    // --- Show Placeholder Initially ---
    if (editorTabs.length && editorTabs.find('.tab-button').length === 0) {
        editorPlaceholder.show();
        hideEditButton();
    }

    console.log("DOM ready, initial setup complete.");

    // --- Helper for debugging overlays ---
    function logElementAtCursor(e) {
        const element = document.elementFromPoint(e.clientX, e.clientY);
        console.log("Element at cursor:", element, "ID:", element?.id, "Class:", element?.className);
    }

    // Temporarily add this event listener to the document for debugging
    // Comment it out or remove it after debugging
    // $(document).on('mousemove', logElementAtCursor);
    // Or, more specifically to the editor area:
    // editorPanes.on('mousemove', function(e) {
    //     const element = document.elementFromPoint(e.clientX, e.clientY);
    //     console.log("Element at cursor (editor area):", element, "ID:", element?.id, "Class:", element?.className);
    // });
}); // End $(document).ready
