const LDB = sessionStorage.get('DB');
let userChar = sessionStorage.get('user').Characters;
let isShown = false; isLine = false;

function domains(){
  document.getElementById('c-cols').innerHTML = '';
  document.getElementById('c-rows').innerHTML = '';
  document.getElementById('c-table').innerHTML = '';

  let isOwned = document.getElementById('owned').checked;
  let rows = getHeaders();

  let nRows = rows.length, nCols = 1;
  const TABLE = document.getElementById('c-table');
  let cells = new Array(nRows);
  for(let r = 0; r <= nRows; r++){
    cells[r] = new Array(nCols);
    for(let c = 0; c <= nCols; c++){
      const DIV = create(TABLE, 'div', {'class':'cell'})
      DIV.style = `grid-column: ${c+3}; grid-row: ${r+3};`
      cells[r][c] = DIV;
    }
  }
  let totals = [new Array(nRows).fill(0), new Array(nCols).fill(0)]
  getChar(cells, rows, isOwned, totals);
  makeTotals(cells, nRows, nCols, totals);
}

function translate(category){
  if(category === "BOSS") return "BOSSES";
  else if(category === "WEEKLY") return "WEEKLYS";
  else if(category === "BOOK") return "BOOKS";
  else if(category === "LOCAL") return "LOCALS";
  else return category;
}

function getHeaders(){
  let array = 0, rank = 0, isText = false, span = 3, cum = 3, prev = 3;
  let isSet = true;
  isLine = true

  //CHAR AND WEAPON
  array = Object.keys(LDB.DB_Master['BOOKS']);
  rank = Object.keys(LDB.DB_Master['BOOKS'][array[0]])[0];
  

  let HEAD;
  HEAD = document.getElementById('c-rows');
  //else HEAD = document.getElementById('c-cols');
  array.forEach(item => {
    const CARD = create(HEAD, 'div', {'class':'row'+' header'})

    const IMG = create(CARD, 'img', {'class':'image','src':getImage('BOOKS', item, rank)})
    setError(IMG)
    CARD.addEventListener('mouseover', ()=>tooltip.show(item))
    CARD.addEventListener('mouseout', ()=>tooltip.hide())
    
  });

    let group = { 'LOCALS': 'REGION', 'BOOKS': 'REGION', 'WEEKLYS': 'WEEKLY BOSS'};
    Object.keys(LDB.DB_Master[group['BOOKS']]).forEach((item, i) => {
      if(Object.keys(LDB.DB_Master['BOOKS']).length/3 <= i) return;

      const CARD = create(HEAD, 'div', {'class':'row'+'-group header'})

      let cStyle = 'grid-row'
      CARD.style = cStyle+': span '+span;

      const IMG = create(CARD, 'img', {'class':'image','src':getImage(group['BOOKS'], item, 0)})
      setError(IMG)
    });
    HEAD.classList.add('group')
    document.getElementById('container').classList.add('rowG')


  const CARD = create(HEAD, 'div', {'class':'row'+' header htotal'})

  return array;
}

function getChar(array, rHeaders, check, totals){
  //(cells, rowi, coli, rows, cols, isOwned, totals);
  let data = LDB.DB_Characters;
  Object.entries(data).forEach(([name, info]) => {
    if(check) if(!userChar[name].OWNED) return;
    let rowi = rHeaders.indexOf(info['BOOK']), coli = 0

    if(rowi === -1 || coli === -1) return;
    const CARD = create(array[rowi][coli], 'div', {'class':'card'})
    totals[0][rowi]++; totals[1][coli]++;
    
    const IMG = create(CARD, 'img', {'class':'char-image c_'+info.RARITY,
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
  array[nRows][nCols].classList = 'total tsum'
  const TX = create(CARD, 'div'); TX.textContent = totals[0].reduce((a,b)=>(a+b));
}