const LDB = sessionStorage.get('DB');
let userChar = sessionStorage.get('user').Characters;
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
    let nRows = rows.length; nCols = cols.length;
    const TABLE = document.getElementById('table');
    let cells = new Array(nRows);
    for(let r = 0; r < nRows; r++){
      cells[r] = new Array(nCols);
      for(let c = 0; c < nCols; c++){
        const DIV = create(TABLE, 'div', {'class':'cell'})
        DIV.style = `grid-column: ${c+3}; grid-row: ${r+3};`
        if(isLine) DIV.classList.add('line');
        cells[r][c] = DIV;
      }
    }
    getChar(cells, rowi, coli, rows, cols, isOwned);
  }
}

function translate(category){
  if(category === "BOSS") return "BOSSES";
  else if(category === "WEEKLY") return "WEEKLYS";
  else if(category === "BOOK") return "BOOKS";
  else if(category === "LOCAL") return "LOCALS";
  else return category;
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
    const CARD = create(HEAD, 'div', {'class':(isRow?'row':'col')+' header'})

    if(isText) CARD.textContent = item;
    else{
      const IMG = create(CARD, 'img', {'class':'image','src':getImage(category, item, rank)})
      IMG.onerror = ()=>this.classList.add('hide');
      CARD.addEventListener('mouseover', ()=>tooltip.show(item))
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

      const CARD = create(HEAD, 'div', {'class':(isRow?'row':'col')+'-group header'})

      let cStyle = isRow? 'grid-row': 'grid-column'
      if(category == 'LOCALS') CARD.style = cStyle+': span '+span[item];
      else CARD.style = cStyle+': span '+span;

      const IMG = create(CARD, 'img', {'class':'image','src':getImage(group[category], item, 0)})
      IMG.onerror = ()=>this.classList.add('hide');
    });
    document.getElementById('compare').classList.add(isRow?'rowG':'colG')
  }
  else document.getElementById('compare').classList.remove(isRow?'rowG':'colG')


  if(isRow) isShown = true;
  return array;
}

function getChar(array, lookR, lookC, rHeaders, cHeaders, check){
  let data = LDB.DB_Characters;
  Object.entries(data).forEach(([name, info]) => {
    if(check) if(!userChar[name].OWNED) return;
    let rowi = rHeaders.indexOf(info[lookR]), coli = cHeaders.indexOf(info[lookC])

    if(rowi === -1 || coli === -1) return;
    const CARD = create(array[rowi][coli], 'div', {'class':'card'})
    
    let link = name === 'Traveler'? 'traveler_geo': name.toLowerCase().replaceAll(' ','_');
    const IMG = create(CARD, 'img', {'class':'char-image c_'+info.RARITY,
      'src':'https://paimon.moe/images/characters/'+link+'.png'})
    IMG.onerror = ()=>this.classList.add('hide');
  });
}