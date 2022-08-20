function makePageC(name, attrs){
  document.getElementById('farm').classList.add('hide')
  let PAGE = document.getElementById('page'); PAGE.classList.remove('hide');
  
  PAGE = document.getElementById('page-container'); PAGE.innerHTML = '';
  
  makeTBL(PAGE, attrs.AFARM, 'A')
  makeTBL(PAGE, attrs.TFARM, 'T')
}

function makePageW(name, attrs){
  document.getElementById('farm').classList.add('hide')
  let PAGE = document.getElementById('page'); PAGE.classList.remove('hide');
  
  PAGE = document.getElementById('page-container'); PAGE.innerHTML = '';
  
  makeTBL(PAGE, attrs.FARM, 'W')
}

function makeTBL(PAGE, source, uid){
  const TBL = create(PAGE, 'div', {'class':'farm-tbl'})
  Object.entries(source).forEach(([category, iData]) => {
    let [item, materials] = iData;
    if(!materials) return;
    let flag = Object.values(materials).some(v => {
      return v !== 0;
    });
    if(!flag) return
    CONT = create(TBL, 'div', {'class':'farm-cont',})
    makeData(CONT, category, item, materials, uid);
    makeInv(CONT, category, item);
  })
}

function makeData(CONT, category, item, materials, uid){
  let ROW = document.getElementById('r_'+uid+item)
  if(ROW) ROW.innerHTML = '';
  else ROW = create(CONT, 'div', {'class':'farm-datarow', 'id':'r_'+uid+item})

  let tc = translate(category), ti = decode(tc, item);
  let calc = getInventory(tc, ti, materials);
  Object.entries(materials).reverse().forEach(([rank, value], mi) => {
    if(!value) return;

    const CARD = create(ROW, 'div', {'class':'home-item r_'+rank})
    CARD.style = 'grid-row: 1; grid-column: '+ (+mi+1);
    if(category === 'MORA') CARD.classList.add('long');

    const IMG = create(CARD, 'img', {'class':'home-image','src':getImage(tc,ti,rank)})
    IMG.onerror = ()=>this.classList.add('hide');

    const INV = create(CARD, 'div', {'class':'c-inv p'})
    INV.textContent = calc[rank].toLocaleString('en-us');
    const NEED = create(CARD, 'div', {'class':'c-need p'})
    NEED.textContent = '/' + value.toLocaleString('en-us');

    if(calc[rank] >= value) CARD.classList.add('completed');
    else CARD.classList.remove('completed');
    
  });

  //let complete = ROW.querySelectorAll('.home-item').length <= ROW.querySelectorAll('.completed').length;
  //if(complete) {NAME.classList.add('completed'); ROW.classList.add('completed')}
  //else {NAME.classList.remove('completed'); ROW.classList.remove('completed');}
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

function makeInv(CONT, category, item){
  let cName = category;
  category = translate(category), item = decode(category, item)
  materials = userInv[category][item];

  let index = 1;
  Object.entries(materials).reverse().forEach(([rank, value]) => {
    if(value === '' || rank === 'ROW' || rank === '0') return
    const CARD = create(CONT, 'div', {'class':'home-item r_'+rank})
    CARD.style = 'grid-row: 2; grid-column: ' +index;
    index++;

    const IMG = create(CARD, 'img', {'class':'home-image','src':getImage(category, item, rank)})
    IMG.onerror = ()=>this.classList.add('hide');
    
    const INP = create(CARD, 'input', {
      'type':'text','pattern':'\\d*','value': value, 'data-column':rank})
    INP.addEventListener('change', ()=>{
      if(this.value == '') INP.value = 0;
      
      userInv[category][item][rank] = +INP.value; store('Inventory', userInv);
      caching('cacheI', category + '_' + rank + '_' + materials['ROW'], INP.value);

      recalculate(category, item); makeData(TBL, cName, iData, ii, isTotal);
    }, false);
    INP.addEventListener('click', (e)=>{focusText(e)})
  });
}

function closePage(){
  document.getElementById('farm').classList.remove('hide')
  document.getElementById('page').classList.add('hide')
  farm();
}
