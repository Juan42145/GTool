const LDB = sessionStorage.get('DB').DB_Weapons;
let userWpn = sessionStorage.get('user').Weapons;
let filters = ['Sword','Claymore','Bow','Polearm','Catalyst'];
let filter = 0, second = 0, count = 0; owned = false, flip = false;
let sorting = ()=>{};

/*--WEAPONS--*/
function weapons(){
  let menu = document.getElementsByClassName('options')[0];
  filters.forEach((wpn, i) => {
    menu.getElementsByTagName('img')[i].src = getImage('WEAPON', wpn, 0);
  });
  makeWeapons();
}

function makeWeapons(){
  document.getElementById('weapons').innerHTML = '';
  let array = Object.entries(userWpn).sort(sorting); if(flip) array.reverse();
  array.forEach(wpn => {
    if(owned && filter !== 0){
      if(wpn[1].OWNED && LDB[wpn[0]].TYPE === filters[filter-1]) makeRow(wpn)
    }
    else if(owned){
      if(wpn[1].OWNED) makeRow(wpn);
    }
    else if(filter !== 0){
      if(LDB[wpn[0]].TYPE === filters[filter-1]) makeRow(wpn);
    }
    else{
      makeRow(wpn);
    }
  });
}

function filterOwned(btn){
  owned = !owned; btn.classList.toggle('selected'); makeWeapons();
}

function filterWpn(btn, value){
  if(filter === value) filter = 0;
  else{
    if(filter !== 0) document.getElementsByClassName('picked')[0].classList.toggle('picked')
    filter = value;
  }
  btn.classList.toggle('picked'); makeWeapons();
}

function sortTable(value){
  let sorts = [()=>{}, sortF, sortR , sortName, sortPhase, sortATK, sortStat, sortA, sortE, sortC, sortRR]
  if(second === value && count === 2){
    second = 0; count = 0; value = 0; flip = false;
  }
  else if(second === value){
    count = 2; flip = true;
  } 
  else {
    second = value; count = 1; flip = false;
  }
  sorting = sorts[value]; makeWeapons();
}

function sortF(a,b){
  return b[1].FARM - a[1].FARM || b[1].PHASE - a[1].PHASE || b[1].OWNED - a[1].OWNED  || LDB[b[0]].RARITY - LDB[a[0]].RARITY;
}

function sortR(a,b){
  return b[1].REFINEMENT - a[1].REFINEMENT || LDB[b[0]].RARITY - LDB[a[0]].RARITY;
}

function sortName(a,b){
  return a[0].localeCompare(b[0]);
}

function sortPhase(a,b){
  return b[1].PHASE - a[1].PHASE || b[1].OWNED - a[1].OWNED  || LDB[b[0]].RARITY - LDB[a[0]].RARITY;
}

function sortATK(a,b){
  return LDB[b[0]].ATK - LDB[a[0]].ATK
}

function sortStat(a,b){
  return LDB[a[0]].STAT.localeCompare(LDB[b[0]].STAT) || LDB[b[0]].VALUE.localeCompare(LDB[a[0]].VALUE);
}

function sortA(a,b){
  let k = Object.keys(sessionStorage.get('DB').DB_Master.TROPHIES)
  return k.indexOf(LDB[a[0]].TROPHY) - k.indexOf(LDB[b[0]].TROPHY)
}

function sortE(a,b){
  let k = Object.keys(sessionStorage.get('DB').DB_Master.ENEMIES)
  return k.indexOf(LDB[a[0]].ELITE) - k.indexOf(LDB[b[0]].ELITE)
}

function sortC(a,b){
  let k = Object.keys(sessionStorage.get('DB').DB_Master.ENEMIES)
  return k.indexOf(LDB[a[0]].COMMON) - k.indexOf(LDB[b[0]].COMMON)
}

function sortRR(a,b){
  return LDB[b[0]].RARITY - LDB[a[0]].RARITY;
}

function makeRow(wpn){
  let [name, state] = wpn; const info = LDB[name];
  
  const ROW = create(document.getElementById('weapons'), 'tr', {'class':'w_'+info.RARITY})
  ROW.addEventListener('click', (e)=>{
    if(e.target.classList == 'farm') return;
    showInfo(wpn)
  }, false);

  let CELL;

  CELL = create(ROW, 'td', {'class':'farm'})
  
  const FARM = create(CELL, 'input', {'class': 'farm', 'type':'checkbox'});
  FARM.checked = state.FARM;
  FARM.addEventListener('change', ()=>{
    userWpn[name].FARM = FARM.checked;
    sessionStorage.set('calc', true); store('Weapons', userWpn);
    caching('cacheW', userWpn[name].ROW, userWpn[name]);
  }, false);

  CELL = create(ROW, 'td', {'class':'img'})
  
  let link = name.toLowerCase().replaceAll(' ','_').replaceAll('"','').replaceAll("'", '');
  const IMG = create(CELL, 'img', {'src': 'https://paimon.moe/images/weapons/'+link+'.png'})
  setError(IMG)

  if(state.OWNED){
    const TAG = create(CELL, 'p', {'class':'tag'});
    TAG.textContent = 'R'+ +state.REFINEMENT;
    let max = info.MAX? info.MAX: 5;
    if(state.REFINEMENT >= max) TAG.classList.add('max')
  }
  else{
    ROW.classList.add('missing')
  }

  const NAME = create(ROW, 'td', {'class':'name'});
  NAME.textContent = name;

  const PHASE = create(ROW, 'td', {'class':'phase'});
  PHASE.textContent = state.PHASE;

  const TYPE = create(ROW, 'td', {'class':'type'});
  TYPE.textContent = info.TYPE;

  const ATK = create(ROW, 'td', {'class':'atk'});
  ATK.textContent = info.ATK;

  const STAT = create(ROW, 'td', {'class':'stat'});
  STAT.textContent = info.STAT;

  const VALUE = create(ROW, 'td', {'class':'value'});
  VALUE.textContent = info.VALUE;

  CELL = create(ROW, 'td', {'class':'r_2'});
  
  const TROPHY = create(CELL, 'img', {'src':getImage('TROPHIES', info.TROPHY, 2)});
  setError(TROPHY)

  CELL = create(ROW, 'td', {'class':'r_2'});
  
  const ELITE = create(CELL, 'img', {'src':getImage('ENEMIES', info.ELITE, 2)});
  setError(ELITE)

  CELL = create(ROW, 'td', {'class':'r_1'});

  const COMMON = create(CELL, 'img', {'src':getImage('ENEMIES', info.COMMON, 1)});
  setError(COMMON)
}

function save(){
  store('Weapons', userWpn); setWpn();
}
