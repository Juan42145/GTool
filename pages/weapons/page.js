let info

function showInfo(wpn){
  let [name, state] = wpn; info = LDB[name];
  document.getElementById('weapon-menu').classList.add('hide')
  document.getElementById('wpn').classList.remove('hide')

  document.getElementById('wpn-img').src = getWeapon(name);
  document.getElementById('wpn').dataset.color = info.RARITY;
  
  document.getElementById('NAME').textContent = name;
  document.getElementById('RARITY').classList = 's'+info.RARITY;
  document.getElementById('TYPE').textContent = info.TYPE;
  
  let REF = document.getElementById('REFINEMENT')
  if(state.OWNED){
    REF.classList.remove('hide')
    REF.textContent = 'R'+state.REFINEMENT;
    let max = info.MAX? info.MAX: 5;
    if(state.REFINEMENT >= max) REF.classList.add('max')
    else REF.classList.remove('max')
  } else{
    REF.classList.add('hide')
    REF.textContent = '';
    REF.classList.remove('max')
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
  let REF = document.getElementById('REFINEMENT');
  let reftx = REF.textContent, value;
  if(reftx === ''){
    userWpn[name]['OWNED'] = true; value = 1;
  }
  else{
    value = +reftx.substring(1) + 1;
  }

  let max = info.MAX? info.MAX: 5;
  if(value >= max) REF.classList.add('max')
  else REF.classList.remove('max')

  REF.textContent = 'R' + value; userWpn[name]['REFINEMENT'] = value;
  store('Weapons', userWpn);
  caching('cacheW', userWpn[name]['ROW'], userWpn[name]);
}

function minus(){
  let name = document.getElementById('NAME').textContent;
  let REF = document.getElementById('REFINEMENT');
  let reftx = REF.textContent, value, string;
  if(reftx === '') return;
  else if(reftx === 'R1'){
    value = ''; string = ''; userWpn[name]['OWNED'] = false;
  }
  else if(reftx !== '' && reftx !== 'C0') {
    value = +reftx.substring(1) - 1; string = 'R' + value;
  }

  let max = info.MAX? info.MAX: 5;
  if(value >= max) REF.classList.add('max')
  else REF.classList.remove('max')

  REF.textContent = string; userWpn[name]['REFINEMENT'] = value;
  store('Weapons', userWpn);
  caching('cacheW', userWpn[name]['ROW'],userWpn[name]);
}

function closeChar(){
  document.getElementById('weapon-menu').classList.remove('hide')
  document.getElementById('wpn').classList.add('hide')
  editOut(); makeWeapons();
}

function update(e){
  let name = document.getElementById('NAME').textContent;
  if(e.id === 'FARM') userWpn[name][e.id] = e.checked;
  else userWpn[name][e.id] = e.value;
  
  sessionStorage.set('calc', true); store('Weapons', userWpn);
  caching('cacheW', userWpn[name]['ROW'],userWpn[name]);
}