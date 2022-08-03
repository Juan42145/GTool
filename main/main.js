Storage.prototype.set = function(key, obj){
  return this.setItem(key, JSON.stringify(obj));
}

Storage.prototype.get = function(key){
  return JSON.parse(this.getItem(key));
}

function caching(id, key, value){
  let cache = sessionStorage.get(id); if(!cache) cache = {};
  cache[key] = value; console.log(cache);
  sessionStorage.set(id, cache);
}

/*--NAVBAR--*/
function openNav(){
  const NAV = document.getElementById("nav");
  NAV.style.width = "100%"; NAV.style.left = "0";
}

function closeNav(){
  const NAV = document.getElementById("nav");
  NAV.style.width = "0"; NAV.style.left = "-1rem";
}

/*--IMAGES--*/
function getImage(category, item, rank){
  if(item === '') return 'https://paimon.moe/images/paimon_faq.png';

  if(item === "AMORA" || item === "TMORA") item = "Mora";

  let link = sessionStorage.get('DB').DB_Master[category][item][rank];
  if(link.includes('*')) link = 'paimon.moe/images/paimon_faq.png'
  
  return "https://" + link;
}

/*FOCUS INPUT*/
function focusText(e){
  e.target.setSelectionRange(e.target.value.length, e.target.value.length);
}

/*TOOLTIP*/
var tooltip = function(){
  var id = 'tt'; var top = 3; var left = 3; var maxw = 300; var tt,c,h;
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
      h = parseInt(tt.offsetHeight) + top;
    },
    pos:function(e){
      var u = e.pageY; var l = e.pageX;
      tt.style.top = (u - h) + 'px'; tt.style.left = (l + left) + 'px';
    },
    hide:function(){
      tt.style.opacity = 0; document.onmousemove = null;
    }
  };
}();

/*CALC DATA*/
function calculate(){
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

  const DB = sessionStorage.get('DB'); const user = sessionStorage.get('user');

  Object.keys(user.Characters).forEach(c => {
    if(!user.Characters[c].FARM) return;

    const state = user.Characters[c]; const info = DB.DB_Characters[c];
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

    const state = user.Weapons[w]; const info = DB.DB_Weapons[w];
    const phase = [+state.PHASE, +state.TARGET];
    calculator.WEAPONS[w] = {
      RARITY: info.RARITY,
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

  function calcA(category, [phase, target], item){
    let error = [phase, target].some(i => {return i < 0 || i > 7});
    if(target > phase && !error){
      let p = phase? DB.DB_Calculate.ASCENSION[category][phase]: 0;
      let t = DB.DB_Calculate.ASCENSION[category][target];
      const value = vsub(t, p);
      rollup(category, item, value); return value;
    }
  }

  function calcT(category, talent, item){
    let error = talent.some(t => {return t.some(i => {return i < 0 || i > 10;})});
    if((talent[0][1] || talent[1][1] || talent[2][1]) && !error){
      let v = [0,0,0];
      for(let i = 0; i < 3; i++){
        if(talent[i][1] > talent[i][0]){
          let c = talent[i][0] > 1? DB.DB_Calculate.TALENT[category][talent[i][0]]: 0;
          let t = talent[i][1] > 1? DB.DB_Calculate.TALENT[category][talent[i][1]]: 0;
          v[i] = vsub(t, c);
        }  
      }
      const value = vadd(v[0],v[1],v[2]);
      rollup(category, item, value); return value;
    }
  }

  function calcW(category, [phase, target], item, rarity){
    if(target > phase){
      let p = phase? DB.DB_Calculate[rarity+'WEAPON'][category][phase]: 0;
      let t = DB.DB_Calculate[rarity+'WEAPON'][category][target];
      const value = vsub(t, p);
      category = category === 'ASCENSION'? 'WEAPON': category;
      rollup(category, item, value); return value;
    }
  }

  function rollup(category, item, value){
    let flag = Object.values(value).some(v => {
      return v !== 0;
    });
    if(flag) pivot[category][item] = item in pivot[category]? vadd(pivot[category][item], value): value;
  }
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

/*INVENTORY*/
function recalculate(category, item){
  let counter = 0, total = 0;
  Object.entries(userInv[category][item]).reverse().forEach(([rank, value]) => {
    if(value !== '' && rank !== 'ROW' && rank !== '0'){
      total += value/(3**counter); counter++;
    }
  });
  if(counter > 1){
    document.getElementById('I_'+item).textContent = Math.floor(total).toLocaleString('en-us')
    userInv[category][item][0] = total;
  }
}