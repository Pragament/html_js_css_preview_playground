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
 const samples=JSON.parse(fs.readFileSync('html-ide/samples.json','utf8'));
 const choices=[samples.find(s=>s.id==='multiplication-details'),samples.find(s=>s.category==='CSS'&&s.css),samples.find(s=>s.category==='JavaScript'&&s.css),samples.find(s=>s.id==='multiplication-hover')];
 for(const sample of choices) {
  await page.evaluate(id=>PlaygroundFeatures.loadSample(id),sample.id);
  for(const [type,filename] of [['html','index.html'],['css','style.css'],['js','script.js']]) {
   await page.locator('#file-explorer').getByText(filename,{exact:true}).click();
   await page.waitForTimeout(40);
   assert.equal(await page.textContent('#current-file-name'),filename);
   assert.equal(await page.evaluate(type=>getActiveEditor()===window[type+'Editor'],type),true);
   assert.equal(await page.locator('.CodeMirror:not(.hidden)').textContent(),sample[type],sample.id+' '+type);
   assert.equal(await page.evaluate(type=>window[type+'Editor'].getValue(),type),sample[type]);
  }
 }
 // Edits stay with their file when navigating away and back.
 await page.evaluate(()=>cssEditor.setValue('body { color: red; }'));
 await page.locator('#file-explorer').getByText('style.css',{exact:true}).click();
 await page.locator('#file-explorer').getByText('index.html',{exact:true}).click();
 await page.locator('#file-explorer').getByText('style.css',{exact:true}).click();
 await page.waitForTimeout(40);
 assert.equal(await page.locator('.CodeMirror:not(.hidden)').textContent(),'body { color: red; }');
 assert.deepEqual(errors,[]);
 console.log('PASS: sample HTML/CSS/JS replaces all files, hidden editors refresh on Explorer clicks, active editor/filename match, edits survive switching.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
