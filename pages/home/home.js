const DB = sessionStorage.get('DB').DB_Master;
let userInv = sessionStorage.get('user').Inventory;
const REGION = Object.keys(DB.ELEMENT); const D = (new Date()).getDay();

/*HOME*/
function home(){
  if(sessionStorage.get('calc')) calculate();

  Object.entries(sessionStorage.get('pivot')).forEach(cData => {
    let [category, items] = cData;

    if(Object.keys(items).length === 0) return;

    const SEC = document.getElementById(category);
    SEC.classList.remove('hide'); SEC.innerHTML = '';

    const TITLE = create(SEC, 'div', {'class': 'sec-title'});
    TITLE.textContent = category;
    
    let isTotal = SEC.classList.contains('sec-total');
    SEC.addEventListener('click', () => page(cData, isTotal), false);

    const TBL = create(SEC, 'div', {'class':'home-tbl', 'data-total': isTotal})
  
    Object.entries(items).sort(sortOrder(category)).forEach((iData, ii) => {
      makeRow(TBL, category, iData, ii, false);
    });
  });

  resize()
}

function makeRow(TBL, category, iData, ii, isPage){
  let [item, materials] = iData;

  let ROW = document.getElementById('r_'+item)
  if(ROW && isPage) ROW.innerHTML = '';
  else ROW = create(TBL, 'div', {'class':'home-row'})
  
  const NAME = create(ROW, 'div', {'class':'home-name'}); NAME.textContent = item;

  if(isPage && TBL.dataset.total === 'true') {
    ROW.style = 'grid-row: '+(2*ii+1); NAME.style = 'grid-row: '+(2*ii+1)+'/span 2'
  }
  else ROW.style = 'grid-row: '+(ii+1);

  if(isPage) ROW.id = 'r_'+item;
  if(category === 'RESOURCES') ROW.classList.add('long');

  if(category === 'BOOKS' || category === 'TROPHIES' || category === 'WEEKLYS')
    setData(category, item, NAME, isPage);

  let tc = translate(category), ti = decode(category, item);
  let calc = getInventory(tc, ti, materials);
  Object.entries(materials).reverse().forEach(([rank, value], mi) => {
    let index = mi+3;
    if(!value) return
    
    const CARD = create(ROW, 'div', {'class':'home-item r_'+rank})

    if(isPage) CARD.style = 'grid-column: '+index;

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

  if(TBL.dataset.total === 'true'){
    const TOTAL = create(ROW, 'div', {'class':'home-total'})
    if(isPage) TOTAL.style = 'grid-row: '+(2*ii+1)+'/span 2'

    const INV = create(TOTAL, 'p', {'class':'c-inv'})
    INV.textContent = (Math.floor(calc[0]*100)/100).toLocaleString('en-us');;
    const NEED = create(TOTAL, 'p', {'class':'c-need'})
    NEED.textContent = (Math.floor(calc['total']*100)/100).toLocaleString('en-us');;

    if(category == 'BOOKS' || category == 'TROPHIES')
      setData(category, item, TOTAL, isPage);

    if(complete) TOTAL.classList.add('completed');
    else TOTAL.classList.remove('completed');
  }
  return complete;
}

function translate(category){
  return category == 'ELITE' || category == 'COMMON'? 'ENEMIES': category;
}

function decode(category, item){
  return category === 'WEEKLYS'? item.split(' ')[1]: item;
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

function setData(category, item, COMP, isPage){
  let ti = decode(category, item), index = Object.keys(DB[category]).indexOf(ti);
  COMP.classList.add('home-color');
  if(category === 'WEEKLY'){
    COMP.dataset.color = REGION[Math.floor(index/6) + 1];
  } else{
    COMP.dataset.color = REGION[Math.floor(index/3) + 1];
    if(!isPage && D !== 0 && (D-1)%3 !== index%3)
      COMP.parentElement.classList.add('hide');
  }
}

function resize(){
  let r = parseInt(getComputedStyle(document.getElementById('home')).getPropertyValue('grid-auto-rows'))
  let g = parseInt(getComputedStyle(document.getElementById('home')).getPropertyValue('grid-gap'))

  containers = document.getElementsByClassName('home-sec');
  for(x = 0; x < containers.length; x++){
    let section = containers[x]; let cont = section.querySelector('.home-tbl')
    let h = cont? cont.getBoundingClientRect().height+g: 0;
    let calc = Math.ceil((30+h)/(r+g)); section.style.gridRowEnd = `span ${calc}`;
  }
}

function sortOrder(category){
  return function (a,b){
    let tc = translate(category)
    let ta = decode(category, a[0]), tb = decode(category, b[0]);
    let k = Object.keys(userInv[tc]); return k.indexOf(ta) - k.indexOf(tb)
  }
}

function save(){
  store('Inventory', userInv); setInv();
}
