let LDB = sessionStorage.get('DB');
let gn, gb;

function makePage(name, isChar){
  document.getElementById('farm').classList.add('hide')
  let PAGE = document.getElementById('page'); PAGE.classList.remove('hide');

  if(sessionStorage.get('calc')) calculate(); calc = sessionStorage.get('calculator');
  attrs = isChar? calc.CHARACTERS[name]: calc.WEAPONS[name]
  PAGE.dataset.color = isChar? attrs.ELEMENT: attrs.RARITY;
  PAGE = document.getElementById('page-container'); PAGE.innerHTML = '';
  gn = name, gb = isChar;
  if(isChar){
    makeTBL(PAGE, attrs.AFARM, true)
    levelChar(PAGE, name)
    makeTBL(PAGE, attrs.TFARM, true)
    levelTln(PAGE, name)
  } else{
    makeTBL(PAGE, attrs.FARM, true)
    levelWpn(PAGE, name)
  }
}

function makeTBL(PAGE, source, isInv){
  const TBL = create(PAGE, 'div', {'class':'farm-tbl'})
  if(!isInv) TBL.classList.add('farm-level')
  let complete = true, content = false;
  Object.entries(source).forEach(([category, iData]) => {
    let [item, materials] = iData;
    if(!materials) return;
    let flag = Object.values(materials).some(v => {
      return v !== 0;
    });
    if(!flag) return
    content = true;
    CONT = create(TBL, 'div', {'class':'farm-cont',})
    let c = makeData(CONT, category, item, materials, isInv);
    complete &&= c;
    if(isInv) makeInv(CONT, category, item);
  })
  return complete && content
}

function makeData(CONT, category, item, materials, isInv){
  const ROW = create(CONT, 'div', {'class':'farm-datarow'})

  let tc = translate(category), ti = decode(tc, item);
  let calc = isInv? getInventory(tc, ti, materials): userInv[tc][ti];
  Object.entries(materials).reverse().forEach(([rank, value], mi) => {
    if(!value) return;

    const CARD = create(ROW, 'div', {'class':'farm-item r_'+rank})
    CARD.style = 'grid-row: 1; grid-column: '+ (+mi+1);
    if(category === 'MORA') CARD.classList.add('long');

    const IMG = create(CARD, 'img', {'class':'farm-image','src':getImage(tc,ti,rank)})
    IMG.onerror = ()=>this.classList.add('hide');

    const INV = create(CARD, 'div', {'class':'c-inv p'})
    INV.textContent = calc[rank].toLocaleString('en-us');
    const NEED = create(CARD, 'div', {'class':'c-need p'})
    NEED.textContent = '/' + value.toLocaleString('en-us');

    if(calc[rank] >= value) CARD.classList.add('completed');
    else CARD.classList.remove('completed');
    
  });

  let complete = ROW.querySelectorAll('.farm-item').length <= ROW.querySelectorAll('.completed').length;
  return complete;
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
  category = translate(category), item = decode(category, item)
  let materials = userInv[category][item];

  let index = 1;
  Object.entries(materials).reverse().forEach(([rank, value]) => {
    if(value === '' || rank === 'ROW' || rank === '0') return
    const CARD = create(CONT, 'div', {'class':'farm-item r_'+rank})
    CARD.style = 'grid-row: 2; grid-column: ' +index;
    index++;

    const IMG = create(CARD, 'img', {'class':'farm-image','src':getImage(category, item, rank)})
    IMG.onerror = ()=>this.classList.add('hide');
    
    const INP = create(CARD, 'input', {
      'type':'text','pattern':'\\d*','value': value, 'data-column':rank})
    INP.addEventListener('change', ()=>{
      if(this.value == '') INP.value = 0;
      
      userInv[category][item][rank] = +INP.value; store('Inventory', userInv);
      caching('cacheI', category + '_' + rank + '_' + materials['ROW'], INP.value);

      recalculate(category, item); makePage(gn,gb);
    }, false);
    INP.addEventListener('click', (e)=>{focusText(e)})
  });
}

function levelChar(PAGE, name){
  const state = userChar[name]; const info = LDB.DB_Characters[name];
  let start = +state.PHASE, end = (start+1) <= +state.TARGET? start+1: +state.TARGET;
  let calc = calcCharA(info, [start,end], false)
  makeLevel(PAGE, calc, 'PHASE')
}

function levelTln(PAGE, name){
  const state = userChar[name]; const info = LDB.DB_Characters[name];
  let start, end, calc;
  start = state.NORMAL? +state.NORMAL: 1;
  end = (start+1) <= +state.TNORMAL? start+1: +state.TNORMAL;
  calc = calcCharT(info, [[start,end],[0,0],[0,0]], false);
  makeLevel(PAGE, calc, 'NORMAL')
  start = state.SKILL? +state.SKILL: 1;
  end = (start+1) <= +state.TSKILL? start+1: +state.TSKILL;
  calc = calcCharT(info, [[0,0],[start,end],[0,0]], false);
  makeLevel(PAGE, calc, 'SKILL')
  start = state.BURST? +state.BURST: 1;
  end = (start+1) <= +state.TBURST? start+1: +state.TBURST;
  calc = calcCharT(info, [[0,0],[0,0],[start,end]], false);
  makeLevel(PAGE, calc, 'BURST')
}

function levelWpn(PAGE, name){
  const state = userWpn[name]; const info = LDB.DB_Weapons[name];
  let start = +state.PHASE, end = (start+1) <= +state.TARGET? start+1: +state.TARGET;
  let calc = calcWpn(info, [start,end], false)
  makeLevel(PAGE, calc, 'PHASE')
}

function makeLevel(PAGE, calc, attr){
  let isComplete = makeTBL(PAGE, calc, false)
  if(!isComplete) return
  const BTN = create(PAGE, 'button', {'class':'farm-lvlbtn'})
  BTN.textContent = 'Level Up '+attr;
  BTN.addEventListener('click', ()=>{consume(calc, attr)})
}

function consume(calc, attr){
  Object.entries(calc).forEach(([category, [item, materials]]) => {
    category = translate(category), item = decode(category, item)
    let inv = userInv[category][item];
    Object.entries(materials).forEach(([rank, value]) => {
      if(value) inv[rank] -= value
    })
  })
  if(gb) incrementC(attr)
  else incrementW(attr)
  toasty('Leveled Up '+attr)
  makePage(gn,gb);
}

function incrementC(attr){
  if(attr !== 'PHASE' && !userChar[gn][attr]) userChar[gn][attr] = 1;
  userChar[gn][attr]++;
  sessionStorage.set('calc', true); store('Characters', userChar);
  caching('cacheC', userChar[gn]['ROW'], userChar[gn]);
}

function incrementW(attr){
  userWpn[gn][attr]++;
  sessionStorage.set('calc', true); store('Weapons', userWpn);
  caching('cacheW', userWpn[gn]['ROW'], userWpn[gn]);
}

function closePage(){
  document.getElementById('farm').classList.remove('hide')
  document.getElementById('page').classList.add('hide')
  farm();
}
