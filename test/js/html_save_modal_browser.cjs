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
   return {state:{},focus(){},getValue:()=>value,setValue(v){value=v;if (!wrapper.classList.contains('hidden')) wrapper.textContent=v;(callbacks.change||[]).forEach(f=>f());},
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
 await page.evaluate(()=>htmlEditor.setValue('<h1>Keep this file</h1>'));
 await page.getByTitle('Save the File',{exact:true}).click();
 assert(await page.locator('#save-file-dialog').isVisible());
 for(const name of ['', 'missing-extension', 'invalid.txt']) {
  await page.locator('#save-file-name').fill(name);
  await page.locator('#save-file-submit').click();
  assert(await page.locator('#save-file-dialog').isVisible());
  assert.match(await page.textContent('#save-file-error'),/including/);
 }
 await page.locator('#save-file-name').fill('lesson.html');
 await page.locator('#save-file-name').press('Enter');
 assert.equal(await page.locator('#save-file-dialog').isVisible(),false);
 assert.equal(await page.evaluate(()=>localStorage.getItem('html-ide:file:lesson.html')),'<h1>Keep this file</h1>');
 await page.getByTitle('Create New File',{exact:true}).click();
 await page.locator('#save-file-dialog').getByRole('button',{name:'Cancel',exact:true}).click();
 assert.equal(await page.evaluate(()=>htmlEditor.getValue()),'<h1>Keep this file</h1>');
 await page.getByTitle('Create New File',{exact:true}).click();
 await page.locator('#save-file-name').fill('copy.html');
 await page.locator('#save-file-submit').click();
 assert.equal(await page.evaluate(()=>htmlEditor.getValue()),'');
 assert.equal(await page.evaluate(()=>localStorage.getItem('html-ide:file:copy.html')),'<h1>Keep this file</h1>');
 await page.getByTitle('Save the File',{exact:true}).click();
 await page.locator('#save-file-name').press('Escape');
 assert.equal(await page.locator('#save-file-dialog').isVisible(),false);
 assert.deepEqual(errors,[]);
 console.log('PASS: custom save modal, mandatory extension, Enter saves, Cancel preserves code, New clears only after saving, Escape dismisses.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
