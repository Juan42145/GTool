function page(cData, isTotal){
  gc = cData; gt = isTotal;
  mediaQuery.addEventListener('change',handleMedia);
  mediaQuery2.addEventListener('change',handleMedia);
  makePage(cData, isTotal);
}

function makePage(cData, isTotal){
  let [category, items] = cData;

  document.getElementById('home').classList.add('hide');
  let PAGE = document.getElementById('page'); PAGE.classList.remove('hide');

  if(category ==='RESOURCES') isTotal = true;
  if(category ==='COMMON') PAGE.classList.add('page-dets')
  else PAGE.classList.remove('page-dets')

  PAGE = document.getElementById('page-container'); PAGE.innerHTML = '';
  const TBL = create(PAGE, 'div', {'class':'home-tbl tbl-inv','data-total':isTotal})
  
  Object.entries(items).sort(sortOrder(category)).forEach((iData, ii) => {
    let complete = makeRow(TBL, category, iData, ii, true);
    makeInv(TBL, category, iData, ii, complete);
  })

  if(category === 'RESOURCES'){
    let cMora = ['Mora',{'3':0}], tMora = ['Mora',{'3':0}], wMora = ['Mora',{'3':0}];
    Object.values(sessionStorage.get('calculator').CHARACTERS).forEach(char => {
      cMora[1][3] += char.AFARM.MORA[1]? char.AFARM.MORA[1][3]: 0;
      tMora[1][3] += char.TFARM.MORA[1]? char.TFARM.MORA[1][3]: 0;
    })
    Object.values(sessionStorage.get('calculator').WEAPONS).forEach(wpn => {
      wMora[1][3] += wpn.FARM.MORA[1]? wpn.FARM.MORA[1][3]: 0;
    })

    const SEC = create(PAGE, 'div', {'class':'home-sec'})

    const TITLE = create(SEC, 'div', {'class': 'sec-title'})
    TITLE.textContent = 'Mora'

    const DETS = create(SEC, 'div', {'class':'home-tbl morad','data-total':isTotal})
    makeDets(DETS, 'RESOURCES', 'Characters', cMora, 0);
    makeDets(DETS, 'RESOURCES', 'Talents', tMora, 1);
    makeDets(DETS, 'RESOURCES', 'Weapons', wMora, 2);
  }

  if(category === 'COMMON'){
    let common = {'Characters': {}, 'Talents': {}, 'Weapons': {}};
    Object.values(sessionStorage.get('calculator').CHARACTERS).forEach(char => {
      if(char.AFARM.COMMON[1])
        rolling(common, 'Characters', char.AFARM.COMMON[0], char.AFARM.COMMON[1])
      if(char.TFARM.COMMON[1])
        rolling(common, 'Talents', char.TFARM.COMMON[0], char.TFARM.COMMON[1])
    })
    Object.values(sessionStorage.get('calculator').WEAPONS).forEach(wpn => {
      if(wpn.FARM.COMMON[1])
        rolling(common, 'Weapons', wpn.FARM.COMMON[0], wpn.FARM.COMMON[1])
    })

    Object.entries(common).forEach(([section, items]) => {
      const SEC = create(PAGE, 'div', {'class':'home-sec'})

      const TITLE = create(SEC, 'div', {'class':'sec-title'})
      TITLE.textContent = section;

      const DETS = create(SEC, 'div', {'class':'home-tbl','data-total':isTotal})

      Object.entries(items).forEach(([item, materials], ii) => {
        makeDets(DETS, 'ENEMIES', item, [item, materials], ii);
      })
    });
  }
}

function makeInv(TBL, category, iData, ii, complete){
  let cName = category;
  let [item, materials] = iData;
  category = translate(category), item = decode(category, item)
  materials = userInv[category][item];
  let rowi = getComputedStyle(document.getElementById('page')).getPropertyValue('--rowi')
  let coli = getComputedStyle(document.getElementById('page')).getPropertyValue('--coli')

  const ROW = create(TBL, 'div', {'class':'home-row home-inv'})

  if(TBL.dataset.total === 'true') ROW.style = 'grid-row: '+(2*ii + +rowi);
  else ROW.style = 'grid-row: '+(ii+1);

  if(complete) ROW.classList.add('completed');
  else ROW.classList.remove('completed');

  let index = +coli+1;
  Object.entries(materials).reverse().forEach(([rank, value]) => {
    if(rank === '0'){
      /*const TOTAL = create(ROW, 'div', {'class':'home-total home-inv','id':'I_'+item})
      TOTAL.textContent = Math.floor(value).toLocaleString('en-us');*/
    }
    else if(value !== '' && rank !== 'ROW'){
      const CARD = create(ROW, 'div', {'class':'home-item r_'+rank})

      if(TBL.dataset.total === 'true') CARD.style = 'grid-column: '+index;
      else CARD.style = 'grid-column: 5';
      index++;

      const IMG = create(CARD, 'img', {'class':'home-image','src':getImage(category, item, rank)})
      IMG.onerror = ()=>this.classList.add('hide');
      
      const INP = create(CARD, 'input', {
        'type':'text','pattern':'\\d*','value': value, 'data-column':rank})
      INP.addEventListener('change', ()=>{
        if(this.value == '') INP.value = 0;
        
        userInv[category][item][rank] = +INP.value; store('Inventory', userInv);
        caching('cacheI', category + '_' + rank + '_' + materials['ROW'], INP.value);

        recalculate(category, item); makeRow(TBL, cName, iData, ii, true);
      }, false);
      INP.addEventListener('click', (e)=>{focusText(e)})
    }
  });
}

function makeDets(TBL, category, itemName, iData, ii){
  let [item, materials] = iData;
  
  const ROW = create(TBL, 'div', {'class':'home-row dets'})
  ROW.style = 'grid-row: '+(ii+1);

  const NAME = create(ROW, 'div', {'class':'home-name'}); NAME.textContent = itemName;

  let counter = total = 0;
  Object.entries(materials).reverse().forEach(([rank, value], mi) => {
    let index = mi+3;
    total += value/(3**counter); counter++;
    if(!value) return;

    const CARD = create(ROW, 'div', {'class':'home-item r_'+rank});
    CARD.style = 'grid-column: '+index;

    const IMG = create(CARD, 'img', {'class':'home-image','src':getImage(category, item, rank)})
    IMG.onerror = ()=>this.classList.add('hide');

    const NEED = create(CARD, 'p', {});
    NEED.textContent = value.toLocaleString('en-us');
  });
  if(TBL.dataset.total === 'true'){
    const TOTAL = create(ROW, 'div', {'class':'home-total'})

    const NEED = create(TOTAL, 'p');
    NEED.textContent = Math.floor(total*100)/100;
  }
}

function rolling(pivot, category, item, value){
  let flag = Object.values(value).some(v => {
    return v !== 0;
  });
  if(flag) pivot[category][item] = item in pivot[category]? vadd(pivot[category][item], value): value;
}

function closePage(){
  mediaQuery.removeEventListener('change',handleMedia)
  mediaQuery2.removeEventListener('change',handleMedia)
  document.getElementById('home').classList.remove('hide')
  document.getElementById('page').classList.add('hide')
  home();
}

function update(inp){
  document.body.style.setProperty('--filter', inp.checked? 'none': 'contents')
  resize();
}

const mediaQuery = window.matchMedia('(min-width: 880px)')
const mediaQuery2 = window.matchMedia('(min-width: 1020px)')
let gc, gt;
function handleMedia(){
  makePage(gc, gt);
}
