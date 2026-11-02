const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../../html-ide');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'fib-questions.json'), 'utf8'));
const script = fs.readFileSync(path.join(root, 'playground-features.js'), 'utf8');
test('every class has six questions per web language, including beginner questions', () => {
    assert.equal(catalog.length, 72);
    assert.equal(new Set(catalog.map(q => q.id)).size, catalog.length);
    assert.equal(new Set(catalog.map(q => q.title)).size, catalog.length);
    for (const grade of [6, 7, 8, 9]) for (const category of ['HTML', 'CSS', 'JavaScript']) {
        const matches = catalog.filter(q => q.classLevels.includes(grade) && q.category === category);
        assert.equal(matches.length, 6);
        assert(matches.some(q => q.difficulty === 1));
    }
});
test('every blank has one matching placeholder and complete teaching content', () => {
    for (const q of catalog) {
        assert(q.subject && q.description && q.explanation && q.codeSnippet);
        assert(Array.isArray(q.prerequisites));
        assert([1, 2, 3].includes(q.difficulty));
        const placeholders = [...q.template.matchAll(/\[(blank\d+)\]/g)].map(m => m[1]);
        assert.deepEqual(placeholders.sort(), q.blanks.map(b => b.id).sort());
        assert.equal(new Set(placeholders).size, placeholders.length);
        for (const blank of q.blanks) assert(blank.answer.trim());
        if (q.category === 'JavaScript') assert.doesNotThrow(() => new Function(q.codeSnippet));
    }
});
test('quiz questions load from the separate JSON source', () => {
    assert(!script.includes('const DEFAULT_QUIZ_QUESTIONS'));
    assert(script.includes("new URL('fib-questions.json'"));
    assert(!fs.readFileSync(path.join(root, 'index.html'), 'utf8').includes('Edit JSON'));
});
