const DB = sessionStorage.get('DB');
let userChar = sessionStorage.get('user').Characters;
let isShown = false;
let isLine = false;

function compare(){
  document.getElementById('cols').innerHTML = '';
  document.getElementById('rows').innerHTML = '';
  document.getElementById('table').innerHTML = '';

  let isOwned = document.getElementById('owned').checked;
  let rowi = document.getElementById('row').value.toUpperCase();
  let coli = document.getElementById('col').value.toUpperCase();
  let rows = getRows(translate(rowi));
  let cols = getCols(translate(coli));

  if(isShown){
    let nRows = rows.length;
    let nCols = cols.length;
    const TABLE = document.getElementById('table');
    let cells = new Array(nRows);
    for(let r = 0; r < nRows; r++){
      cells[r] = new Array(nCols);
      for(let c = 0; c < nCols; c++){
        const DIV = document.createElement('div');
        DIV.classList = 'cell';
        DIV.style = `grid-column: ${c+3}; grid-row: ${r+3};`
        TABLE.append(DIV);

        if(isLine) DIV.classList.add('line');

        cells[r][c] = DIV;
      }
    }
  
    getChar(cells, rowi, coli, rows, cols, isOwned);
  }
}

function translate(value){
  if(value === "BOSS") return "BOSSES";
  else if(value === "DROP") return "WEEKLYS";
  else if(value === "TALENT") return "BOOKS";
  else if(value === "LOCAL") return "LOCALS";
  else return value;
}

function getRows(value){
  let array = rank = 0;
  let isText = false;
  let isSet = value == 'LOCALS' || value == 'BOOKS' || value == 'WEEKLYS';
  let span = cum = prev = 3;

  if(value == '...'){
    return;
  }
  else if(value == 'MODEL'){
    isText = true;
    array = Object.keys(DB.DB_Master[value]);
    //rank = Object.keys(DB.DB_Master[value][array[0]])[0];
  }
  else if(value == 'COMMON'){
    array = Object.keys(DB.DB_Master[value]);
    array.splice(array.indexOf(''),1)
    value = 'ENEMIES';
    rank = Object.keys(DB.DB_Master[value][array[0]])[0];
  }
  else if(value == 'STAT'){
    isText= true;
    array = Object.keys(DB.DB_Master[value]);
  }
  else{
    array = Object.keys(DB.DB_Master[value]);
    rank = Object.keys(DB.DB_Master[value][array[0]])[0];
  }

  if(value == 'LOCALS') span = {};

  const ROW = document.getElementById('rows');
  array.forEach(item => {
    const CARD = document.createElement('div');
    CARD.classList = 'row header';
    ROW.append(CARD);

    if(isText) CARD.textContent = item;
    else{
      const IMG = document.createElement("img");
      IMG.classList = "image";
      IMG.onerror = function(){this.classList.add('hide')};
      IMG.src = getImage(value, item, rank);
      CARD.append(IMG);

      CARD.addEventListener('mouseover', ()=>{tooltip.show(item)})
      CARD.addEventListener('mouseout', ()=>{tooltip.hide()})
    }

    if(value == 'LOCALS'){
      if(prev !== DB.DB_Master['LOCAL'][item][0]){
        cum = 1;
        prev = DB.DB_Master['LOCAL'][item][0]
      }
      else cum++;
      span[DB.DB_Master['LOCAL'][item][0]] = cum;
    }
  });

  if(isSet){
    let group = { 'LOCALS': 'REGION', 'BOOKS': 'REGION', 'WEEKLYS': 'WEEKLY'};
    Object.keys(DB.DB_Master[group[value]]).forEach((item, i) => {
      if(value == 'LOCALS' && !span[item]) return;
      if(value == 'BOOKS' && Object.keys(DB.DB_Master['BOOKS']).length/3 <= i) return;

      const CARD = document.createElement('div');
      CARD.classList = 'row-group header';
      ROW.append(CARD);

      if(value == 'LOCALS') CARD.style = `grid-row: span ${span[item]};`
      else CARD.style = `grid-row: span ${span};`

      const IMG = document.createElement("img");
      IMG.classList = "image";
      IMG.onerror = function(){this.classList.add('hide')};
      IMG.src = getImage(group[value], item, 0);
      CARD.append(IMG);
    });
    document.getElementById('compare').classList.add('rowG')
  }
  else document.getElementById('compare').classList.remove('rowG')

  isShown = true;
  return array;
}

function getCols(value){
  let array = rank = 0;
  let isText = isLine = false;
  let isSet = value == 'LOCALS' || value == 'BOOKS' || value == 'WEEKLYS';
  let span = cum = prev = 3;

  if(value == '...'){
    isLine = true;
    isText= true;
    array = [undefined];
  }
  else if(value == 'RARITY'){
    isLine = true;
    isText= true;
    array = [4,5];
  }
  else if(value == 'MODEL'){
    isText = true;
    array = Object.keys(DB.DB_Master[value]);
    //rank = Object.keys(DB.DB_Master[value][array[0]])[0];
  }
  else if(value == 'COMMON'){
    array = Object.keys(DB.DB_Master[value]);
    array.splice(array.indexOf(''),1)
    value = 'ENEMIES';
    rank = Object.keys(DB.DB_Master[value][array[0]])[0];
  }
  else if(value == 'STAT'){
    isText= true;
    array = Object.keys(DB.DB_Master[value]);
  }
  else{
    array = Object.keys(DB.DB_Master[value]);
    rank = Object.keys(DB.DB_Master[value][array[0]])[0];
  }

  if(value == 'LOCALS') span = {};

  const COL = document.getElementById('cols');
  array.forEach(item => {
    const CARD = document.createElement('div');
    CARD.classList = 'col header';
    COL.append(CARD);

    if(isText) CARD.textContent = item;
    else{
      const IMG = document.createElement("img");
      IMG.classList = "image";
      IMG.onerror = function(){this.classList.add('hide')};
      IMG.src = getImage(value, item, rank);
      CARD.append(IMG);

      CARD.addEventListener('mouseover', ()=>{tooltip.show(item)})
      CARD.addEventListener('mouseout', ()=>{tooltip.hide()})
    }

    if(value == 'LOCALS'){
      if(prev !== DB.DB_Master['LOCAL'][item][0]){
        cum = 1;
        prev = DB.DB_Master['LOCAL'][item][0]
      }
      else cum++;
      span[DB.DB_Master['LOCAL'][item][0]] = cum;
    }
  });

  if(isSet){
    let group = { 'LOCALS': 'REGION', 'BOOKS': 'REGION', 'WEEKLYS': 'WEEKLY'};
    Object.keys(DB.DB_Master[group[value]]).forEach((item, i) => {
      if(value == 'LOCALS' && !span[item]) return;
      if(value == 'BOOKS' && Object.keys(DB.DB_Master['BOOKS']).length/3 <= i) return;

      const CARD = document.createElement('div');
      CARD.classList = 'col-group header';
      COL.append(CARD);

      console.log(span)
      if(value == 'LOCALS') CARD.style = `grid-column: span ${span[item]};`
      else CARD.style = `grid-column: span ${span};`

      const IMG = document.createElement("img");
      IMG.classList = "image";
      IMG.onerror = function(){this.classList.add('hide')};
      IMG.src = getImage(group[value], item, 0);
      CARD.append(IMG);
    });
    document.getElementById('compare').classList.add('colG')
  }
  else document.getElementById('compare').classList.remove('colG')

  return array;
}

function getChar(array, lookR, lookC, rHeaders, cHeaders, check){
  let data = DB.DB_Characters;
  Object.entries(data).forEach(character => {
    if(check) if(!userChar[character[0]].OWNED) return;
    let rowi = rHeaders.indexOf(character[1][lookR])
    let coli = cHeaders.indexOf(character[1][lookC])

    if(rowi === -1 || coli === -1) return;
    const CARD = document.createElement('div');
    CARD.classList = 'card';
    array[rowi][coli].append(CARD);
    
    const IMG = document.createElement("img");
    IMG.classList = "char-image";
    IMG.onerror = function(){this.classList.add('hide')};
    CARD.append(IMG);
    IMG.classList.add('c_'+character[1].RARITY);
    
    let link = character[0] === 'Traveler'? 'traveler_geo': character[0].toLowerCase().replaceAll(' ','_');
    IMG.src = "https://paimon.moe/images/characters/"+link+".png";
  });
}