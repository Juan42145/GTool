const DB = sessionStorage.get('DB').DB_Master;
let userInv = sessionStorage.get('user').Inventory;
const REGION = Object.keys(DB.ELEMENT);
const D = (new Date()).getDay();

/*HOME*/
function home(){
  if(sessionStorage.get('calc')) calculate();

  Object.entries(sessionStorage.get('pivot')).forEach(section => {
    const SEC = document.getElementById(section[0]);
    if(Object.keys(section[1]).length === 0) return;

    SEC.classList.remove("hide");
    const TITLE = SEC.firstElementChild;
    SEC.innerHTML = '';
    SEC.append(TITLE);
    
    let isTotal = SEC.classList.contains('sec-total');
    SEC.addEventListener('click', function(){page(section, isTotal)}, false);

    const TBL = document.createElement("div");
    TBL.classList = "home-tbl";
    TBL.dataset.total = isTotal;
    SEC.append(TBL);
  
    Object.entries(section[1]).forEach((row, ri) => {
      makeRow(TBL, section, row, ri, true);
    });
  });

  resize()
}

function makeRow(TBL, section, row, ri, isHide){
  const ROW = document.createElement("div");
  ROW.classList = "home-row";
  TBL.append(ROW);
  
  if(!isHide && TBL.dataset.total === 'true') ROW.style = `grid-row: ${(2*ri+1)};`;
  else ROW.style = `grid-row: ${(ri+1)};`;

  const NAME = document.createElement("div");
  NAME.classList = "home-name";
  NAME.textContent = row[0];

  if(!isHide || row[0] != 'Mora') ROW.append(NAME);
  if(section[0] == 'BOOK' || section[0] == 'WEAPON' || section[0] == 'WEEKLY') setData(section[0], row[0], NAME, isHide);

  let [tSec, tRow] = translate(section[0], row[0]);
  let values = getInventory(tSec, tRow, row[1]);

  Object.entries(row[1]).reverse().forEach((item, i) => {
    let index = i+3;
    if(item[1]){
      const ITEM = document.createElement("div");
      ITEM.classList = `home-item r_${item[0]}`;
      ROW.append(ITEM);

      if(!isHide) ITEM.style = `grid-column: ${index};`;

      const IMG = document.createElement("img");
      IMG.classList = "home-image";
      IMG.onerror = function(){this.classList.add('hide')};
      IMG.src = getImage(tSec, tRow, item[0]);
      ITEM.append(IMG);

      if(row[0] === 'EXP'){
        values[item[0]] = Math.floor(values[0]);
      }
      
      const INV = document.createElement("p");
      INV.classList = "c-inv";
      INV.innerText = values[item[0]].toLocaleString('en-us');
      const NEED = document.createElement("p");
      NEED.classList= "c-need";
      NEED.innerText = "/" + item[1].toLocaleString('en-us');

      if(row[0] === 'Mora'){
        const TOTAL = document.createElement("div");
        TOTAL.classList = `home-total mora`;
        ROW.append(TOTAL);

        if(values[item[0]] >= item[1]) TOTAL.classList.add('completed');
        else TOTAL.classList.remove('completed');

        TOTAL.append(INV);
        TOTAL.append(NEED);
      } else{
        ITEM.append(INV);
        ITEM.append(NEED);
      }

      if(values[item[0]] >= item[1]) ITEM.classList.add('completed');
      else ITEM.classList.remove('completed');
    }
  });

  let complete = ROW.querySelectorAll(".home-item").length <= ROW.querySelectorAll(".completed").length;
  if(complete) NAME.classList.add('completed');
  else NAME.classList.remove('completed');

  if(TBL.dataset.total === 'true'){
    const TOTAL = document.createElement("div");
    TOTAL.classList = `home-total`;
    ROW.append(TOTAL);

    const INV = document.createElement("p");
    INV.classList = "c-inv";
    INV.textContent = Math.floor(values[0]*100)/100;
    TOTAL.append(INV);
    
    const NEED = document.createElement("p");
    NEED.classList = "c-need";
    NEED.textContent = Math.floor(values['total']*100)/100;
    TOTAL.append(NEED);

    if(section[0] == 'BOOK' || section[0] == 'WEAPON') setData(section[0], row[0], TOTAL, isHide);

    if(complete) TOTAL.classList.add('completed');
    else TOTAL.classList.remove('completed');
  }
}

function translate(section, row){
  if(section === "COMMON" || section === "ELITE") return ["ENEMIES", row];
  else if(section === "EXP" || section === "MORA") return ["RESOURCES", row];
  else if(section === "BOSS") return ["BOSSES", row];
  else if(section === "WEEKLY") return [section + "S", row.split(' ')[1]];
  else return [section + "S", row]; 
}
 
function getInventory(section, name, items){
  let inv = {...userInv[section][name]};
  let calc = {...inv};
  let l = Object.keys(items).length-1;
  let agg = 0;

  let flag = 0;
  Object.entries(items).forEach((item, i) => {
    if(item[1] !== 0) flag = item[0];
    if(i < l && item[1] < inv[item[0]]){
      calc[item[0]] = +item[1];
      inv[+item[0]+1] += Math.floor(inv[item[0]] - item[1])/3;
    } else{
      calc[item[0]] = Math.floor(inv[item[0]]);
    }
    agg += item[1]/(3**(l - i));
  });
  calc[flag] = Math.floor(inv[flag]);
  calc['total'] = agg;
  return calc;
}

function setData(section, row, COMP, isHide){
  let [sec, item] = translate(section, row);
  COMP.classList.add('home-color')
  COMP.dataset.color = 'Anemo';
  let index = Object.keys(DB[sec]).indexOf(item);
  if(section === 'WEEKLY'){
    COMP.dataset.color = REGION[Math.floor(index/6) + 1];
  } else{
    COMP.dataset.color = REGION[Math.floor(index/3) + 1];
    if(isHide && D !== 0 && (D-1)%3 !== index%3) COMP.parentElement.classList.add('hide');
  }
}

function resize(){
  let r = parseInt(getComputedStyle(document.getElementById('home')).getPropertyValue('grid-auto-rows'))
  let g = parseInt(getComputedStyle(document.getElementById('home')).getPropertyValue('grid-gap'))

  containers = document.getElementsByClassName('home-sec');
  for(x = 0; x < containers.length; x++){
    let section = containers[x];
    let cont = section.querySelector('.home-tbl')
    let h = cont? cont.getBoundingClientRect().height+g: 0;
    let calc = Math.ceil((30+h)/(r+g));
    section.style.gridRowEnd = `span ${calc}`;
  }
}

function page(section, isTotal){
  makePage(section, isTotal);
  gs = section;
  gt = isTotal;
  mediaQuery.addEventListener('change',handleMedia)
  mediaQuery2.addEventListener('change',handleMedia)
}

function makePage(section, isTotal){
  document.getElementById('home').classList.add('hide')
  const PAGE = document.getElementById('page');
  PAGE.classList.remove('hide')

  if(section[0] ==='EXP') isTotal = true;
  if(section[0] ==='COMMON') PAGE.classList.add('page-dets')
  else PAGE.classList.remove('page-dets')
  
  const CLOSE = PAGE.firstElementChild;
  PAGE.innerHTML = '';
  PAGE.append(CLOSE);
  const TBL = document.createElement("div");
  TBL.classList = "home-tbl tbl-inv";
  TBL.dataset.total = isTotal;
  PAGE.append(TBL);
  
  Object.entries(section[1]).forEach((row, ri) => {
    makeRow(TBL, section, row, ri, false);
    let s = translate(section[0], row[0]);
    makeInv(TBL, s, ri);
  });

  if(section[0] === 'MORA'){
    let cMora = {'3':0}, tMora = {'3':0}, wMora = {'3':0};
    Object.values(sessionStorage.get('calculator').CHARACTERS).forEach(c => {
      cMora[3] += c.$A_MORA? c.$A_MORA[3]: 0;
      tMora[3] += c.$T_MORA? c.$T_MORA[3]: 0;
    })
    Object.values(sessionStorage.get('calculator').WEAPONS).forEach(c => {
      wMora[3] += c.$MORA? c.$MORA[3]: 0;
    })

    const SEC = document.createElement('div')
    SEC.classList = 'home-sec'
    PAGE.append(SEC);

    const TITLE = document.createElement('div');
    TITLE.classList = 'sec-title'
    TITLE.textContent = 'Mora'
    SEC.append(TITLE);

    const DETS = document.createElement("div");
    DETS.classList = "home-tbl morad";
    DETS.dataset.total = isTotal;
    SEC.append(DETS);
    makeDets(DETS, 'RESOURCES', 'Characters', cMora, 0);
    makeDets(DETS, 'RESOURCES', 'Talents', tMora, 1);
    makeDets(DETS, 'RESOURCES', 'Weapons', wMora, 2);
  }

  if(section[0] === 'COMMON'){
    let common = {'Characters': {}, 'Talents': {}, 'Weapons': {}};
    Object.values(sessionStorage.get('calculator').CHARACTERS).forEach(c => {
      if(c.$A_COMMON) rolling(common, 'Characters', c.A_COMMON, c.$A_COMMON)
      if(c.$T_COMMON) rolling(common, 'Talents', c.T_COMMON, c.$T_COMMON)
    })
    Object.values(sessionStorage.get('calculator').WEAPONS).forEach(w => {
      if(w.$COMMON) rolling(common, 'Weapons', w.COMMON, w.$COMMON)
    })

    Object.entries(common).forEach(section => {
      const SEC = document.createElement('div')
      SEC.classList = 'home-sec'
      PAGE.append(SEC);

      const TITLE = document.createElement('div');
      TITLE.classList = 'sec-title'
      TITLE.textContent = section[0]
      SEC.append(TITLE);
      const DETS = document.createElement("div");
      DETS.classList = "home-tbl";
      DETS.dataset.total = isTotal;
      SEC.append(DETS);
      Object.entries(section[1]).forEach((row, ri) => {
        makeDets(DETS, 'ENEMIES', row[0], row[1], ri);
      })
    });
  }
}

function makeInv(TBL, section, ri){
  let row = [section[1], userInv[section[0]][section[1]]]
  let rowi = getComputedStyle(document.getElementById('page')).getPropertyValue('--rowi')
  let coli = getComputedStyle(document.getElementById('page')).getPropertyValue('--coli')

  const ROW = document.createElement("div");
  ROW.classList = "home-row home-inv";
  if(TBL.dataset.total === 'true') ROW.style = `grid-row: ${2*ri + +rowi};`;
  else ROW.style = `grid-row: ${(ri+1)};`;
  TBL.append(ROW);

  let index = +coli+1;
  Object.entries(row[1]).reverse().forEach((item, i) => {
    if(item[0] === '0'){
      ROW.append(Object.assign(document.createElement("div"),{
        id:row[0], classList: "home-total home-inv", textContent: Math.floor(item[1]).toLocaleString('en-us'),
      }));
    }
    else if(item[1] !== '' && item[0] !== 'ROW'){
      const ITEM = document.createElement("div");
      ITEM.classList = `home-item r_${item[0]}`;
      ROW.append(ITEM);
      
      if(TBL.dataset.total === 'true') ITEM.style = `grid-column: ${index};`;
      else ITEM.style = `grid-column: 5;`;
      index++;

      const IMG = document.createElement("img")
      IMG.classList = "home-image";
      IMG.onerror = function(){this.classList.add('hide')};
      IMG.src = getImage(section[0], row[0], item[0]);
      ITEM.append(IMG);
      
      const INP = Object.assign(document.createElement("input"),{
        type: "text", pattern: "\\d*", value: item[1]
      });
      INP.dataset.column = item[0];
      INP.addEventListener("change", function(){
        if(this.value == '') INP.value = 0;
        
        userInv[section[0]][row[0]][item[0]] = +INP.value;
        recalculate(section[0], row[0]);
        caching('cacheI', section[0] + '_' + item[0] + '_' + row[1]['ROW'], INP.value);

        let user = sessionStorage.get('user');
        user.Inventory = userInv;
        sessionStorage.set('user', user);
        makePage(gs,gt)
      }, false);
      INP.addEventListener('click', (e)=>{focusText(e)})
      ITEM.append(INP);
    }
  });
}

function makeDets(TBL, section, name, row, ri){
  const ROW = document.createElement("div");
  ROW.classList = "home-row dets";
  TBL.append(ROW);
  
  ROW.style = `grid-row: ${(ri+1)};`;

  const NAME = document.createElement("div");
  NAME.classList = "home-name";
  NAME.textContent = name;
  ROW.append(NAME);

  let counter = total = 0;
  Object.entries(row).reverse().forEach((item, i) => {
    let index = i+3;
    total += item[1]/(3**counter);
    counter++;
    if(item[1]){
      const ITEM = document.createElement("div");
      ITEM.classList = `home-item r_${item[0]}`;
      ROW.append(ITEM);

      ITEM.style = `grid-column: ${index};`;

      const IMG = document.createElement("img");
      IMG.classList = "home-image";
      IMG.onerror = function(){this.classList.add('hide')};
      ITEM.append(IMG);

      const NEED = document.createElement("p");
      NEED.innerText = item[1].toLocaleString('en-us');

      if(section === 'RESOURCES'){
        IMG.src = getImage(section, 'Mora', item[0]);
        const TOTAL = document.createElement("div");
        TOTAL.classList = `home-total`;
        ROW.append(TOTAL);

        TOTAL.append(NEED);
      } else{
        IMG.src = getImage(section, name, item[0]);
        ITEM.append(NEED);
      }
    }
  });
  if(TBL.dataset.total === 'true'){
    const TOTAL = document.createElement("div");
    TOTAL.classList = `home-total`;
    ROW.append(TOTAL);

    const NEED = document.createElement("p");
    NEED.textContent = Math.floor(total*100)/100;
    TOTAL.append(NEED);
  }
}

function rolling(pivot, attribute, name, value){
  let flag = Object.values(value).some(v => {
    return v !== 0;
  });
  if(flag) pivot[attribute][name] = name in pivot[attribute]? vadd(pivot[attribute][name], value): value;
}


function closePage(){
  mediaQuery.removeEventListener('change',handleMedia)
  mediaQuery2.removeEventListener('change',handleMedia)
  document.getElementById('home').classList.remove('hide')
  document.getElementById('page').classList.add('hide')
  home();
}

function save(){
  let user = sessionStorage.get('user');
  user.Inventory = userInv;
  sessionStorage.set('user', user);
  setInv();
}

const mediaQuery = window.matchMedia('(min-width: 880px)')
const mediaQuery2 = window.matchMedia('(min-width: 1020px)')
let gs, gt;
function handleMedia(){
  makePage(gs, gt);
}