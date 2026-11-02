// Offline layout regression: CodeMirror is stubbed; app.js preview updates run normally.
// Run from the repository root with Playwright installed or PLAYWRIGHT_MODULE configured.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE ? {executablePath:process.env.PLAYWRIGHT_EXECUTABLE} : {})});
 try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.CodeMirror={commands:{},fromTextArea(textarea){
   const wrapper=document.createElement('div');wrapper.className='CodeMirror';textarea.after(wrapper);
   let value=textarea.value;const callbacks={};
   return {state:{},getValue:()=>value,setValue(v){value=v;if (!wrapper.classList.contains('hidden')) wrapper.textContent=v;(callbacks.change||[]).forEach(f=>f());},
    refresh(){wrapper.textContent=value;wrapper.dataset.refreshed="true";},on(event,fn){(callbacks[event]||=[]).push(fn);},getWrapperElement:()=>wrapper,historySize:()=>({undo:0,redo:0}),getCursor:()=>({line:0,ch:0})};
  }};
 });
 await page.route('**/*',route=>{
  const url=new URL(route.request().url());
  if(url.hostname!=='html-ide.test') return route.fulfill({body:'',contentType:'text/javascript'});
  const name=url.pathname==='/'?'index.html':url.pathname.slice(1);
  let body=fs.readFileSync('html-ide/'+name);
  if(name==='index.html') body=body.toString().replace(/<script type="module">[\s\S]*?<\/script>/,'');
  route.fulfill({body,contentType:name.endsWith('.css')?'text/css':name.endsWith('.js')?'text/javascript':'text/html'});
 });
 await page.goto('http://html-ide.test/');
 await page.waitForSelector('#preview-container.phone-mode-active');
 await page.waitForTimeout(700);await page.evaluate(()=>PlaygroundFeatures.closeModal('pf-quiz-modal'));
 assert.equal(await page.locator('body').getAttribute('data-editor-mode'),'simple');
 for(const selector of ['[aria-label="GitHub"]','[aria-label="Recording"]','#github-section']) assert.equal(await page.locator(selector).isVisible(),false);
 assert(await page.locator('[aria-label="Share"]').isVisible());
 await page.evaluate(()=>htmlEditor.setValue('<h1>Keep my code</h1>'));
 await page.locator('#editor-mode-toggle').click();
 assert.equal(await page.locator('body').getAttribute('data-editor-mode'),'advanced');
 for(const selector of ['[aria-label="GitHub"]','[aria-label="Recording"]','#github-section']) assert(await page.locator(selector).isVisible());
 await page.locator('#repeat-btn').click();assert(await page.locator('#repeat-modal').isVisible());
 await page.evaluate(()=>PlaygroundFeatures.toggleEditorMode());
 assert.equal(await page.locator('#repeat-modal').isVisible(),false);
 assert.equal(await page.evaluate(()=>htmlEditor.getValue()),'<h1>Keep my code</h1>');
 assert.equal(await page.locator('[aria-label="GitHub"]').isVisible(),false);
 await page.locator('#editor-mode-toggle').click();
 assert.equal(await page.locator('#repeat-modal').isVisible(),false);
 await page.reload();
 assert.equal(await page.locator('body').getAttribute('data-editor-mode'),'simple');
 assert.deepEqual(errors,[]);
 console.log('PASS: Simple default, advanced GitHub/recording visibility, Share retained, dialogs closed and code preserved on switching, refresh defaults to Simple.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
