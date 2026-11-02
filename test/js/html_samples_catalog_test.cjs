const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const samples = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../html-ide/samples.json'), 'utf8'));
test('samples cover all classes and languages and preserve the two original quizzes', () => {
    assert.equal(samples.length, 74);
    assert.equal(new Set(samples.map(s => s.id)).size, samples.length);
    assert(samples.find(s => s.id === 'multiplication-details').html.includes('<details>'));
    assert(samples.find(s => s.id === 'multiplication-hover').html.includes('button:hover span'));
    for (const grade of [6, 7, 8, 9]) for (const language of ['HTML', 'CSS', 'JavaScript']) {
        assert(samples.filter(s => s.classLevels.includes(grade) && s.category === language).length >= 6);
    }
});
test('each sample has runnable source and complete learning metadata', () => {
    for (const sample of samples) {
        for (const key of ['id', 'title', 'badge', 'category', 'description', 'html', 'css', 'js']) assert.equal(typeof sample[key], 'string');
        assert(sample.html.trim());
        assert(sample.subject && sample.topics.length);
        assert([1, 2].includes(sample.difficulty));
        assert.doesNotThrow(() => new Function(sample.js), sample.id);
    }
});
