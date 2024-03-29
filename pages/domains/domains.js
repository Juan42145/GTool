const LDB = myStorage.get('DB');
let userChar = myStorage.get('user').Characters;
let userWpn = myStorage.get('user').Weapons;
let userInv = myStorage.get('user').Inventory;
let isShown = false; isLine = false;

function domains(){
  makeTable(true);
  makeTable(false);
}

function makeTable(isChar){
  let id = isChar? 'c-': 'w-';
  document.getElementById(id+'rows').innerHTML = '';
  document.getElementById(id+'table').innerHTML = '';

  let isOwned = document.getElementById('owned').checked;
  let rows = getHeaders(isChar);

  let nRows = rows.length, nCols = 1;
  const TABLE = document.getElementById(id+'table');
  let cells = new Array(nRows);
  for(let r = 0; r <= nRows; r++){
    cells[r] = new Array(nCols);
    for(let c = 0; c <= nCols; c++){
      const DIV = create(TABLE, 'div', {'class':'cell'})
      DIV.style = `grid-column: ${c+3}; grid-row: ${r+1};`
      cells[r][c] = DIV;
    }
  }
  let totals = [new Array(nRows).fill(0), new Array(nCols).fill(0)]
  if(isChar) getChar(cells, rows, isOwned, totals);
  else getWpn(cells, rows, isOwned, totals);

  TABLE.parentElement.style.setProperty('--maxChildren', Math.max(...totals[0]))


  makeTotals(cells, nRows, nCols, totals);
}

function getHeaders(isChar){
  let array = 0, rank = 0;
  let id = isChar? 'c-': 'w-', name = isChar? 'BOOKS': 'TROPHIES';

  array = Object.keys(LDB.DB_Master[name]).filter(setData);
  rank = Object.keys(LDB.DB_Master[name][array[0]])[0];

  let HEAD = document.getElementById(id+'rows');
  array.forEach(item => {
    const CARD = create(HEAD, 'div', {'class':'header'})
    const IMG = create(CARD, 'img', {'class':'header__image','src':getImage(name, item, rank)})
    setError(IMG)
    CARD.addEventListener('mouseover', ()=>tooltip.show(item + ' ' + getInv(name,item)))
    CARD.addEventListener('mouseout', ()=>tooltip.hide())
  });

  Object.keys(LDB.DB_Master['REGION']).forEach((item, i) => {
    if(Object.keys(LDB.DB_Master[name]).length/3 <= i) return;
    const CARD = create(HEAD, 'div', {'class':'header header--group'})
    CARD.style = `grid-row: span ${D === 0? 3: 1};`
    const IMG = create(CARD, 'img', {'class':'header__image','src':getImage('REGION', item, 0)})
    setError(IMG)
  });

  const CARD = create(HEAD, 'div', {'class':'header htotal'})
  return array;
}

function getChar(array, rHeaders, check, totals){
  let data = LDB.DB_Characters;
  Object.entries(data).forEach(([name, info]) => {
    if(check) if(!userChar[name].OWNED) return;
    let rowi = rHeaders.indexOf(info['BOOK'])

    if(rowi === -1) return;
    const CARD = create(array[rowi][0], 'div', {'class':'card'})
    totals[0][rowi]++; totals[1][0]++;
    
    const IMG = create(CARD, 'img', {'class':'card_image c_'+info.RARITY,
      'src':getCharacter(name)})
    setError(IMG)
  });
  array
}

function getWpn(array, rHeaders, check, totals){
  let data = LDB.DB_Weapons;
  Object.entries(data).forEach(([name, info]) => {
    if(check) if(!userWpn[name].OWNED || LDB.DB_Weapons[name].RARITY == 3) return;
    let rowi = rHeaders.indexOf(info['TROPHY'])

    if(rowi === -1) return;
    const CARD = create(array[rowi][0], 'div', {'class':'card'})
    totals[0][rowi]++; totals[1][0]++;

    CARD.addEventListener('mouseover', ()=>tooltip.show(name))
    CARD.addEventListener('mouseout', ()=>tooltip.hide())
    
    const IMG = create(CARD, 'img', {'class':'card_image c_'+info.RARITY,
      'src':getWeapon(name)})
    setError(IMG)
  });
}

function makeTotals(array, nRows, nCols, totals){
  for(let r = 0; r < nRows; r++){
    const CARD = create(array[r][nCols], 'div')
    array[r][nCols].classList = 'total'
    const TX = create(CARD, 'div'); TX.textContent = totals[0][r];
  }
  for(let c = 0; c < nCols; c++){
    const CARD = create(array[nRows][c], 'div')
    array[nRows][c].classList = 'total'
    const TX = create(CARD, 'div'); TX.textContent = totals[1][c];
  }
  array[nRows][nCols].classList = 'total--sum'
}

const D = (new Date()).getDay();
function setData(value, index){
  if(D === 0 || (D-1)%3 === index%3) return value
}

function getInv(category, item){
  let i = userInv[category][item]
  if(!i) return ''
  return Math.floor(userInv[category][item][0]*100)/100
}