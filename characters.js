const DB = sessionStorage.get('DB').DB_Characters;
let userChar = sessionStorage.get('user').Characters;
let owned = false, flip = false; sorting = ()=>{};

/*--CHARACTERS--*/
function characters(){
  document.getElementById('characters').innerHTML = '';
  let array = Object.entries(userChar).sort(sorting); if(flip) array.reverse();
  array.forEach(char => {
    if(owned){
      if(char[1].OWNED) makeCard(char);
    } else{
      makeCard(char);
    }
  });
}

function filterOwned(btn){
  owned = !owned; btn.classList.toggle('selected'); characters()
}

function getSort(value){
  let sorts = [()=>{}, sortName, sortAscension, sortRarity, sortConstellation]
  sorting = sorts[value]; characters();
}

function sortName(a,b){
  return a[0].localeCompare(b[0]);
}

function sortAscension(a,b){
  return b[1].PHASE - a[1].PHASE || b[1].OWNED - a[1].OWNED;
}

function sortRarity(a,b){
  return DB[b[0]].RARITY - DB[a[0]].RARITY;
}

function sortConstellation(a,b){
  return b[1].CONSTELLATION - a[1].CONSTELLATION || b[1].OWNED - a[1].OWNED;
}

function setFlip(btn){
  flip = !flip; btn.classList.toggle('flip'); characters();
}

function makeCard(char){
  let [name, state] = char; const info = DB[name];

  const CARD = create(document.getElementById('characters'), 'div',
    {'class':'card c_'+info.RARITY});
  CARD.addEventListener('click', ()=>showInfo(char), false);

  if(state.OWNED){
    const TAG = create(CARD, 'p', {'class':'tag'});
    TAG.textContent = 'C'+ +state.CONSTELLATION;
  }
  else{
    CARD.classList.add('missing');
  }

  const ICON = create(CARD, 'img', {'class':'icon','src':getImage('ELEMENT', info.ELEMENT, 0)})
  ICON.onerror = ()=>this.classList.add('hide');

  let link = name === 'Traveler'? 'traveler_geo': name.toLowerCase().replaceAll(' ','_');
  const IMG = create(CARD, 'img',
    {'class':'image','src': 'https://paimon.moe/images/characters/'+link+'.png'})
  IMG.onerror = ()=>this.classList.add('hide');

  const NAME = create(CARD, 'p', {'class':'name'}); NAME.textContent = name;
}

/*--INFO PAGE--*/
function showInfo(char){
  let [name, state] = char; const info = DB[name];
  document.getElementById('char-menu').classList.add('hide')
  document.getElementById('char').classList.remove('hide')

  let link = name === 'Traveler'? 'traveler_geo': name.toLowerCase().replaceAll(' ','_');
  document.getElementById('char-img').src = 'https://paimon.moe/images/characters/full/'+link+'.png';
  document.getElementById('char').dataset.color = info.ELEMENT;
  
  document.getElementById('NAME').textContent = name;
  document.getElementById('RARITY').classList = 's'+info.RARITY;
  document.getElementById('WEAPON').textContent = info.WEAPON;
  document.getElementById('ELEMENT').src = getImage('ELEMENT', info.ELEMENT, 0);
  
  if(state.OWNED){
    document.getElementById('CONSTELLATION').classList.remove('hide');
    document.getElementById('CONSTELLATION').textContent = 'C'+state.CONSTELLATION;
  } else{
    document.getElementById('CONSTELLATION').classList.add('hide');
    document.getElementById('CONSTELLATION').textContent = '';
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
  let cons = document.getElementById('CONSTELLATION').textContent;
  let value;
  if(cons === 'C6') return;
  else if(cons === ''){
    userChar[name]['OWNED'] = true; value = 0;
  }
  else if(cons !== '' && cons !== 'C6') {
    value = +cons[1] + 1;
  }

  document.getElementById('CONSTELLATION').textContent = 'C' + value;
  userChar[name]['CONSTELLATION'] = value;

  store('Characters', userChar);
  caching('cacheC', userChar[name]['ROW'], userChar[name]);
}

function minus(){
  let name = document.getElementById('NAME').textContent;
  let cons = document.getElementById('CONSTELLATION').textContent;
  let value, string;
  if(cons === '') return;
  else if(cons === 'C0'){
    value = ''; string = ''; userChar[name]['OWNED'] = false;
  }
  else if(cons !== '' && cons !== 'C0') {
    value = +cons[1] - 1; string = 'C' + value;
  }

  document.getElementById('CONSTELLATION').textContent = string;
  userChar[name]['CONSTELLATION'] = value;

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
  
  sessionStorage.set('calc', true); store('Characters', userChar);
  caching('cacheC', userChar[name]['ROW'], userChar[name]);
}

function saveCharacters(){
  store('Characters', userChar); setChar();
}
