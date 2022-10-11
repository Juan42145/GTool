function showInfo(char){
  let [name, state] = char; const info = LDB[name];
  document.getElementById('char-menu').classList.add('hide')
  document.getElementById('char').classList.remove('hide')

  document.getElementById('char-img').src = getCharacter(name, true);
  document.getElementById('char').dataset.color = info.ELEMENT;
  
  document.getElementById('NAME').textContent = name;
  document.getElementById('RARITY').classList = 's'+info.RARITY;
  document.getElementById('WEAPON').textContent = info.WEAPON;
  document.getElementById('ELEMENT').src = getImage('ELEMENT', info.ELEMENT, 0);
  
  let CONS = document.getElementById('CONSTELLATION')
  if(state.OWNED){
    CONS.classList.remove('hide');
    CONS.textContent = 'C'+state.CONSTELLATION;
    if(state.CONSTELLATION >= 6) CONS.classList.add('max')
    else CONS.classList.remove('max')
  } else{
    CONS.classList.add('hide');
    CONS.textContent = '';
    CONS.classList.remove('max')
  }

  document.getElementById('FARM').checked = state.FARM;

  setImage('BOSS', 'BOSSES', info.BOSS, 4);
  setImage('LOCAL', 'LOCALS', info.LOCAL, 1);
  setImage('COMMON', 'ENEMIES', info.COMMON, 1);
  setImage('BOOK', 'BOOKS', info.BOOK, 2);
  setImage('WEEKLY BOSS', 'WEEKLY BOSS', info['WEEKLY BOSS'], 0);
  setImage('WEEKLY', 'WEEKLYS', info.WEEKLY, 5);

  document.getElementById('PHASE').value = state.PHASE
  document.getElementById('TARGET').value = state.TARGET
  document.getElementById('NORMAL').value = state.NORMAL
  document.getElementById('TNORMAL').value = state.TNORMAL
  document.getElementById('SKILL').value = state.SKILL
  document.getElementById('TSKILL').value = state.TSKILL
  document.getElementById('BURST').value = state.BURST
  document.getElementById('TBURST').value = state.TBURST

  document.getElementById('STAT').textContent = info.STAT
  document.getElementById('HP').textContent = info.HP
  document.getElementById('ATK').textContent = info.ATK
  document.getElementById('DEF').textContent = info.DEF
  document.getElementById('VALUE').textContent = info.VALUE
}

function setImage(id, category, item, rank){
  document.getElementById(id).src = getImage(category, item, rank); tool(id, item)
}

function tool(id, name){
  let e = document.getElementById(id)
  e.addEventListener('mouseover', ()=>tooltip.show(name))
  e.addEventListener('mouseout', ()=>tooltip.hide())
}

function editIn(){
  document.getElementById('edit').setAttribute('onClick', 'editOut()');

  document.getElementById('pencil').classList.add('hide')
  document.getElementById('disk').classList.remove('hide')
  document.getElementById('modify').classList.remove('hide')
  document.getElementById('CONSTELLATION').classList.remove('hide')
}

function editOut(){
  document.getElementById('edit').setAttribute('onClick', 'editIn()');

  document.getElementById('pencil').classList.remove('hide')
  document.getElementById('disk').classList.add('hide')
  document.getElementById('modify').classList.add('hide')

  let name = document.getElementById('NAME').textContent;
  if(userChar[name]['OWNED']){
    document.getElementById('CONSTELLATION').classList.remove('hide')
  } else{
    document.getElementById('CONSTELLATION').classList.add('hide')
  }
}

function plus(){
  let name = document.getElementById('NAME').textContent;
  let CONS = document.getElementById('CONSTELLATION')
  let constx = CONS.textContent, value;
  if(constx === ''){
    userChar[name]['OWNED'] = true; value = 0;
  }
  else{
    value = +constx.substring(1) + 1;
  }

  if(value >= 6) CONS.classList.add('max')
  else CONS.classList.remove('max')

  CONS.textContent = 'C' + value; userChar[name]['CONSTELLATION'] = value;
  store('Characters', userChar);
  caching('cacheC', userChar[name]['ROW'], userChar[name]);
}

function minus(){
  let name = document.getElementById('NAME').textContent;
  let CONS = document.getElementById('CONSTELLATION')
  let constx = CONS.textContent, value, string;
  if(constx === '') return;
  else if(constx === 'C0'){
    value = ''; string = ''; userChar[name]['OWNED'] = false;
  }
  else if(constx !== '' && constx !== 'C0') {
    value = +constx.substring(1) - 1; string = 'C' + value;
  }

  if(value >= 6) CONS.classList.add('max')
  else CONS.classList.remove('max')

  CONS.textContent = string; userChar[name]['CONSTELLATION'] = value;
  store('Characters', userChar);
  caching('cacheC', userChar[name]['ROW'], userChar[name]);
}

function closeChar(){
  document.getElementById('char-menu').classList.remove('hide')
  document.getElementById('char').classList.add('hide')
  editOut(); characters();
}

function update(e){
  let name = document.getElementById('NAME').textContent;
  if(e.id === 'FARM') userChar[name][e.id] = e.checked;
  else userChar[name][e.id] = e.value;
  
  myStorage.set('calc', true); store('Characters', userChar);
  caching('cacheC', userChar[name]['ROW'], userChar[name]);
}
