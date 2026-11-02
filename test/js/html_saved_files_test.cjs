const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('html-ide/app.js', 'utf8').split("\nconst IDE_FILE_PREFIX")[1];
function setup(entries) {
    const storage = new Map(Object.entries(entries));
    const element = () => ({textContent: '', value: '', focus() {}, select() {}, removeAttribute() {}, setAttribute() {}, showModal() {this.open = true;}, close() {this.open = false;}, children: [], classList: {remove() {}}, replaceChildren() {this.children = [];}, appendChild(child) {this.children.push(child);}});
    const nodes = Object.fromEntries(['saved-files-list', 'saved-files-container', 'current-file-name', 'save-file-name', 'save-file-dialog', 'save-file-title', 'save-file-submit', 'save-file-error'].map(id => [id, element()]));
    const editor = () => ({value: '', focus() {}, getValue() {return this.value;}, setValue(value) {this.value = value;}});
    const htmlEditor = editor(), cssEditor = editor(), jsEditor = editor();
    const context = vm.createContext({
        localStorage: {get length() {return storage.size;}, key: i => [...storage.keys()][i], getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value)},
        document: {getElementById: id => nodes[id], createElement: element},
        htmlEditor, cssEditor, jsEditor, getActiveEditor: () => cssEditor,
        toggleFile(type) {context.selected = type;}, prompt: () => 'new-style', alert() {throw new Error('Unexpected alert');}
    });
    vm.runInContext('const IDE_FILE_PREFIX' + source, context);
    return {context, storage, nodes, cssEditor};
}
test('lists only code files, preserves old saves, and prefers scoped versions', () => {
    const {context, nodes} = setup({githubToken: 'secret', theme: 'dark', 'other-app-data': '{}', 'notes.txt': 'text', 'old.html': '<h1>Old</h1>', 'styles.css': 'old', 'html-ide:file:styles.css': 'new'});
    context.viewAutosavedFiles();
    assert.deepEqual(nodes['saved-files-list'].children.map(item => item.textContent), ['old.html', 'styles.css']);
    nodes['saved-files-list'].children[1].onclick();
    assert.equal(context.selected, 'css');
    assert.equal(context.cssEditor.value, 'new');
});
test('save modal requires an explicit extension and writes only valid names', () => {
    const {context, storage, cssEditor, nodes} = setup({githubToken: 'secret'});
    cssEditor.value = 'body {color: red}';
    context.saveFile();
    nodes['save-file-name'].value = 'new-style';
    context.submitSaveFile({preventDefault() {}});
    assert.match(nodes['save-file-error'].textContent, /including/);
    assert.equal(storage.size, 1);
    nodes['save-file-name'].value = 'new-style.css';
    context.submitSaveFile({preventDefault() {}});
    assert.equal(storage.get('html-ide:file:new-style.css'), cssEditor.value);
    assert.equal(storage.get('githubToken'), 'secret');
    assert.equal(nodes['save-file-dialog'].open, false);
});
test('empty storage displays an empty-state message', () => {
    const {context, nodes} = setup({theme: 'dark'});
    context.viewAutosavedFiles();
    assert.match(nodes['saved-files-list'].children[0].textContent, /No saved/);
});
