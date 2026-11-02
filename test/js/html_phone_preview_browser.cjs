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
   return {state:{},getValue:()=>value,setValue(v){value=v;wrapper.textContent=v;(callbacks.change||[]).forEach(f=>f());},
    on(event,fn){(callbacks[event]||=[]).push(fn);},getWrapperElement:()=>wrapper,historySize:()=>({undo:0,redo:0}),getCursor:()=>({line:0,ch:0})};
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
 await page.evaluate(()=>PlaygroundFeatures.closeModal('pf-quiz-modal'));
 const check=async(side)=>{
  await page.waitForTimeout(100);
  const bounds=await page.evaluate(()=>{
   const rect=id=>{const r=document.getElementById(id).getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
   const e=document.querySelector('.CodeMirror:not(.hidden)').getBoundingClientRect();
   return {preview:rect('preview-container'),phone:rect('pf-phone-shell'),editor:{x:e.x,y:e.y,right:e.right,bottom:e.bottom}};
  });
  assert(bounds.phone.width>100);assert(bounds.phone.height>100);
  assert(bounds.phone.x>=bounds.preview.x);assert(bounds.phone.right<=bounds.preview.right+1);
  assert(bounds.phone.bottom<=bounds.preview.bottom+1);
  if(side) assert(bounds.preview.x>=bounds.editor.right-1);
  else assert(bounds.preview.y>=bounds.editor.bottom-1);
 };
 await check(true);
 await page.waitForTimeout(700);await page.evaluate(()=>PlaygroundFeatures.closeModal('pf-quiz-modal'));
 await page.evaluate(()=>htmlEditor.setValue('<h1 id="live-check">Updated live</h1>'));
 await page.frameLocator('#preview').locator('#live-check').waitFor();
 await page.selectOption('.pf-phone-select','ipad');await check(true);
 await page.evaluate(()=>PlaygroundFeatures.togglePhoneOrientation());await check(true);
 await page.evaluate(()=>PlaygroundFeatures.togglePhonePreview(false));
 assert(!await page.locator('#preview-container').evaluate(el=>el.classList.contains('phone-mode-active')));
 await page.evaluate(()=>PlaygroundFeatures.togglePhonePreview(true));await check(true);
 await page.setViewportSize({width:390,height:844});await check(false);
 await page.selectOption('.pf-phone-select','compact');await check(false);
 await page.locator('#preview-container').scrollIntoViewIfNeeded();
 if(process.env.PHONE_PREVIEW_SCREENSHOT) await page.screenshot({path:process.env.PHONE_PREVIEW_SCREENSHOT});
 assert.deepEqual(errors,[]);console.log('PASS: automatic phone preview, desktop split, device scaling, rotation, live editing, desktop toggle and narrow screen visibility.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
