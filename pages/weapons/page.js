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
  editOut(); makeWeapons();
}

function update(e){
  let name = document.getElementById('NAME').textContent;
  if(e.id === 'FARM') userWpn[name][e.id] = e.checked;
  else userWpn[name][e.id] = e.value;
  
  sessionStorage.set('calc', true); store('Weapons', userWpn);
  caching('cacheW', userWpn[name]['ROW'],userWpn[name]);
}