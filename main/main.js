Storage.prototype.set = function(key, obj){
  return this.setItem(key, JSON.stringify(obj));
}

Storage.prototype.get = function(key){
  return JSON.parse(this.getItem(key));
}

myStorage = localStorage;

//Temporary Storage
function store(id, value){
  let user = myStorage.get('user'); user[id] = value;
  myStorage.set('user', user);
}

function caching(id, key, value){
  let cache = myStorage.get(id); if(!cache) cache = {};
  cache[key] = value; console.log(cache);
  myStorage.set(id, cache);
}

//Create Element
function create(parent, element, attr){
  const E = document.createElement(element); parent.append(E);
  if(!attr) return E;
  Object.entries(attr).forEach(([attribute, value]) => {
    E.setAttribute(attribute, value);
  })
  return E;
}

//Insert
function insert(url){
  const INSERT = document.getElementById('insert')
  fetch(url).then(res=>res.text()).then(data=>{INSERT.innerHTML=data})
}

//Import
function imp(){
  const script = document.createElement('script'); document.head.append(script);
  script.setAttribute('src', "../../main/static.js"); 
}
imp()

//Focus Input
function focusText(e){
  e.target.setSelectionRange(e.target.value.length, e.target.value.length);
}

/*--IMAGES--*/
function getImage(category, item, rank){
  if(item === '') return getError();

  let link = myStorage.get('DB').DB_Master[category][item][rank];
  if(link.includes('*')) return getError();
  
  return 'https://' + link;
}

function getError(){
  return 'https://paimon.moe/images/paimon_faq.png';
}

function setError(COMP){
  COMP.onerror = ()=>COMP.src = getError();
}

function getCharacter(name, full=false){
  let t = myStorage.get('code') === 'd'? 'traveler_anemo': 'traveler_geo'
  let link = name === 'Traveler'? t: name.toLowerCase().replaceAll(' ','_');
  if(full) link = 'full/'+link;
  return 'https://paimon.moe/images/characters/'+link+'.png'
}

function getWeapon(name){
  let link = name.toLowerCase().replaceAll(' ','_').replaceAll('"','').replaceAll("'", '');
  return 'https://paimon.moe/images/weapons/'+link+'.png'
}

/*--NAVBAR--*/
function makeNav(active){
  const pages = {
    HOME: '../home/home.html',
    INVENTORY: '../inventory/inventory.html',
    FARMING: '../farming/farming.html',
    CHARACTERS: '../characters/characters.html',
    WEAPONS: '../weapons/weapons.html',
    COMPARE: '../compare/compare.html',
    DOMAINS: '../domains/domains.html',
    DATA: '../data/data.html',
  }

  const NAV = document.getElementById('nav')

  const index = create(NAV,'a',{'href':'../../index.html','class':'nav__btn nav__btn--home'})
  index.innerHTML = '&curren;';
  index.onclick = ()=>myStorage.clear();
  const resin = create(NAV,'button',{'class':'nav__btn nav__btn--resin'})  
  resin.innerHTML = '&there4;';
  const close = create(NAV,'a',{'href':'javascript:void(0)','class':'nav__btn nav__btn--close'})
  close.innerHTML = '&times;';
  close.onclick = ()=>closeNav();

  makeNavDialog(NAV, resin)

  Object.entries(pages).forEach(([page, link]) => {
    let a, f = page == active;
    if(f) a = create(NAV,'a',{'href':'javascript:void(0)','class':'nav-active'});
    else a = create(NAV,'a',{'href':link});
    a.textContent = page;
  });
}

function openNav(){
  const NAV = document.getElementById('nav');
  NAV.style.width = '100%'; NAV.style.left = '0';
}

function closeNav(){
  const NAV = document.getElementById('nav');
  NAV.style.width = '0'; NAV.style.left = '-1rem';
}

/*--NAV DIALOG--*/
function makeNavDialog(CONT, openbtn){
  const dialog = create(CONT,'dialog')
  const closebtn = create(dialog,'button',{'class':'nav__btn dialog--close'})
  closebtn.innerHTML = '&times;';
  closebtn.onclick = ()=>dialog.close();
  openbtn.onclick = ()=>dialog.showModal();

  const results = create(dialog,'div',{'class':'dialog--div'})
  const input = create(dialog,'input',{'type':'text','pattern':'\\d*','class':'dialog--input'})
  input.addEventListener('input',()=>{
    results.innerHTML = '';
    let v = +input.value; 
    resinCalc(results, v, 'init')
    while(v >= 40){
      v-=40;
      resinCalc(results, v, 'loop')
    }
    if(v >= 20){
      v-=20;
      resinCalc(results, v, 'end') 
    }
  }, false);
}

function resinCalc(CONT, value, type){
  let d = new Date();
  if (value < 160) d.setMinutes(d.getMinutes() + 8*(159 - value))
  let day = (new Date()).getDay() == d.getDay()? 'Today': 'Tomorrow';
  let time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })

  const resin = create(CONT,'div',{'class':'resc resc--'+type})
  resin.innerHTML = value
  const full = create(CONT,'div',{'class':'resc resc--'+type})
  full.innerHTML = day + ' ' + time
}

/*--HEADER--*/
function makeHeader(click){
  const HEADER = document.getElementById('header')

  const menu = create(HEADER,'button',{'class':'header__menu'})
  menu.onclick = ()=>openNav(); menu.innerHTML = '&equiv;';

  if(!click) return
  const button = create(HEADER,'div',{'class':'header__button'})
  const icon = create(button,'div',{'class':'header__button--icon'})
  const input = create(button,'input',
  {'class':'header__button--input','type':'button','value':'Save'})
  input.onclick = ()=>click();
  makeDialog()
}

/*--DIALOG--*/
function makeDialog(){
  const dialog = create(document.body,'dialog',{'id': 'dialog', 'class':'alert'})
  dialog.onclick = () => {
    dialog.close()
    dialog.innerHTML = '';
  };
}

/*--TOOLTIP--*/
var tooltip = function(){
  var id = 'tt'; var dy = 3; var dx = 3; var maxw = 300; var tt,c,h,w;
  return{
    show:function(v){
      if(tt == null){
        tt = document.createElement('div'); tt.setAttribute('id',id);
        c = document.createElement('div'); c.setAttribute('id',id + 'cont');
        tt.appendChild(c); document.body.appendChild(tt);
      } 
      tt.style.display = 'block'; tt.style.width = 'auto'; tt.style.opacity = 1;
      c.innerHTML = v; document.onmousemove = this.pos;
      if(tt.offsetWidth > maxw) tt.style.width = maxw + 'px'
      h = parseInt(tt.offsetHeight) + dy;
      w = parseInt(tt.offsetWidth) + dx;
    },
    pos:function(e){
      var u = e.pageY; var l = e.pageX;
      tt.style.top = e.pageY < h? (u + dy) + 'px' :(u - h) + 'px';
      tt.style.left = e.pageX > window.innerWidth - w? (l - w) + 'px' :(l + dx) + 'px';
    },
    hide:function(){
      tt.style.opacity = 0; document.onmousemove = null;
    }
  };
}();

/*--INVENTORY--*/
function recalculate(category, item){
  let counter = 0, total = 0;
  Object.entries(userInv[category][item]).reverse().forEach(([rank, value]) => {
    if(value === '*' || rank === 'ROW' || rank === '0') return
    total += value/(3**counter); counter++;
  });
  if(counter > 1){
    let totalInv = document.getElementById('I_'+item)
    if(totalInv) totalInv.textContent = Math.floor(total).toLocaleString('en-us')
    userInv[category][item][0] = total;
  }
}

/*--CALC DATA--*/
let calcPivot
const DB = myStorage.get('DB');

function calculate(){
  let calculator = {
    'CHARACTERS': {},
    'WEAPONS': {},
  };

  calcPivot = {
    'BOOKS':{},
    'TROPHIES':{},
    'RESOURCES':{},
    'GEMS':{},
    'WEEKLYS':{},
    'ELITE':{},
    'BOSSES':{},
    'COMMON':{},
    'LOCALS':{}
  };

  const user = myStorage.get('user');

  Object.keys(user.Characters).forEach(char => {
    if(!user.Characters[char].FARM) return;

    const state = user.Characters[char]; const info = DB.DB_Characters[char];
    const ascension = [+state.PHASE, +state.TARGET];
    const talent =[[+state.NORMAL, +state.TNORMAL],
      [+state.SKILL, +state.TSKILL],[+state.BURST, +state.TBURST]];
    calculator.CHARACTERS[char] = {
      ELEMENT: info.ELEMENT,
      AFARM: calcCharA(info, ascension, true),
      TFARM: calcCharT(info, talent, true)
    }
  })

  Object.keys(user.Weapons).forEach(wpn => {
    if(!user.Weapons[wpn].FARM) return;

    const state = user.Weapons[wpn]; const info = DB.DB_Weapons[wpn];
    const phase = [+state.PHASE, +state.TARGET];
    calculator.WEAPONS[wpn] = {
      RARITY: info.RARITY,
      FARM: calcWpn(info, phase, true)
    }
  })

  myStorage.set('pivot', calcPivot);
  myStorage.set('calculator', calculator);
  myStorage.set('calc', false);
}

function calcCharA(info, ascension, roll){
  return {
    GEM: [info.ELEMENT, calcA('GEM', ascension, info.ELEMENT, roll)],
    BOSS: [info.BOSS, calcA('BOSS', ascension, info.BOSS, roll)],
    LOCAL: [info.LOCAL, calcA('LOCAL', ascension, info.LOCAL, roll)],
    COMMON: [info.COMMON, calcA('COMMON', ascension, info.COMMON, roll)],
    EXP: ['EXP', calcA('EXP', ascension, 'EXP', roll)],
    MORA: ['Mora', calcA('MORA', ascension, 'Mora', roll)],
  }
}
function calcCharT(info, talent, roll){
  let wb = info['WEEKLY BOSS'] + ' ' +info.WEEKLY;
  return {
    BOOK: [info.BOOK, calcT('BOOK', talent, info.BOOK, roll)],
    COMMON: [info.COMMON, calcT('COMMON', talent, info.COMMON, roll)],
    WEEKLY: [wb, calcT('WEEKLY', talent, wb, roll)],
    MORA: ['Mora', calcT('MORA', talent, 'Mora', roll)],
  }
}
function calcWpn(info, phase, roll){
  return {
    TROPHY: [info.TROPHY, calcW('TROPHY', phase, info.TROPHY, info.RARITY, roll)],
    ELITE: [info.ELITE, calcW('ELITE', phase, info.ELITE, info.RARITY, roll)],
    COMMON: [info.COMMON, calcW('COMMON', phase, info.COMMON, info.RARITY, roll)],
    ORE: ['Ore', calcW('ORE', phase, 'Ore', info.RARITY, roll)],
    MORA: ['Mora', calcW('MORA', phase, 'Mora', info.RARITY, roll)],
  }
}

function calcA(category, [phase, target], item, roll){
  let error = [phase, target].some(i => {return i < 0 || i > 7});
  if(error || phase >= target) return;
  let p = phase? SDB_Calculate.ASCENSION[category][phase]: 0;
  let t = SDB_Calculate.ASCENSION[category][target];
  const value = vsub(t, p);
  if(roll) rollup(category, item, value);
  return value;
}

function calcT(category, talent, item, roll){
  let error = talent.some(t => {return t.some(i => {return i < 0 || i > 10;})});
  if(error || (!talent[0][1] && !talent[1][1] && !talent[2][1])) return;
  let v = [0,0,0];
  for(let i = 0; i < 3; i++){
    if(talent[i][0] < talent[i][1]){
      let c = talent[i][0] > 1? SDB_Calculate.TALENT[category][talent[i][0]]: 0;
      let t = talent[i][1] > 1? SDB_Calculate.TALENT[category][talent[i][1]]: 0;
      v[i] = vsub(t, c);
    }  
  }
  const value = vadd(v[0],v[1],v[2]);
  if(roll) rollup(category, item, value);
  return value;
}

function calcW(category, [phase, target], item, rarity, roll){
  let error = [phase, target].some(i => {return i < 0 || i > 7});
  if(error || phase >= target) return;
  let p = phase? SDB_Calculate[rarity+'WEAPON'][category][phase]: 0;
  let t = SDB_Calculate[rarity+'WEAPON'][category][target];
  const value = vsub(t, p);
  if(roll) rollup(category, item, value);
  return value;
}

function rollup(category, item, value){
  let flag = Object.values(value).some(v => {
    return v !== 0;
  });
  let name = getName(category);
  if(flag) calcPivot[name][item] = item in calcPivot[name]?
    vadd(calcPivot[name][item], value): value;
}

function getName(category){
  let dict = {
    'BOOK': 'BOOKS',
    'TROPHY': 'TROPHIES',
    'EXP': 'RESOURCES',
    'MORA': 'RESOURCES',
    'ORE': 'RESOURCES',
    'GEM': 'GEMS',
    'WEEKLY': 'WEEKLYS',
    'ELITE': 'ELITE',
    'BOSS': 'BOSSES',
    'COMMON': 'COMMON',
    'LOCAL': 'LOCALS',
  }
  return dict[category];
}

function vadd(...objs){
  return objs.reduce((a,b) => {
    for (let k in b) {
      if(b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
    }
    return a;
  }, {});
}

function vsub(a,b){
  return Object.keys(a).reduce((r,i) => {
    r[i] = a[i] - (b[i] || 0);
    return r;
  }, {});
}
