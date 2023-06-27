const LDB = myStorage.get('DB');
let userChar = myStorage.get('user').Characters;
let userInv = myStorage.get('user').Inventory;
console.log(userInv)
let isShown = false; isLine = false;

function compare(){
  document.getElementById('cols').innerHTML = '';
  document.getElementById('rows').innerHTML = '';
  document.getElementById('table').innerHTML = '';

  let isOwned = document.getElementById('owned').checked;
  let rowi = document.getElementById('row').value.toUpperCase();
  let coli = document.getElementById('col').value.toUpperCase();
  let rows = getHeaders(translate(rowi), true);
  let cols = getHeaders(translate(coli), false);

  if(isShown){
    let nRows = rows.length, nCols = cols.length;
    const TABLE = document.getElementById('table');
    let cells = new Array(nRows);
    for(let r = 0; r <= nRows; r++){
      cells[r] = new Array(nCols);
      for(let c = 0; c <= nCols; c++){
        const DIV = create(TABLE, 'div', {'class':'cell'})
        DIV.style = `grid-column: ${c+3}; grid-row: ${r+3};`
        if(isLine) DIV.classList.add('cell--line');
        cells[r][c] = DIV;
      }
    }
    let totals = [new Array(nRows).fill(0), new Array(nCols).fill(0)]
    getChar(cells, rowi, coli, rows, cols, isOwned, totals);
    makeTotals(cells, nRows, nCols, totals);
  }
}

function translate(category){
  if(category === "BOSS") return "BOSSES";
  else if(category === "WEEKLY") return "WEEKLYS";
  else if(category === "BOOK") return "BOOKS";
  else if(category === "LOCAL") return "LOCALS";
  else return category;
}

function getInv(category, item, rank){
  let i = userInv[category][item]
  if(!i) return ''
  return Math.floor(userInv[category][item][rank]*100)/100
}

function getHeaders(category, isRow){
  let array = 0, rank = 0, isText = false, span = 3, cum = 3, prev = 3;
  let isSet = category == 'LOCALS' || category == 'BOOKS' || category == 'WEEKLYS';
  if(!isRow) isLine = false;

  if(category == '...'){
    if(isRow) return;
    else{ isLine = true; isText= true; array = [undefined];}
  }
  else if(category == 'RARITY'){// COL ONLY
    isLine = true; isText= true; array = [4,5];
  }
  else if(category == 'MODEL'){
    isText = true; array = Object.keys(LDB.DB_Master[category]);
  }
  else if(category == 'COMMON'){
    array = Object.keys(LDB.DB_Master[category]); array.splice(array.indexOf(''),1)
    category = 'ENEMIES'; rank = Object.keys(LDB.DB_Master[category][array[0]])[0];
  }
  else if(category == 'STAT'){
    isText= true; array = Object.keys(LDB.DB_Master[category]);
  }
  else{
    array = Object.keys(LDB.DB_Master[category]);
    rank = Object.keys(LDB.DB_Master[category][array[0]])[0];
  }

  if(category == 'LOCALS') span = {};

  let HEAD;
  if(isRow) HEAD = document.getElementById('rows');
  else HEAD = document.getElementById('cols');
  array.forEach(item => {
    const CARD = create(HEAD, 'div', {'class':'header header--'+(isRow?'row':'col')})

    let inv = ''
    if(category == 'ELEMENT') inv = getInv('GEMS',item,0)
    else if(category == 'BOSSES') inv = getInv(category,item,4)
    else if(category == 'LOCALS') inv = getInv(category,item,1)
    else if(category == 'ENEMIES') inv = getInv(category,item,0)
    else if(category == 'BOOKS') inv = getInv(category,item,0)
    else if(category == 'WEEKLYS') inv = getInv(category,item,5)

    if(isText) CARD.textContent = item;
    else{
      const IMG = create(CARD, 'img', {'class':'header__image','src':getImage(category, item, rank)})
      setError(IMG)
      CARD.addEventListener('mouseover', ()=>tooltip.show(item +' '+ inv))
      CARD.addEventListener('mouseout', ()=>tooltip.hide())
    }

    if(category == 'LOCALS'){
      if(prev !== LDB.DB_Master['SPECIALTIES'][item][0]){
        cum = 1; prev = LDB.DB_Master['SPECIALTIES'][item][0]
      }
      else cum++;
      span[LDB.DB_Master['SPECIALTIES'][item][0]] = cum;
    }
  });

  if(isSet){
    let group = { 'LOCALS': 'REGION', 'BOOKS': 'REGION', 'WEEKLYS': 'WEEKLY BOSS'};
    Object.keys(LDB.DB_Master[group[category]]).forEach((item, i) => {
      if(category == 'LOCALS' && !span[item]) return;
      if(category == 'BOOKS' && Object.keys(LDB.DB_Master['BOOKS']).length/3 <= i) return;

      const CARD = create(HEAD, 'div', {'class':'header header--'+(isRow?'r':'c')+'group'})

      let cStyle = isRow? 'grid-row': 'grid-column'
      if(category == 'LOCALS') CARD.style = cStyle+': span '+span[item];
      else CARD.style = cStyle+': span '+span;

      if(category == 'WEEKLYS'){
        let inv = Object.values(userInv.WEEKLYS)
        let agg = inv[3*i][5] + inv[3*i+1][5] + inv[3*i+2][5]
        CARD.addEventListener('mouseover', ()=>tooltip.show(item +' '+ agg))
        CARD.addEventListener('mouseout', ()=>tooltip.hide())
      }

      const IMG = create(CARD, 'img', {'class':'header__image','src':getImage(group[category], item, 0)})
      setError(IMG)
    });
    HEAD.classList.add('area--group')
    document.getElementById('compare').classList.add(isRow?'compare--rowG':'compare--colG')
  }
  else{
    HEAD.classList.remove('area--group')
    document.getElementById('compare').classList.remove(isRow?'compare--rowG':'compare--colG')
  }

  const CARD = create(HEAD, 'div', {'class':'header header--total header--'+(isRow?'row':'col')})

  if(isRow) isShown = true;
  return array;
}

function getChar(array, lookR, lookC, rHeaders, cHeaders, check, totals){
  let data = LDB.DB_Characters;
  Object.entries(data).forEach(([name, info]) => {
    if(check) if(!userChar[name].OWNED) return;
    let rowi = rHeaders.indexOf(info[lookR]), coli = cHeaders.indexOf(info[lookC])

    if(rowi === -1 || coli === -1) return;
    const CARD = create(array[rowi][coli], 'div', {'class':'card'})
    totals[0][rowi]++; totals[1][coli]++;
    
    const IMG = create(CARD, 'img', {'class':'card__image c_'+info.RARITY,
      'src':getCharacter(name)})
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
  const CARD = create(array[nRows][nCols], 'div')
  array[nRows][nCols].classList = 'total total--sum'
  const TX = create(CARD, 'div'); TX.textContent = totals[0].reduce((a,b)=>(a+b));
}