const DB = sessionStorage.get('DB').DB_Weapons;
let userWpn = sessionStorage.get('user').Weapons;
let filters = ['Sword','Claymore','Bow','Polearm','Catalyst'];
let filter = 0, second = 0, count = 0; owned = false, flip = false;
let sorting = ()=>{};

/*--WEAPONS--*/
document.addEventListener('DOMContentLoaded', () => {
  let menu = document.getElementsByClassName('options')[0];
  filters.forEach((wpn, i) => {
    menu.getElementsByTagName('img')[i].src = getImage('WEAPON', wpn, 0);
  });
},false)

function weapons(){
  document.getElementById('weapons').innerHTML = '';
  let array = Object.entries(userWpn).sort(sorting); if(flip) array.reverse();
  array.forEach(wpn => {
    if(owned && filter !== 0){
      if(wpn[1].OWNED && DB[wpn[0]].TYPE === filters[filter-1]) makeRow(wpn)
    }
    else if(owned){
      if(wpn[1].OWNED) makeRow(wpn);
    }
    else if(filter !== 0){
      if(DB[wpn[0]].TYPE === filters[filter-1]) makeRow(wpn);
    }
    else{
      makeRow(wpn);
    }
  });
}

function filterOwned(btn){
  owned = !owned; btn.classList.toggle('selected'); weapons();
}

function filterWpn(btn, value){
  if(filter === value) filter = 0;
  else{
    if(filter !== 0) document.getElementsByClassName('picked')[0].classList.toggle('picked')
    filter = value;
  }
  btn.classList.toggle('picked'); weapons();
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
  sorting = sorts[value]; weapons();
}

function sortF(a,b){
  return b[1].FARM - a[1].FARM || b[1].PHASE - a[1].PHASE || b[1].OWNED - a[1].OWNED  || DB[b[0]].RARITY - DB[a[0]].RARITY;
}

function sortR(a,b){
  return b[1].REFINEMENT - a[1].REFINEMENT || DB[b[0]].RARITY - DB[a[0]].RARITY;
}

function sortName(a,b){
  return a[0].localeCompare(b[0]);
}

function sortPhase(a,b){
  return b[1].PHASE - a[1].PHASE || b[1].OWNED - a[1].OWNED  || DB[b[0]].RARITY - DB[a[0]].RARITY;
}

function sortATK(a,b){
  return DB[b[0]].ATK - DB[a[0]].ATK
}

function sortStat(a,b){
  return DB[a[0]].STAT.localeCompare(DB[b[0]].STAT) || DB[b[0]].VALUE.localeCompare(DB[a[0]].VALUE);
}

function sortA(a,b){
  let k = Object.keys(sessionStorage.get('DB').DB_Master.TROPHIES)
  return k.indexOf(DB[a[0]].TROPHY) - k.indexOf(DB[b[0]].TROPHY)
}

function sortE(a,b){
  let k = Object.keys(sessionStorage.get('DB').DB_Master.ENEMIES)
  return k.indexOf(DB[a[0]].ELITE) - k.indexOf(DB[b[0]].ELITE)
}

function sortC(a,b){
  let k = Object.keys(sessionStorage.get('DB').DB_Master.ENEMIES)
  return k.indexOf(DB[a[0]].COMMON) - k.indexOf(DB[b[0]].COMMON)
}

function sortRR(a,b){
  return DB[b[0]].RARITY - DB[a[0]].RARITY;
}

function makeRow(wpn){
  let [name, state] = wpn; const info = DB[name];

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
  IMG.onerror = ()=>this.classList.add('hide');

  if(state.OWNED){
    const TAG = create(CELL, 'p', {'class':'tag'});
    TAG.textContent = 'R'+ +state.REFINEMENT;
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
  TROPHY.onerror = ()=>this.classList.add('hide');

  CELL = create(ROW, 'td', {'class':'r_2'});
  
  const ELITE = create(CELL, 'img', {'src':getImage('ENEMIES', info.ELITE, 2)});
  ELITE.onerror = ()=>this.classList.add('hide');

  CELL = create(ROW, 'td', {'class':'r_1'});

  const COMMON = create(CELL, 'img', {'src':getImage('ENEMIES', info.COMMON, 1)});
  COMMON.onerror = ()=>this.classList.add('hide');
}

/*--INFO PAGE--*/
function showInfo(wpn){
  let [name, state] = wpn; const info = DB[name];
  document.getElementById('weapon-menu').classList.add('hide')
  document.getElementById('wpn').classList.remove('hide')

  let link = name.toLowerCase().replaceAll(' ','_').replaceAll('"','').replaceAll("'", '');
  document.getElementById('wpn-img').src = 'https://paimon.moe/images/weapons/'+link+'.png';
  document.getElementById('wpn').dataset.color = info.RARITY;
  
  document.getElementById('NAME').textContent = name;
  document.getElementById('RARITY').classList = 's'+info.RARITY;
  document.getElementById('TYPE').textContent = info.TYPE;
  
  if(state.OWNED){
    document.getElementById('REFINEMENT').classList.remove('hide')
    document.getElementById('REFINEMENT').textContent = 'R'+state.REFINEMENT;
  } else{
    document.getElementById('REFINEMENT').classList.add('hide')
    document.getElementById('REFINEMENT').textContent = '';
  }

  document.getElementById('FARM').checked = state.FARM

  document.getElementById('TROPHY').src = getImage('TROPHIES', info.TROPHY, 2)
  tool('TROPHY', info.TROPHY)
  document.getElementById('ELITE').src = getImage('ENEMIES', info.ELITE, 2)
  tool('ELITE', info.ELITE)
  document.getElementById('COMMON').src = getImage('ENEMIES', info.COMMON, 1)
  tool('COMMON', info.COMMON)

  document.getElementById('PHASE').value = state.PHASE
  document.getElementById('TARGET').value = state.TARGET

  document.getElementById('STAT').textContent = info.STAT
  document.getElementById('ATK').textContent = info.ATK
  document.getElementById('VALUE').textContent = info.VALUE
}

function tool(id, name){
  let e = document.getElementById(id)
  e.addEventListener('mouseover', ()=>{tooltip.show(name)})
  e.addEventListener('mouseout', ()=>{tooltip.hide()})
}

function editIn(){
  document.getElementById('edit').setAttribute('onClick', 'editOut()');

  document.getElementById('pencil').classList.add('hide')
  document.getElementById('disk').classList.remove('hide')
  document.getElementById('modify').classList.remove('hide')
  document.getElementById('REFINEMENT').classList.remove('hide')
}

function editOut(){
  document.getElementById('edit').setAttribute('onClick', 'editIn()');

  document.getElementById('pencil').classList.remove('hide')
  document.getElementById('disk').classList.add('hide')
  document.getElementById('modify').classList.add('hide')

  let name = document.getElementById('NAME').textContent;
  if(userWpn[name]['OWNED']){
    document.getElementById('REFINEMENT').classList.remove('hide')
  } else{
    document.getElementById('REFINEMENT').classList.add('hide')
  }
}

function plus(){
  let name = document.getElementById('NAME').textContent;
  let ref = document.getElementById('REFINEMENT').textContent;
  let value;
  if(ref === 'R5') return;
  else if(ref === ''){
    userWpn[name]['OWNED'] = true; value = 1;
  }
  else if(ref !== '' && ref !== 'R5') {
    value = +ref[1] + 1;
  }

  document.getElementById('REFINEMENT').textContent = 'R' + value;
  userWpn[name]['REFINEMENT'] = value; store('Weapons', userWpn);
  caching('cacheW', userWpn[name]['ROW'], userWpn[name]);

}

function minus(){
  let name = document.getElementById('NAME').textContent;
  let ref = document.getElementById('REFINEMENT').textContent;
  let value, string;
  if(ref === '') return;
  else if(ref === 'R1'){
    value = ''; string = ''; userWpn[name]['OWNED'] = false;
  }
  else if(ref !== '' && ref !== 'C0') {
    value = +ref[1] - 1; string = 'R' + value;
  }

  document.getElementById('REFINEMENT').textContent = string;
  userWpn[name]['REFINEMENT'] = value; store('Weapons', userWpn);
  caching('cacheW', userWpn[name]['ROW'],userWpn[name]);
}

function closeChar(){
  document.getElementById('weapon-menu').classList.remove('hide')
  document.getElementById('wpn').classList.add('hide')
  editOut(); weapons();
}

function update(e){
  let name = document.getElementById('NAME').textContent;
  if(e.id === 'FARM') userWpn[name][e.id] = e.checked;
  else userWpn[name][e.id] = e.value;
  
  sessionStorage.set('calc', true); store('Weapons', userWpn);
  caching('cacheW', userWpn[name]['ROW'],userWpn[name]);
}

function saveWeapons(){
  store('Weapons', userWpn); setWpn();
}
