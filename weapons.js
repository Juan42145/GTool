const DB = sessionStorage.get('DB').DB_Weapons;
let userWpn = sessionStorage.get('user').Weapons;
let filters = ['Sword','Claymore','Bow','Polearm','Catalyst'];
let filter = second = count = 0;
let owned = flip = false;
let sorting = function(){};

/*WEAPONS*/
document.addEventListener('DOMContentLoaded', () => {
  let menu = document.getElementsByClassName('options')[0];
  filters.forEach((w, i) => {
    menu.getElementsByTagName('img')[i].src = getImage('WEAPON', w, 0);
  });
},false)

function weapons(){
  document.getElementById('weapons').innerHTML = '';
  let array = Object.entries(userWpn).sort(sorting);
  if(flip) array.reverse();
  array.forEach(w => {
    if(owned && filter !== 0){
      if(w[1].OWNED && DB[w[0]].TYPE === filters[filter-1]) makeRow(w)
    }
    else if(owned){
      if(w[1].OWNED) makeRow(w);
    }
    else if(filter !== 0){
      if(DB[w[0]].TYPE === filters[filter-1]) makeRow(w);
    }
    else{
      makeRow(w);
    }
  });
}

function filterOwned(btn){
  owned = !owned;
  weapons();
  btn.classList.toggle('selected')
}

function filterWpn(btn, value){
  if(filter === value) filter = 0;
  else{
    if(filter !== 0) document.getElementsByClassName('picked')[0].classList.toggle('picked')
    filter = value;
  }
  weapons();
  btn.classList.toggle('picked')
}

function sortTable(value){
  let sorts = [function(){}, sortF, sortR , sortName, sortPhase, sortATK, sortStat, sortA, sortE, sortC]
  if(second === value && count === 2){
    second = count = value = 0;
    flip = false;
  }
  else if(second === value){
    count = 2;
    flip = true;
  } 
  else {
    second = value;
    count = 1;
    flip = false;
  }
  sorting = sorts[value];
  weapons();
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
  let k = Object.keys(sessionStorage.get('DB').DB_Master.WEAPONS)
  return k.indexOf(DB[a[0]].ASCENSION) - k.indexOf(DB[b[0]].ASCENSION)
}

function sortE(a,b){
  let k = Object.keys(sessionStorage.get('DB').DB_Master.ENEMIES)
  return k.indexOf(DB[a[0]].ELITE) - k.indexOf(DB[b[0]].ELITE)
}

function sortC(a,b){
  let k = Object.keys(sessionStorage.get('DB').DB_Master.ENEMIES)
  return k.indexOf(DB[a[0]].COMMON) - k.indexOf(DB[b[0]].COMMON)
}

function makeRow(w){
  const info = DB[w[0]];

  const ROW = document.createElement('tr');
  ROW.classList.add('w_'+info.RARITY);
  document.getElementById('weapons').append(ROW);
  ROW.addEventListener('click', (e)=>{
    if(e.target.classList == 'farm') return
    showInfo(w)
  }, false);

  let CELL;

  CELL = document.createElement('td');
  CELL.classList = 'farm';
  const FARM = Object.assign(document.createElement("input"),{
    type: "checkbox", classList: "farm", checked: w[1].FARM
  });
  FARM.addEventListener("change", function(){
      
    userWpn[w[0]].FARM = FARM.checked;

    sessionStorage.set('calc', true);
    caching('cacheW', userWpn[w[0]].ROW, userWpn[w[0]]);
    
    let user = sessionStorage.get('user');
    user.Weapons = userWpn;
    sessionStorage.set('user', user);

  }, false);
  FARM.removeEventListener('click',()=>showInfo(w), false)

  CELL.append(FARM)
  ROW.append(CELL);

  CELL = document.createElement('td');
  CELL.classList = 'img'
  const IMG = document.createElement('img');
  IMG.onerror = function(){this.classList.add('hide')};
  
  let link = w[0].toLowerCase().replaceAll(' ','_').replaceAll('"','').replaceAll("'", '');
  IMG.src = "https://paimon.moe/images/weapons/"+link+".png";

  if(w[1].OWNED){
    const TAG = document.createElement("p");
    TAG.classList = "tag";
    TAG.innerText = 'R'+ +w[1].REFINEMENT;
    CELL.append(TAG);
  }
  else{
    ROW.classList.add('missing')
  }
  
  CELL.append(IMG)
  ROW.append(CELL);

  const NAME = document.createElement("td");
  NAME.classList= "name";
  NAME.textContent = w[0];
  ROW.append(NAME)

  const PHASE = document.createElement("td");
  PHASE.classList= "phase";
  PHASE.textContent = w[1].PHASE;
  ROW.append(PHASE)

  const TYPE = document.createElement("td");
  TYPE.classList= "type";
  TYPE.textContent = info.TYPE;
  ROW.append(TYPE)

  const ATK = document.createElement("td");
  ATK.classList= "atk";
  ATK.textContent = info.ATK;
  ROW.append(ATK)

  const STAT = document.createElement("td");
  STAT.classList= "stat";
  STAT.textContent = info.STAT;
  ROW.append(STAT)

  const VALUE = document.createElement("td");
  VALUE.classList= "value";
  VALUE.textContent = info.VALUE;
  ROW.append(VALUE)

  CELL = document.createElement('td');
  CELL.classList = 'r_2';
  const ASC = document.createElement('img');
  ASC.onerror = function(){this.classList.add('hide')};
  ASC.src = getImage("WEAPONS", info.ASCENSION, 2);
  CELL.append(ASC);
  ROW.append(CELL);

  CELL = document.createElement('td');
  CELL.classList = 'r_2';
  const ELITE = document.createElement('img');
  ELITE.onerror = function(){this.classList.add('hide')};
  ELITE.src = getImage("ENEMIES", info.ELITE, 2);
  CELL.append(ELITE);
  ROW.append(CELL);

  CELL = document.createElement('td');
  CELL.classList = 'r_1';
  const COMMON = document.createElement('img');
  COMMON.onerror = function(){this.classList.add('hide')};
  COMMON.src = getImage("ENEMIES", info.COMMON, 1);
  CELL.append(COMMON);
  ROW.append(CELL);
}

function showInfo(w){
  document.getElementById('weapon-menu').classList.add('hide')
  document.getElementById('wpn').classList.remove('hide')

  const info = DB[w[0]];
  let link = w[0].toLowerCase().replaceAll(' ','_').replaceAll('"','').replaceAll("'", '');
  document.getElementById('wpn-img').src = "https://paimon.moe/images/weapons/"+link+".png";
  document.getElementById('wpn').dataset.color = info.RARITY;
  
  document.getElementById('NAME').textContent = w[0];
  document.getElementById('RARITY').classList = 's'+info.RARITY
  document.getElementById('WEAPON').textContent = info.TYPE
  
  if(w[1].OWNED){
    document.getElementById('REFINEMENT').classList.remove('hide')
    document.getElementById('REFINEMENT').textContent = 'R'+w[1].REFINEMENT;
  } else{
    document.getElementById('REFINEMENT').classList.add('hide')
    document.getElementById('REFINEMENT').textContent = '';
  }

  document.getElementById('FARM').checked = w[1].FARM

  document.getElementById('ASCENSION').src = getImage('WEAPONS', info.ASCENSION, 2)
  tool('ASCENSION', info.ASCENSION)
  document.getElementById('ELITE').src = getImage('ENEMIES', info.ELITE, 2)
  tool('ELITE', info.ELITE)
  document.getElementById('COMMON').src = getImage('ENEMIES', info.COMMON, 1)
  tool('COMMON', info.COMMON)

  document.getElementById('PHASE').value = w[1].PHASE
  document.getElementById('TARGET').value = w[1].TARGET

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
    userWpn[name]['OWNED'] = true;
    value = 1;
  }
  else if(ref !== '' && ref !== 'R5') {
    value = +ref[1] + 1;
  }

  document.getElementById('REFINEMENT').textContent = 'R' + value;
  userWpn[name]['REFINEMENT'] = value;

  caching('cacheW', userWpn[name]['ROW'], userWpn[name]);

  let user = sessionStorage.get('user');
  user.Weapons = userWpn;
  sessionStorage.set('user', user);
}

function minus(){
  let name = document.getElementById('NAME').textContent;
  let ref = document.getElementById('REFINEMENT').textContent;
  let value, string;
  if(ref === '') return;
  else if(ref === 'R1'){
    value = '';
    string = '';
    userWpn[name]['OWNED'] = false;
  }
  else if(ref !== '' && ref !== 'C0') {
    value = +ref[1] - 1;
    string = 'R' + value;
  }

  document.getElementById('REFINEMENT').textContent = string;
  userWpn[name]['REFINEMENT'] = value;

  caching('cacheW', userWpn[name]['ROW'],userWpn[name]);

  let user = sessionStorage.get('user');
  user.Weapons = userWpn;
  sessionStorage.set('user', user);
}

function closeChar(){
  document.getElementById('weapon-menu').classList.remove('hide')
  document.getElementById('wpn').classList.add('hide')
  editOut();
  weapons();
}

function update(e){
  let name = document.getElementById('NAME').textContent;
  if(e.id === "FARM") userWpn[name][e.id] = e.checked;
  else userWpn[name][e.id] = e.value;
  
  sessionStorage.set('calc', true);
  caching('cacheW', userWpn[name]['ROW'],userWpn[name]);

  let user = sessionStorage.get('user');
  user.Weapons = userWpn;
  sessionStorage.set('user', user);
}

function saveWeapons(){
  let user = sessionStorage.get('user');
  user.Weapons = userWpn;
  sessionStorage.set('user', user);
  setWpn();
}