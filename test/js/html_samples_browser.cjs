// Offline regression: speech and CodeMirror are stubbed; actual preview rendering and events run.
// Run from the repository root with Playwright installed or PLAYWRIGHT_MODULE configured.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE ? {executablePath:process.env.PLAYWRIGHT_EXECUTABLE} : {})});
 try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.addInitScript(()=>{
  window.spoken=[];window.canceled=0;
  window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
  Object.defineProperty(window,'speechSynthesis',{value:{speak(u){window.spoken.push({text:u.text,rate:u.rate,pitch:u.pitch});},cancel(){window.canceled++;}}});
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
 await page.waitForTimeout(700);await page.evaluate(()=>PlaygroundFeatures.closeModal('pf-quiz-modal'));
 await page.evaluate(()=>PlaygroundFeatures.togglePhonePreview(false));
 assert.equal(await page.evaluate(()=>spoken.length),0);
 assert(await page.locator('[data-output-voice]').evaluateAll(inputs=>inputs.every(input=>!input.checked)));
 await page.locator('.toolbar [data-output-voice]').check();
 assert(await page.locator('[data-output-voice]').evaluateAll(inputs=>inputs.every(input=>input.checked)));
 assert.equal(await page.locator('#pf-sample-select option').count(),75);
 await page.evaluate(()=>PlaygroundFeatures.openSamplesModal());
 assert.equal(await page.locator('.pf-sample-card').count(),74);
 await page.evaluate(()=>PlaygroundFeatures.closeModal('pf-samples-modal'));
 assert.equal(await page.locator('#pf-tts-widget').count(),0);
 assert.equal(await page.getByRole('button',{name:'Read Aloud',exact:true}).count(),0);
 await page.selectOption('#pf-sample-select','multiplication-details');
 let preview=page.frameLocator('#preview');
 await preview.getByRole('heading',{name:'What is 6 × 4?'}).waitFor();
 await page.waitForTimeout(300);
 let speech=await page.evaluate(()=>spoken.at(-1));
 assert(speech.text.includes('What is 6 4'));assert(!speech.text.includes('Try again'));assert(!speech.text.includes('Correct'));
 assert.equal(speech.rate,0.92);assert.equal(speech.pitch,1.05);
 await preview.locator('summary').filter({hasText:'24'}).click();
 await page.waitForTimeout(300);assert.match(await page.evaluate(()=>spoken.at(-1).text),/Correct/);
 await page.evaluate(()=>PlaygroundFeatures.setOutputSpeech(false));
 const count=await page.evaluate(()=>spoken.length);
 await preview.locator('summary').filter({hasText:'20'}).click();await page.waitForTimeout(300);
 assert.equal(await page.evaluate(()=>spoken.length),count);
 assert(await page.locator('[data-output-voice]').evaluateAll(bs=>bs.every(b=>!b.checked)));
 await page.evaluate(()=>PlaygroundFeatures.setOutputSpeech(true));
 await page.selectOption('#pf-sample-select','multiplication-hover');
 const answer=preview.locator('button').filter({hasText:'24'});await answer.waitFor();await page.waitForTimeout(300);
 assert(!(await page.evaluate(()=>spoken.at(-1).text)).includes('Correct'));
 await answer.hover();await page.waitForTimeout(300);assert.match(await page.evaluate(()=>spoken.at(-1).text),/Correct/);
 const before=await page.evaluate(()=>spoken.length);await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>spoken.length),before);
 await page.evaluate(()=>htmlEditor.setValue('<p>Hello output</p><script>const secret="Do not read source";</script>'));
 await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>spoken.at(-1).text),'Hello output');
 await page.evaluate(()=>{
  jsEditor.setValue('window.runCount = (window.runCount || 0) + 1; document.body.innerHTML = "<p>Run " + window.runCount + "</p>";');
 });
 await page.frameLocator('#preview').getByText('Run 1',{exact:true}).waitFor();
 await page.frameLocator('#preview').locator('body').evaluate(body=>body.innerHTML='<p>Changed output</p>');
 await page.evaluate(()=>PlaygroundFeatures.togglePhonePreview(true));
 await page.locator('#pf-phone-rerun').click();
 await page.frameLocator('#preview').getByText('Run 1',{exact:true}).waitFor();
 await page.reload();
 assert(await page.locator('[data-output-voice]').evaluateAll(inputs=>inputs.every(input=>!input.checked)));
 await page.evaluate(()=>PlaygroundFeatures.closeModal('pf-quiz-modal'));
 const samples=JSON.parse(fs.readFileSync('html-ide/samples.json','utf8'));
 for(const sample of samples) {
  await page.evaluate(async id=>{
    const loaded=new Promise(resolve=>document.getElementById('preview').addEventListener('load',resolve,{once:true}));
    await PlaygroundFeatures.loadSample(id);
    await loaded;
  },sample.id);
  await page.waitForTimeout(60);
  assert((await page.frameLocator('#preview').locator('body').innerText()).trim().length>0,sample.id);
 }
 assert.deepEqual(errors,[]);console.log('PASS: all 74 samples load with visible output and no runtime errors; gallery/dropdown, original interactions, speech and rerun pass.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
