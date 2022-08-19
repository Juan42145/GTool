function makePageC(name, attrs){
  document.getElementById('farm').classList.add('hide')
  let PAGE = document.getElementById('page'); PAGE.classList.remove('hide');
  
  PAGE = document.getElementById('page-container'); PAGE.innerHTML = '';
  const TBL = create(PAGE, 'div', {'class':'home-tbl'})

  Object.entries(attrs.AFARM).forEach(([category, iData], ii) => {
    let isTotal = getTotal(category);
    if(category ==='EXP' || category ==='Mora') isTotal = true;

    makeRow(TBL, category, iData, ii, isTotal);
    makeInv(TBL, category, iData, ii, isTotal);
  })  
}

function makeRow(TBL, category, iData, ii, isTotal){
  let [item, materials] = iData;

  let ROW = document.getElementById('r_'+item)
  if(ROW) ROW.innerHTML = '';
  else ROW = create(TBL, 'div', {'class':'home-row', 'id':'r_'+item})

  const NAME = create(ROW, 'div', {'class':'home-name'}); NAME.textContent = item;

  //THINK ABOUT DOUBLE SINGLE MIX OR ALL MIX
  /*
  if(isTotal) {
    ROW.style = 'grid-row: '+(2*ii+1); NAME.classList.add('tots')
  }
  else ROW.style = 'grid-row: '+(ii+1);*/
  ROW.style = 'grid-row: '+(ii+1);

  //if(category === 'RESOURCES') ROW.classList.add('long');

  /*
  if(category === 'BOOKS' || category === 'TROPHIES' || category === 'WEEKLYS')
    setData(category, item, NAME, isPage);
  */

  let tc = translate(category), ti = decode(category, item);
  let calc = getInventory(tc, ti, materials); //GET INVENTORY
  Object.entries(materials).reverse().forEach(([rank, value], mi) => {
    let index = mi+3;
    if(!value) return;

    const CARD = create(ROW, 'div', {'class':'home-item r_'+rank})
    CARD.style = 'grid-column: '+index;

    const IMG = create(CARD, 'img', {'class':'home-image','src':getImage(tc,ti,rank)})
    IMG.onerror = ()=>this.classList.add('hide');

    const INV = create(CARD, 'div', {'class':'c-inv p'})
    INV.textContent = calc[rank].toLocaleString('en-us');
    const NEED = create(CARD, 'div', {'class':'c-need p'})
    NEED.textContent = '/' + value.toLocaleString('en-us');

    if(calc[rank] >= value) CARD.classList.add('completed');
    else CARD.classList.remove('completed');
    
  });

  let complete = ROW.querySelectorAll('.home-item').length <= ROW.querySelectorAll('.completed').length;
  if(complete) {NAME.classList.add('completed'); ROW.classList.add('completed')}
  else {NAME.classList.remove('completed'); ROW.classList.remove('completed');}

  if(isTotal){
    const TOTAL = create(ROW, 'div', {'class':'home-total'})
    //if(isPage) TOTAL.classList.add('tots')

    const INV = create(TOTAL, 'p', {'class':'c-inv'})
    INV.textContent = (Math.floor(calc[0]*100)/100).toLocaleString('en-us');;
    const NEED = create(TOTAL, 'p', {'class':'c-need'})
    NEED.textContent = (Math.floor(calc['total']*100)/100).toLocaleString('en-us');;

    /*
    if(category == 'BOOKS' || category == 'TROPHIES')
      setData(category, item, TOTAL, isPage);
    */

    if(complete) TOTAL.classList.add('completed');
    else TOTAL.classList.remove('completed');
  }
}

function getInventory(category, item, materials){
  let inv = {...userInv[category][item]}, calc = {...inv};
  let len = Object.keys(materials).length-1;
  let totals = {}, agg = 0, flag = 0;
  calc[0] = 0;
  Object.entries(materials).forEach(([rank, value], mi) => {
    calc[0] += +calc[rank]/(3**(len - mi)); totals[rank] = calc[0];
    if(value !== 0) flag = rank;
    if(mi < len && value < inv[rank]){
      calc[rank] = +value; inv[+rank+1] += Math.floor(inv[rank] - value)/3;
    } else{
      calc[rank] = Math.floor(inv[rank]);
    }
    agg += value/(3**(len - mi));
  });
  calc[flag] = Math.floor(inv[flag]); calc[0] = totals[flag]; calc['total'] = agg;
  if(item === 'EXP' || item === 'Ore'){
    calc[0] = Math.floor(inv[0]); calc[flag] = Math.floor(inv[0])
  }
  return calc;
}

function makeInv(TBL, category, iData, ii, isTotal){
  let cName = category;
  let [item, materials] = iData;
  category = translate(category), item = decode(category, item)
  materials = userInv[category][item];
  let rowi = getComputedStyle(document.getElementById('page')).getPropertyValue('--rowi')
  let coli = getComputedStyle(document.getElementById('page')).getPropertyValue('--coli')

  const ROW = create(TBL, 'div', {'class':'home-row home-inv'})

  /*
  if(isTotal) ROW.style = 'grid-row: '+(2*ii + +rowi);
  else ROW.style = 'grid-row: '+(ii+1);
  */

  let index = +coli+1;
  Object.entries(materials).reverse().forEach(([rank, value]) => {
    if(value === '' || rank === 'ROW') return

    const CARD = create(ROW, 'div', {'class':'home-item r_'+rank})

    /*
    if(isTotal) CARD.style = 'grid-column: '+index;
    else CARD.style = 'grid-column: 5';
    */CARD.style = 'grid-column: 5';
    index++;

    const IMG = create(CARD, 'img', {'class':'home-image','src':getImage(category, item, rank)})
    IMG.onerror = ()=>this.classList.add('hide');
    
    const INP = create(CARD, 'input', {
      'type':'text','pattern':'\\d*','value': value, 'data-column':rank})
    INP.addEventListener('change', ()=>{
      if(this.value == '') INP.value = 0;
      
      userInv[category][item][rank] = +INP.value; store('Inventory', userInv);
      caching('cacheI', category + '_' + rank + '_' + materials['ROW'], INP.value);

      recalculate(category, item); makeRow(TBL, cName, iData, ii, isTotal);
    }, false);
    INP.addEventListener('click', (e)=>{focusText(e)})
  });
}
