"""Check HTML IDE nesting and browser-visible inline scripts without network access."""
import subprocess
import tempfile
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'html-ide'
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())


class StructureParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []
        self.ids = {}
        self.scripts = []
        self.script = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            identifier = attrs['id']
            if identifier in self.ids:
                self.errors.append(f'Duplicate id: {identifier}')
            self.ids[identifier] = tuple(self.stack)
        if tag == 'script':
            self.script = [attrs, '']
        if tag not in VOID:
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag == 'script' and self.script is not None:
            self.scripts.append(self.script)
            self.script = None
        if not self.stack or self.stack[-1] != tag:
            self.errors.append(f'Unexpected </{tag}> at {self.getpos()}: {self.stack}')
        else:
            self.stack.pop()

    def handle_data(self, data):
        if self.script is not None:
            self.script[1] += data


class HtmlStructureTest(unittest.TestCase):
    def test_pages_and_inline_scripts(self):
        for page in ROOT.glob('*.html'):
            with self.subTest(page=page.name):
                parser = StructureParser()
                parser.feed(page.read_text())
                self.assertEqual(parser.errors, [])
                self.assertEqual(parser.stack, [])
                if page.name == 'index.html':
                    # Editor and overlays must not inherit the toolbar layout.
                    for identifier in ['main-container', 'playbackControlModal', 'pf-quiz-modal']:
                        self.assertEqual(parser.ids[identifier], ('html', 'body'))
                for attrs, source in parser.scripts:
                    if 'src' in attrs:
                        continue
                    suffix = '.mjs' if attrs.get('type') == 'module' else '.js'
                    with tempfile.NamedTemporaryFile(mode='w', suffix=suffix) as script:
                        script.write(source)
                        script.flush()
                        result = subprocess.run(['node', '--check', script.name], capture_output=True, text=True)
                        self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == '__main__':
    unittest.main()
