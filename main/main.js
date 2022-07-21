Storage.prototype.set = function(key, obj){
  return this.setItem(key, JSON.stringify(obj));
}

Storage.prototype.get = function(key){
  return JSON.parse(this.getItem(key));
}

/*NAVBAR*/
function openNav(){
  let nav = document.getElementById("nav");
  nav.style.width = "100%";
  nav.style.left = "0";
}

function closeNav(){
  let nav = document.getElementById("nav");
  nav.style.width = "0";
  nav.style.left = "-1rem";
}

/*IMAGES*/
function getImage(section, item, rank){
  if(item === '') return 'https://paimon.moe/images/paimon_faq.png';

  let lookitem = item;
  if(item === "AMORA" || item === "TMORA") lookitem = "Mora";

  let link = sessionStorage.get('DB').DB_Master[section][lookitem][rank];
  if(link.includes('*')) link = 'paimon.moe/images/paimon_faq.png'
  
  return "https://" + link;
}

/*CALC DATA*/
function calculate(){
  console.log('CALCULATING')
  let pivot = {
    'BOOK':{},
    'WEAPON':{},
    'EXP':{},
    'MORA':{},
    'GEM':{},
    'WEEKLY':{},
    'ELITE':{},
    'BOSS':{},
    'COMMON':{},
    'LOCAL':{}
  };

  let calculator = {
    'CHARACTERS': {},
    'WEAPONS': {},
  };

  const DB = sessionStorage.get('DB');
  const user = sessionStorage.get('user');

  Object.keys(user.Characters).forEach(c => {
    if(!user.Characters[c].FARM) return;

    const state = user.Characters[c];
    const info = DB.DB_Characters[c];
    const ascension = [+state.PHASE, +state.TARGET];
    const talent = [[+state.NORMAL, +state.TNORMAL],[+state.SKILL, +state.TSKILL],[+state.BURST, +state.TBURST]];
    calculator.CHARACTERS[c] = {
      ASCENSION: ascension,
      TALENT: talent,
      ELEMENT: info.ELEMENT,
      $GEM: calcA('GEM', ascension, info.ELEMENT),
      BOSS: info.BOSS,
      $BOSS: calcA('BOSS', ascension, info.BOSS),
      LOCAL: info.LOCAL,
      $LOCAL: calcA('LOCAL', ascension, info.LOCAL),
      A_COMMON: info.COMMON,
      $A_COMMON: calcA('COMMON', ascension, info.COMMON),
      BOOK: info.TALENT,
      $BOOK: calcT('BOOK', talent, info.TALENT),
      T_COMMON: info.COMMON,
      $T_COMMON: calcT('COMMON', talent, info.COMMON),
      WEEKLY: info.WEEKLY + ' ' +info.DROP,
      $WEEKLY: calcT('WEEKLY', talent, info.WEEKLY + ' ' +info.DROP),
      $EXP: calcA('EXP', ascension, 'EXP'),
      $A_MORA: calcA('MORA', ascension, 'Mora'),
      $T_MORA: calcT('MORA', talent, 'Mora'),
      $RESIN: 0,
      $TIME: 0,
    }
  })
  Object.keys(user.Weapons).forEach(w => {
    if(!user.Weapons[w].FARM) return;

    const state = user.Weapons[w];
    const info = DB.DB_Weapons[w];
    const phase = [+state.PHASE, +state.TARGET];
    calculator.WEAPONS[w] = {
      PHASE: phase,
      ASCENSION: info.ASCENSION,
      $ASCENSION: calcW('ASCENSION', phase, info.ASCENSION, info.RARITY),
      ELITE: info.ELITE,
      $ELITE: calcW('ELITE', phase, info.ELITE, info.RARITY),
      COMMON: info.COMMON,
      $COMMON: calcW('COMMON', phase, info.COMMON, info.RARITY),
      $CRYSTALS: calcW('EXP', phase, 'Crystals', info.RARITY),
      $MORA: calcW('MORA', phase, 'Mora', info.RARITY),
      $RESIN: 0,
      $TIME: 0,
    }
  })

  sessionStorage.set('pivot', pivot);
  sessionStorage.set('calculator', calculator);
  sessionStorage.set('calc', false);

  function calcA(attribute, ascension, name){
    if(ascension[1] > ascension[0]){
      let p = ascension[0]? DB.DB_Calculate.ASCENSION[attribute][ascension[0]]: 0;
      let t = DB.DB_Calculate.ASCENSION[attribute][ascension[1]];
      const value = vsub(t, p);
      rollup(attribute, name, value);
      return value;
    }
  }

  function calcT(attribute, talent, name){
    if(talent[0][1] || talent[1][1] || talent[2][1]){
      let v = [0,0,0];
      for(let i = 0; i < 3; i++){
        if(talent[i][1] > talent[i][0]){
          let c = talent[i][0] > 1? DB.DB_Calculate.TALENT[attribute][talent[i][0]]: 0;
          let t = DB.DB_Calculate.TALENT[attribute][talent[i][1]];
          v[i] = vsub(t, c);
        }  
      }
      const value = vadd(v[0],v[1],v[2]);
      rollup(attribute, name, value);
      return value;
    }
  }

  function calcW(attribute, phase, name, rarity){
    if(phase[1] > phase[0]){
      let p = phase[0]? DB.DB_Calculate[rarity+'WEAPON'][attribute][phase[0]]: 0;
      let t = DB.DB_Calculate[rarity+'WEAPON'][attribute][phase[1]];
      const value = vsub(t, p);
      attribute = attribute === 'ASCENSION'? 'WEAPON': attribute;
      rollup(attribute, name, value);
      return value;
    }
  }

  function vadd(...objs){
    return objs.reduce((a,b) => {
      for (let k in b) {
        if (b.hasOwnProperty(k))
          a[k] = (a[k] || 0) + b[k];
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

  function rollup(attribute, name, value){
    let flag = Object.values(value).some(v => {
      return v !== 0;
    });
    if(flag) pivot[attribute][name] = name in pivot[attribute]? vadd(pivot[attribute][name], value): value;
  }
}