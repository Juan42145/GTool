const DB = sessionStorage.get('DB').DB_Characters;
let userChar = sessionStorage.get('user').Characters;
let owned = flip = false;
let sorting = function(){};

/*CHARACTERS*/
function characters(){
  document.getElementById('characters').innerHTML = '';
  let array = Object.entries(userChar).sort(sorting);
  if(flip) array.reverse();
  array.forEach(c => {
    if(owned){
      if(c[1].OWNED) makeCard(c);
    } else{
      makeCard(c);
    }
  });
}

function filterOwned(btn){
  owned = !owned;
  characters()
  btn.classList.toggle('selected')
}

function getSort(value){
  let sorts = [function(){}, sortName, sortAscension, sortRarity, sortConstellation]
  sorting = sorts[value];
  characters();
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
  flip = !flip;
  characters()
  btn.classList.toggle('flip')
}

function makeCard(c){
  const info = DB[c[0]];

  const CARD = document.createElement('div');
  CARD.classList.add('card');
  CARD.classList.add('c_'+info.RARITY);
  CARD.addEventListener('click', function(){showInfo(c)}, false);
  document.getElementById('characters').append(CARD)

  if(c[1].OWNED){
    const TAG = document.createElement("p");
    TAG.classList = "tag";
    TAG.innerText = 'C'+ +c[1].CONSTELLATION;
    CARD.append(TAG);
  }
  else{
    CARD.classList.add('missing')
  }

  const ICON = document.createElement('img');
  ICON.classList = "icon";
  ICON.onerror = function(){this.classList.add('hide')};
  ICON.src = getImage('ELEMENT', info.ELEMENT, 0);
  CARD.append(ICON);

  const IMG = document.createElement("img")
  IMG.classList = "image";
  IMG.onerror = function(){this.classList.add('hide')};
  CARD.append(IMG);
  
  let link = c[0] === 'Traveler'? 'traveler_geo': c[0].toLowerCase().replaceAll(' ','_');
  IMG.src = "https://paimon.moe/images/characters/"+link+".png";

  const NAME = document.createElement("p");
  NAME.classList= "name";
  NAME.innerText = c[0];
  CARD.append(NAME);
}

function showInfo(c){
  document.getElementById('char-menu').classList.add('hide')
  document.getElementById('char').classList.remove('hide')

  const info = DB[c[0]];
  let link = c[0] === 'Traveler'? 'traveler_geo': c[0].toLowerCase().replaceAll(' ','_');
  document.getElementById('char-img').src = "https://paimon.moe/images/characters/full/"+link+".png";
  document.getElementById('char').dataset.color = info.ELEMENT;
  
  document.getElementById('NAME').textContent = c[0];
  document.getElementById('RARITY').classList = 's'+info.RARITY
  document.getElementById('WEAPON').textContent = info.WEAPON
  document.getElementById('ELEMENT').src = getImage('ELEMENT', info.ELEMENT, 0)
  
  if(c[1].OWNED){
    document.getElementById('CONSTELLATION').classList.remove('hide')
    document.getElementById('CONSTELLATION').textContent = 'C'+c[1].CONSTELLATION;
  } else{
    document.getElementById('CONSTELLATION').classList.add('hide')
    document.getElementById('CONSTELLATION').textContent = '';
  }

  document.getElementById('FARM').checked = c[1].FARM
  document.getElementById('BOSS').src = getImage('BOSSES', info.BOSS, 4)
  document.getElementById('LOCAL').src = getImage('LOCALS', info.LOCAL, 1)
  document.getElementById('COMMON').src = getImage('ENEMIES', info.COMMON, 1)
  document.getElementById('TALENT').src = getImage('BOOKS', info.TALENT, 2)
  document.getElementById('WEEKLY').src = getImage('WEEKLY', info.WEEKLY, 0)
  document.getElementById('DROP').src = getImage('WEEKLYS', info.DROP, 5)

  document.getElementById('PHASE').value = c[1].PHASE
  document.getElementById('TARGET').value = c[1].TARGET
  document.getElementById('NORMAL').value = c[1].NORMAL
  document.getElementById('TNORMAL').value = c[1].TNORMAL
  document.getElementById('SKILL').value = c[1].SKILL
  document.getElementById('TSKILL').value = c[1].TSKILL
  document.getElementById('BURST').value = c[1].BURST
  document.getElementById('TBURST').value = c[1].TBURST

  document.getElementById('STAT').textContent = info.STAT
  document.getElementById('HP').textContent = info.HP
  document.getElementById('ATK').textContent = info.ATK
  document.getElementById('DEF').textContent = info.DEF
  document.getElementById('VALUE').textContent = info.VALUE
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
    userChar[name]['OWNED'] = true;
    value = 0;
  }
  else if(cons !== '' && cons !== 'C6') {
    value = +cons[1] + 1;
  }

  document.getElementById('CONSTELLATION').textContent = 'C' + value;
  userChar[name]['CONSTELLATION'] = value;

  caching('cacheC', userChar[name]['ROW'], userChar[name])

}

function minus(){
  let name = document.getElementById('NAME').textContent;
  let cons = document.getElementById('CONSTELLATION').textContent;
  let value, string;
  if(cons === '') return;
  else if(cons === 'C0'){
    value = '';
    string = '';
    userChar[name]['OWNED'] = false;
  }
  else if(cons !== '' && cons !== 'C0') {
    value = +cons[1] - 1;
    string = 'C' + value;
  }

  document.getElementById('CONSTELLATION').textContent = string;
  userChar[name]['CONSTELLATION'] = value;

  caching('cacheC', userChar[name]['ROW'], userChar[name]);
}

function closeChar(){
  document.getElementById('char-menu').classList.remove('hide')
  document.getElementById('char').classList.add('hide')
  editOut();
  characters();
}

function update(e){
  let name = document.getElementById('NAME').textContent;
  if(e.id === "FARM") userChar[name][e.id] = e.checked;
  else userChar[name][e.id] = e.value;
  
  sessionStorage.set('calc', true);
  caching('cacheC', userChar[name]['ROW'], userChar[name]);

  let user = sessionStorage.get('user');
  user.Characters = userChar;
  sessionStorage.set('user', user);
}

function saveCharacters(){
  let user = sessionStorage.get('user');
  user.Characters = userChar;
  sessionStorage.set('user', user);
  setChar();
}