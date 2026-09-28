// ==UserScript==
// @name         ChatGPT 简约语音球
// @namespace    local.chatgpt.voice-helper
// @version      2.5.10
// @description  简约语音球：缩小、右下角、空闲透明、拖动记忆、快捷键隐藏。
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-idle
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==
(() => {
  'use strict';

  const SCALE = 0.7;
  const VERSION = '2.5.10';
  const IDLE_OPACITY = 0.25;
  const MARGIN = 24;
  const SELECTOR = '[data-testid="avatar-overlay-voice-orb"]';
  const MARK = 'data-local-voice-helper';
  const STOP_EVENT = 'local-voice-helper-stop-v2';
  document.dispatchEvent(new Event(STOP_EVENT));
  const read = (key, fallback) => { try { return GM_getValue(key, fallback); } catch { return fallback; } };
  const save = (key, value) => { try { GM_setValue(key, value); } catch {} };
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const fraction = value => { const n = Number(value); return Number.isFinite(n) ? clamp(n, 0, 1) : 1; };

  let nx = fraction(read('voice-v2-x', 1));
  let ny = fraction(read('voice-v2-y', 1));
  let dockTimer=0;
  let hidden = false, hovered = false, dragging = false;
  let target = null, original = new Map();
  let tx = 0, ty = 0, factorX = 1, factorY = 1, frame = 0;
  let pointerFrame = 0, lastPointer = null;
  const css = document.createElement('style');
  css.textContent = `[${MARK}], [${MARK}] * { pointer-events: none !important; }`;
  document.head.appendChild(css);
  const grip = document.createElement('div');
  grip.title = '按住球体拖动；位置自动保存';
  grip.style.cssText = 'position:fixed;z-index:2147483601;display:none;border-radius:50%;clip-path:ellipse(50% 50% at 50% 50%);background:transparent;user-select:none;touch-action:none;cursor:grab;';
  document.body.appendChild(grip);
  grip.setAttribute('data-local-voice-grip', '');
  grip.style.cursor = 'grab'; grip.style.touchAction = 'none';
  const edge=document.createElement('button');
  edge.type='button';edge.setAttribute('data-local-voice-edge','');
  edge.style.cssText='position:fixed;z-index:2147483647;display:none;width:12px;height:88px;padding:0;border:0;background:transparent;cursor:pointer;touch-action:none;';
  const rail=document.createElement('span');rail.style.cssText='display:block;width:3px;height:40px;margin:auto;border-radius:3px;background:#aaa;box-shadow:0 0 2px #0008;';edge.appendChild(rail);document.body.appendChild(edge);
  function syncEdge(){
    if(!target||!hidden){edge.style.display='none';return;}
    const r=target.getBoundingClientRect();edge.style.display='block';edge.style.left=nx<.5?'0px':'auto';edge.style.right=nx<.5?'auto':'0px';edge.style.top=clamp(r.top+r.height/2-44,0,Math.max(0,innerHeight-88))+'px';
    edge.setAttribute('aria-label',nx<.5?'语音球在左侧：悬停或点击展开 / Orb on left: hover or click to reveal':'语音球在右侧：悬停或点击展开 / Orb on right: hover or click to reveal');edge.title=edge.getAttribute('aria-label');
  }
  function revealDock(){if(!target||!hidden)return;clearTimeout(dockTimer);hidden=false;hovered=true;appearance();place();scheduleDock();}
  function nearEdge(){return !!target?.isConnected&&(nx<=0.008||nx>=0.992);}
  function scheduleDock(delay=1100){clearTimeout(dockTimer);dockTimer=0;if(!nearEdge())return;dockTimer=setTimeout(()=>{dockTimer=0;if(!target||dragging||!nearEdge())return;if(hovered){scheduleDock();return;}dockOrb();},delay);}
  function dockOrb(){
    if(!target||dragging)return;clearTimeout(dockTimer);hidden=true;hovered=false;nx=nx<.5?0:1;save('voice-v2-x',nx);place();appearance();
    statusDismissed=false;statusBadge.style.display='flex';setStatus(nx<.5?'已收纳到左侧细线，移到细线处展开。 / Hidden at the left edge. Hover over the line to reveal.':'已收纳到右侧细线，移到细线处展开。 / Hidden at the right edge. Hover over the line to reveal.');clearTimeout(statusTimer);statusTimer=setTimeout(()=>{statusBadge.style.display='none'},6500);
  }
  edge.addEventListener('pointerenter',revealDock);edge.addEventListener('click',revealDock);edge.addEventListener('focus',revealDock);


  const statusBadge = document.createElement('div');
  statusBadge.setAttribute('data-local-voice-status', VERSION);
  statusBadge.style.cssText = 'position:fixed;right:12px;top:60px;z-index:2147483647;display:flex;align-items:center;gap:8px;padding:7px 10px;border:1px solid #666;border-radius:9px;background:#252525;color:#eee;font:12px/1.5 system-ui;box-shadow:0 2px 10px #0002;';
  const statusText = document.createElement('span');
  statusText.setAttribute('role','status');
  const statusClose = document.createElement('button');
  statusClose.type='button';statusClose.textContent='×';statusClose.setAttribute('aria-label','收起语音球状态');
  statusClose.style.cssText='border:0;background:transparent;color:inherit;font:18px/1 system-ui;cursor:pointer;padding:2px 4px';
  statusBadge.append(statusText,statusClose);document.body.appendChild(statusBadge);
  let statusDismissed=false,statusTimer=0,statusValue='',statusMenu;
  const temporaryRuntime=typeof GM_info==='undefined';
  function setStatus(message) {
    const value=`语音球 ${VERSION}${temporaryRuntime?'（本页临时）':''} · ${message}`;
    if(value===statusValue)return;
    statusValue=value;statusText.textContent=value;
    statusBadge.title='加载后等待语音球出现；如果开启语音后仍在等待，请确认网页中有悬浮语音球。刷新会重新检测。';
  }
  statusClose.addEventListener('click',()=>{statusDismissed=true;statusBadge.style.display='none';clearTimeout(statusTimer)});
  try { statusMenu=GM_registerMenuCommand(`语音球 ${VERSION}：显示状态 / 重新检测`,()=>{statusDismissed=false;statusBadge.style.display='flex';clearTimeout(statusTimer);scan();}); } catch {}
  setStatus('已加载，等待语音球');

  function own(name, value) {
    if (!target) return;
    if (!original.has(name)) original.set(name, [target.style.getPropertyValue(name), target.style.getPropertyPriority(name)]);
    target.style.setProperty(name, value, 'important');
  }
  function release() {

    if (target) {
      for (const [name, [value, priority]] of original) {
        if (value) target.style.setProperty(name, value, priority); else target.style.removeProperty(name);
      }
      target.removeAttribute(MARK);
    }
    clearTimeout(dockTimer);edge.style.display='none';dragging=false;grip.style.display='none';grip.style.cursor='grab';
    target = null; original = new Map(); 
  }
  function appearance() {
    if (!target) return;
    own('opacity', String(hidden ? 0 : hovered || dragging ? 1 : IDLE_OPACITY));
    syncGrip();syncEdge();

  }
  function syncGrip() {
    if(!target?.isConnected||hidden||!target.getClientRects().length||getComputedStyle(target).visibility==='hidden'||target.closest('[hidden]')){grip.style.display='none';return;}
    const r=target.getBoundingClientRect();
    grip.style.display=r.width&&r.height?'block':'none';
    grip.style.left=r.left+'px';grip.style.top=r.top+'px';grip.style.width=r.width+'px';grip.style.height=r.height+'px';
  }
  function syncControls() { syncGrip();syncEdge(); }
  function place() {
    if (!target?.isConnected) return;
    const rect = target.getBoundingClientRect();
    if (!rect.width || !rect.height) { grip.style.display='none'; return; }
    const availableX = Math.max(0, innerWidth - rect.width - 2 * MARGIN);
    const availableY = Math.max(0, innerHeight - rect.height - 2 * MARGIN);
    const x = Math.min(MARGIN, Math.max(0, innerWidth - rect.width)) + nx * availableX;
    const y = Math.min(MARGIN, Math.max(0, innerHeight - rect.height)) + ny * availableY;
    for (let i = 0; i < 2; i++) {
      const r = target.getBoundingClientRect();
      tx += (x - r.left) / factorX; ty += (y - r.top) / factorY;
      own('translate', `${tx}px ${ty}px`);
    }
    const finalRect = target.getBoundingClientRect();
     syncControls();

  }
  function calibrate() {
    own('translate', '0px 0px'); const a = target.getBoundingClientRect();
    own('translate', '32px 32px'); const b = target.getBoundingClientRect();
    factorX = (b.left - a.left) / 32 || 1; factorY = (b.top - a.top) / 32 || 1;
    tx = 0; ty = 0; own('translate', '0px 0px');
  }
  function bind(element) {
    const computed = getComputedStyle(element);
    const width = computed.width, height = computed.height, rect = element.getBoundingClientRect();
    if (rect.width < 16 || rect.height < 16 || rect.width > 400 || rect.height > 400) return;
    release(); target = element; hovered = false; target.setAttribute(MARK, '');
    own('width', width); own('height', height); own('min-width', '0px'); own('min-height', '0px');
    own('max-width', 'none'); own('max-height', 'none'); own('position', 'fixed');
    own('left', '0px'); own('top', '0px'); own('right', 'auto'); own('bottom', 'auto');
    own('scale', String(SCALE)); own('z-index', '2147483600');
    for (const side of ['top', 'right', 'bottom', 'left']) own('margin-' + side, '0px');
    calibrate(); appearance(); place();scheduleDock(3000);
  }
  function scan() {
    if(document.hidden)return;
    if (target?.isConnected) {
      let r = target.getBoundingClientRect();
      const visible = r.width > 0 && r.height > 0 && getComputedStyle(target).visibility !== 'hidden' && !target.closest('[hidden]');
      if(visible && !dragging){
        const expectedX=Math.min(MARGIN,Math.max(0,innerWidth-r.width))+nx*Math.max(0,innerWidth-r.width-2*MARGIN);
        const expectedY=Math.min(MARGIN,Math.max(0,innerHeight-r.height))+ny*Math.max(0,innerHeight-r.height-2*MARGIN);
        if(Math.abs(r.left-expectedX)>1 || Math.abs(r.top-expectedY)>1){calibrate();place();r=target.getBoundingClientRect();}
      }
      if(!visible)edge.style.display='none';
      if(visible)syncControls();else grip.style.display='none';

      if(!hidden)setStatus(visible ? (hidden ? '已隐藏' : '已连接语音球') : '等待语音球显示');
      return;
    }
    if (target) release();
    const elements = document.querySelectorAll(SELECTOR);
    if (elements.length !== 1) { setStatus(elements.length ? '发现多个候选，暂不移动' : '已加载，等待语音球'); return; }
    const element = elements[0], r = element.getBoundingClientRect();
    if (r.width && r.height) bind(element);
    if(target){setStatus('已连接语音球');if(!statusDismissed){clearTimeout(statusTimer);statusTimer=setTimeout(()=>{statusBadge.style.display='none'},6000)}}
    else setStatus('已加载，等待可识别的语音球');
  }
  function toggleHidden() { if(dragging)return;scan();if(hidden)revealDock();else dockOrb(); }
  let startX, startY, startNX, startNY;
  function beginDrag(e) {
    if (e.button !== 0 || !e.isPrimary || !target || hidden || dragging) return;
    e.preventDefault();e.stopPropagation();grip.style.cursor='grabbing'; dragging = true; startX = e.clientX; startY = e.clientY; startNX = nx; startNY = ny;
    clearTimeout(dockTimer);dockTimer=0;
    grip.setPointerCapture(e.pointerId); appearance();
  }
  grip.addEventListener('pointerdown', beginDrag);
  function moveDrag(e) {
    if (!dragging || !target) return;
    const r = target.getBoundingClientRect();
    const rangeX = Math.max(1, innerWidth - r.width - 2 * MARGIN), rangeY = Math.max(1, innerHeight - r.height - 2 * MARGIN);
    nx = clamp(startNX + (e.clientX - startX) / rangeX, 0, 1); ny = clamp(startNY + (e.clientY - startY) / rangeY, 0, 1); place();
  }
  grip.addEventListener('pointermove', moveDrag);
  grip.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();});
  function endDrag() { if (!dragging) return; dragging = false;grip.style.cursor='grab';hovered=false; save('voice-v2-x', nx); save('voice-v2-y', ny); appearance();scheduleDock(); }
  grip.addEventListener('pointerup', endDrag); grip.addEventListener('pointercancel', endDrag); grip.addEventListener('lostpointercapture', endDrag);
  function onPointerMove(e) {
    lastPointer={x:e.clientX,y:e.clientY};if(pointerFrame)return;
    pointerFrame=requestAnimationFrame(()=>{
      pointerFrame=0;if(!target||hidden||dragging||!lastPointer)return;
      const {x,y}=lastPointer,r=target.getBoundingClientRect();
      const inside=(rect,pad)=>x>=rect.left-pad&&x<=rect.right+pad&&y>=rect.top-pad&&y<=rect.bottom+pad;
      const next=inside(r,0),near=inside(r,24);
      if(next!==hovered){hovered=next;appearance()}
      if(near){clearTimeout(dockTimer);dockTimer=0;}else if(!dockTimer&&nearEdge())scheduleDock();
    });
  }
  function onKey(e) {
    if (e.repeat || e.isComposing || e.metaKey) return;
    const primary = e.altKey && e.shiftKey && !e.ctrlKey && e.code === 'KeyV';
    const alternate = e.ctrlKey && e.shiftKey && !e.altKey && e.code === 'KeyH';
    if (primary || alternate) { e.preventDefault(); e.stopPropagation(); toggleHidden(); }
  }
  function onResize() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => { if (!target?.isConnected) return; calibrate(); place();if(!hidden)scheduleDock(); });
  }
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  function resumeScan(){if(!document.hidden)scan();}
  document.addEventListener('visibilitychange',resumeScan);

  const timer = setInterval(() => { if(document.hidden)return;scan(); }, 1200);
  scan();
  document.addEventListener(STOP_EVENT, () => {
    clearInterval(timer); cancelAnimationFrame(frame);
    cancelAnimationFrame(pointerFrame);
    clearTimeout(statusTimer);statusBadge.remove();
    document.removeEventListener('visibilitychange',resumeScan);
    try { if(statusMenu!==undefined)GM_unregisterMenuCommand(statusMenu); } catch {}
    window.removeEventListener('keydown', onKey, true); window.removeEventListener('pointermove', onPointerMove); window.removeEventListener('resize', onResize);
    release();edge.remove();grip.remove();  css.remove();

  }, { once: true });
})();
