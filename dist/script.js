const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));nav.classList.toggle('is-open',!open)});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');menuButton?.setAttribute('aria-expanded','false')}));

const tabs=[...document.querySelectorAll('[data-tab]')];
const panels=[...document.querySelectorAll('[data-panel]')];
function activateTab(name){tabs.forEach(tab=>{const active=tab.dataset.tab===name;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});panels.forEach(panel=>{const active=panel.dataset.panel===name;panel.hidden=!active;panel.classList.toggle('is-active',active)})}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activateTab(tab.dataset.tab));tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const direction=event.key==='ArrowRight'?1:-1;const next=(index+direction+tabs.length)%tabs.length;tabs[next].focus();activateTab(tabs[next].dataset.tab)})});

const dialog=document.querySelector('.lightbox');
document.querySelectorAll('.gallery-card').forEach(card=>card.addEventListener('click',()=>{const image=dialog.querySelector('img');image.src=card.dataset.image;image.alt=card.dataset.title;dialog.querySelector('.lightbox__head strong').textContent=card.dataset.title;dialog.showModal()}));
document.querySelector('.lightbox__close')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
