const LDB = sessionStorage.get('DB').DB_Characters;
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
  return LDB[b[0]].RARITY - LDB[a[0]].RARITY;
}

function sortConstellation(a,b){
  return b[1].CONSTELLATION - a[1].CONSTELLATION || b[1].OWNED - a[1].OWNED;
}

function setFlip(btn){
  flip = !flip; btn.classList.toggle('flip'); characters();
}

function makeCard(char){
  let [name, state] = char; const info = LDB[name];

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
  setError(ICON)

  let link = name === 'Traveler'? getTraveler(): name.toLowerCase().replaceAll(' ','_');
  const IMG = create(CARD, 'img',
    {'class':'image','src': 'https://paimon.moe/images/characters/'+link+'.png'})
  setError(IMG)

  const NAME = create(CARD, 'p', {'class':'name'}); NAME.textContent = name;
}

function save(){
  store('Characters', userChar); setChar();
}
