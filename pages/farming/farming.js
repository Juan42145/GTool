let userChar = sessionStorage.get('user').Characters;
let userWpn = sessionStorage.get('user').Weapons;
let userInv = sessionStorage.get('user').Inventory;
let calc;

function farm(){
  if(sessionStorage.get('calc')) calculate(); calc = sessionStorage.get('calculator');
  makeChar(); makeWpn();
}

function makeChar(){
  document.getElementById('Characters').innerHTML = '';
  let characters = document.getElementById('Characters');
  Object.entries(calc.CHARACTERS).forEach(([name, attrs]) => {
    const ROW = create(characters, 'div', 
      {'class':'farm-row','data-color':attrs.ELEMENT})

    const CHAR = create(ROW, 'div', {'class':'farm-char'})
    const ASCN = create(ROW, 'div', {'class':'farm-ascn'})
    const TLNT = create(ROW, 'div', {'class':'farm-tlnt'})

    let link = name === 'Traveler'? 'traveler_geo': name.toLowerCase().replaceAll(' ','_');
    const IMG = create(CHAR, 'img', {'class':'image','src':'https://paimon.moe/images/characters/'+link+'.png'})
    IMG.onerror = ()=>this.classList.add('hide');

    const NAME = create(CHAR, 'div', {'class':'farm-name'}); NAME.textContent = name;

    CHAR.addEventListener('click', (e)=>{makePage(name, true)}, false);

    let char = userChar[name]
    makeInputs(ASCN, name, 'CHARACTERS', 'AFARM', [char.PHASE, char.TARGET]);
    makeInputs(TLNT, name, 'CHARACTERS', 'TFARM',
      [char.NORMAL,char.TNORMAL,char.SKILL,char.TSKILL,char.BURST,char.TBURST,]);

    makeFarm(ASCN, name, 'CHARACTERS', 'AFARM');
    makeFarm(TLNT, name, 'CHARACTERS', 'TFARM');
  });  
}

function makeWpn(){
  document.getElementById('Weapons').innerHTML = '';
  let weapons = document.getElementById('Weapons');
  Object.entries(calc.WEAPONS).forEach(([name, attrs]) => {
    const ROW = create(weapons, 'div', 
      {'class':'farm-row weapons','data-color':attrs.RARITY})

    const WPN = create(ROW, 'div', {'class':'farm-wpn'})
    const WD = create(ROW, 'div', {'class':'farm-wpndata'})

    let link = name.toLowerCase().replaceAll(' ','_').replaceAll('"','').replaceAll("'", '');
    const IMG = create(WPN, 'img', {'class':'image','src':'https://paimon.moe/images/weapons/'+link+'.png'})
    IMG.onerror = ()=>this.classList.add('hide');

    const NAME = create(WPN, 'div', {'class':'farm-name'}); NAME.textContent = name;

    WPN.addEventListener('click', (e)=>{makePage(name, false)}, false);

    let wpn = userWpn[name]
    makeInputs(WD, name, 'WEAPONS', 'FARM', [wpn.PHASE, wpn.TARGET]);
    makeFarm(WD, name, 'WEAPONS', 'FARM');
  });
}

function makeInputs(COMP, name, section, id, values){
  const DIV = create(COMP, 'div', {'class':'farm-inp'})
  let attrNames = values.length === 2? ['PHASE','TARGET']:['NORMAL','TNORMAL','SKILL','TSKILL','BURST','TBURST']
  values.forEach((value,i) => {
    const INP = create(DIV, 'input', {'type':'text','pattern':'\\d*','value': value})
    INP.addEventListener('change', ()=>{
      if(section === 'CHARACTERS') updateC(name, attrNames[i], INP.value);
      if(section === 'WEAPONS') updateW(name, attrNames[i], INP.value);
      makeFarm(COMP, name, section, id);
    }, false);
    INP.addEventListener('click', (e)=>{focusText(e)})
  });
}

function makeFarm(COMP, name, section, id){
  if(sessionStorage.get('calc')) calculate(); calc = sessionStorage.get('calculator');
  
  let FARM = document.getElementById('f_'+id+name.replaceAll(' ','_'))
  if(FARM) FARM.innerHTML = '';
  else FARM = create(COMP, 'div',
    {'class':'farm-farm','id':'f_'+id+name.replaceAll(' ','_')})
  
  Object.entries(calc[section][name][id]).forEach(([category, [item, materials]]) => {
    addTotal = getTotal(category);
    category = translate(category); item = decode(category, item);
    
    const DIV = create(FARM, 'div', {'class':'container'})
    if(addTotal) DIV.classList.add('ct')
    
    if(!materials) return
    let counter = 0, total = 0;
    Object.entries(materials).reverse().forEach(([rank, value]) => {
      if(addTotal){
        total += value/(3**counter); counter++;
      }
      if(value === 0) return;
      DIV.addEventListener('mouseover', ()=>tooltip.show(item))
      DIV.addEventListener('mouseout', ()=>tooltip.hide())
  
      const CARD = create(DIV, 'div', {'class':'item r_'+rank})
  
      const IMG = create(CARD, 'img', {'class':'image','src':getImage(category, item, rank)})
      IMG.onerror = ()=>this.classList.add('hide');
  
      const NEED = create(CARD, 'p', {'class':'need'}); NEED.textContent = value;
    });
    if(addTotal){
      const TOTAL = create(DIV, 'div', {'class':'total'})
      
      const NEED = create(TOTAL, 'p', {'class':'need'});
      NEED.textContent = Math.ceil(total*100)/100;
    }
  });
}

function translate(category){
  let dict = {
    'BOOK': 'BOOKS',
    'TROPHY': 'TROPHIES',
    'EXP': 'RESOURCES',
    'MORA': 'RESOURCES',
    'ORE': 'RESOURCES',
    'GEM': 'GEMS',
    'WEEKLY': 'WEEKLYS',
    'ELITE': 'ENEMIES',
    'BOSS': 'BOSSES',
    'COMMON': 'ENEMIES',
    'LOCAL': 'LOCALS',
  }
  return dict[category];
}

function decode(category, item){
  return category === 'WEEKLYS'? item.split(' ')[1]: item;
}

function getTotal(category){
  let dict = {
    'BOOK': true,
    'TROPHY': true,
    'EXP': false,
    'MORA': false,
    'ORE': false,
    'GEM': true,
    'WEEKLY': false,
    'ELITE': true,
    'BOSS': false,
    'COMMON': true,
    'LOCAL': false,
  }
  return dict[category];
}

function updateC(name, attr, value){
  userChar[name][attr] = value;
  sessionStorage.set('calc', true); store('Characters', userChar);
  caching('cacheC', userChar[name]['ROW'], userChar[name]);
}

function updateW(name, attr, value){
  userWpn[name][attr] = value;
  sessionStorage.set('calc', true); store('Weapons', userWpn);
  caching('cacheW', userWpn[name]['ROW'], userWpn[name]);
}

function save(){
  let user = sessionStorage.get('user');
  user.Characters = userChar;
  user.Weapons = userWpn;
  user.Inventory = userInv;
  sessionStorage.set('user', user);
  setChar(); setWpn();
}
