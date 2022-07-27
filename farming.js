let userChar = sessionStorage.get('user').Characters;
let userWpn = sessionStorage.get('user').Weapons;

function farm(){
  makeChar();
  makeWpn();
}

function makeChar(){
  document.getElementById('Characters').innerHTML = '';
  if(sessionStorage.get('calc')) calculate();
  let calc = sessionStorage.get('calculator');

  let characters = document.getElementById('Characters');
  Object.entries(calc.CHARACTERS).forEach(c => {
    const ROW = document.createElement("div");
    ROW.classList = "farm-row";
    ROW.dataset.color = c[1].ELEMENT;
    characters.append(ROW);

    const CHAR = document.createElement("div");
    CHAR.classList = 'farm-char';
    ROW.append(CHAR);
    const ASC = document.createElement("div");
    ASC.classList = 'farm-asc';
    ROW.append(ASC);
    const TLN = document.createElement("div");
    TLN.classList = 'farm-tln';
    ROW.append(TLN);

    const IMG = document.createElement("img")
    IMG.classList = "image";
    IMG.onerror = function(){this.classList.add('hide')};
    CHAR.append(IMG);

    let link = c[0] === 'Traveler'? 'traveler_geo': c[0].toLowerCase().replaceAll(' ','_');
    IMG.src = "https://paimon.moe/images/characters/"+link+".png";

    const NAME = document.createElement("div");
    NAME.classList = 'farm-name';
    NAME.textContent = c[0];
    CHAR.append(NAME);

    const AINP = document.createElement("div");
    AINP.classList = 'farm-inp';
    ASC.append(AINP);

    AINP.append(makeInput(c[0], c[1].ASCENSION[0], 'PHASE'));
    AINP.append(makeInput(c[0], c[1].ASCENSION[1], 'TARGET'));

    const TINP = document.createElement("div");
    TINP.classList = 'farm-inp';
    TLN.append(TINP);

    TINP.append(makeInput(c[0], c[1].TALENT[0][0], 'NORAL'));
    TINP.append(makeInput(c[0], c[1].TALENT[0][1], 'TNORMAL'));
    TINP.append(makeInput(c[0], c[1].TALENT[1][0], 'SKILL'));
    TINP.append(makeInput(c[0], c[1].TALENT[1][1], 'TSKILL'));
    TINP.append(makeInput(c[0], c[1].TALENT[2][0], 'BURST'));
    TINP.append(makeInput(c[0], c[1].TALENT[2][1], 'TBURST'));

    ASC.append(makeDiv(c,'GEMS','ELEMENT','$GEM', true))
    ASC.append(makeDiv(c,'BOSSES','BOSS','$BOSS', false))
    ASC.append(makeDiv(c,'LOCALS','LOCAL','$LOCAL', false))
    ASC.append(makeDiv(c,'ENEMIES','A_COMMON','$A_COMMON', true))
    ASC.append(makeDiv(c,'RESOURCES','EXP','$EXP', false))
    ASC.append(makeDiv(c,'RESOURCES','Mora','$A_MORA', false))

    TLN.append(makeDiv(c,'BOOKS','BOOK','$BOOK', true))
    TLN.append(makeDiv(c,'ENEMIES','T_COMMON','$T_COMMON', true))
    TLN.append(makeDiv(c,'WEEKLYS','WEEKLY','$WEEKLY', false))
    TLN.append(makeDiv(c,'RESOURCES','Mora','$T_MORA', false))

  });

  function makeInput(char, v, attr){
    const INP = Object.assign(document.createElement("input"),{
      type: "text", pattern: "\\d*", value: v
    });
    INP.addEventListener("change", function(){updateC(char, attr, INP.value)}, false);
    return INP;
  }
  
  function makeDiv(c, sec, name, cat, addTotal){
    if(name === 'EXP' || name == 'Mora') name = name;
    else if(name == 'WEEKLY') name = c[1][name].split(' ')[1];
    else name = c[1][name];
    const DIV = document.createElement('div');
    DIV.classList = 'container';
    if(!c[1][cat] || Object.keys(c[1][cat]).length == 0) return DIV;
    let counter = total = 0;
    Object.entries(c[1][cat]).reverse().forEach(item => {
      if(addTotal){
        total += item[1]/(3**counter);
        counter++;
      }
      if(item[1] === 0) return;
      const CARD = document.createElement('div');
      CARD.classList = `item r_${item[0]}`;
      DIV.append(CARD);
  
      const IMG = document.createElement("img")
      IMG.classList = "image";
      IMG.onerror = function(){this.classList.add('hide')};
      IMG.src = getImage(sec, name, item[0]);
      CARD.append(IMG);
  
      const NEED = document.createElement("p");
      NEED.classList= "need";
      NEED.innerText = item[1];
      CARD.append(NEED)
    });
  
    if(addTotal){
      const TOTAL = document.createElement("div");
      TOTAL.classList = `total`;
      DIV.append(TOTAL);
      
      const NEED = document.createElement("p");
      NEED.classList = "need";
      NEED.textContent = Math.ceil(total*100)/100;
      TOTAL.append(NEED);
    }
  
    return DIV
  }
  
}

function makeWpn(){
  document.getElementById('Weapons').innerHTML = '';
  if(sessionStorage.get('calc')) calculate();
  let calc = sessionStorage.get('calculator');

  let weapons = document.getElementById('Weapons');
  Object.entries(calc.WEAPONS).forEach(w => {
    const ROW = document.createElement("div");
    ROW.classList = "farm-row";
    ROW.dataset.color = w[1].RARITY;
    weapons.append(ROW);

    const WPN = document.createElement("div");
    WPN.classList = 'farm-wpn';
    ROW.append(WPN);
    const WD = document.createElement("div");
    WD.classList = 'farm-wpndata';
    ROW.append(WD);

    const IMG = document.createElement("img")
    IMG.classList = "image";
    IMG.onerror = function(){this.classList.add('hide')};
    WPN.append(IMG);

    let link = w[0].toLowerCase().replaceAll(' ','_').replaceAll('"','').replaceAll("'", '');
    IMG.src = "https://paimon.moe/images/weapons/"+link+".png";

    const NAME = document.createElement("div");
    NAME.classList = 'farm-name';
    NAME.textContent = w[0];
    WPN.append(NAME);

    const INP = document.createElement("div");
    INP.classList = 'farm-inp';
    WD.append(INP);

    INP.append(makeInput(w[0], w[1].PHASE[0], 'PHASE'));
    INP.append(makeInput(w[0], w[1].PHASE[1], 'TARGET'));

    WD.append(makeDiv(w,'WEAPONS','ASCENSION','$ASCENSION', true))
    WD.append(makeDiv(w,'ENEMIES','ELITE','$ELITE', true))
    WD.append(makeDiv(w,'ENEMIES','COMMON','$COMMON', true))
    WD.append(makeDiv(w,'RESOURCES','Crystals','$CRYSTALS', false))
    WD.append(makeDiv(w,'RESOURCES','Mora','$MORA', false))
  });

  function makeInput(wpn, v, attr){
    const INP = Object.assign(document.createElement("input"),{
      type: "text", pattern: "\\d*", value: v
    });
    INP.addEventListener("change", function(){updateW(wpn, attr, INP.value)}, false);
    return INP;
  }
  
  function makeDiv(w, sec, name, cat, addTotal){
    if(name === 'Crystals' || name == 'Mora') name = name;
    else name = w[1][name];
    const DIV = document.createElement('div');
    DIV.classList = 'container';
    if(!w[1][cat]) return DIV;
    let counter = total = 0;
    Object.entries(w[1][cat]).reverse().forEach(item => {
      if(addTotal){
        total += item[1]/(3**counter);
        counter++;
      }
      if(item[1] === 0) return;
      const CARD = document.createElement('div');
      CARD.classList = `item r_${item[0]}`;
      DIV.append(CARD);
  
      const IMG = document.createElement("img")
      IMG.classList = "image";
      IMG.onerror = function(){this.classList.add('hide')};
      IMG.src = getImage(sec, name, item[0]);
      CARD.append(IMG);
  
      const NEED = document.createElement("p");
      NEED.classList= "need";
      NEED.innerText = item[1];
      CARD.append(NEED)
    });
  
    if(addTotal){
      const TOTAL = document.createElement("div");
      TOTAL.classList = `total`;
      DIV.append(TOTAL);
      
      const NEED = document.createElement("p");
      NEED.classList = "need";
      NEED.textContent = Math.ceil(total*100)/100;
      TOTAL.append(NEED);
    }
  
    return DIV
  }
  
}

function updateC(char, attr, value){
  userChar[char][attr] = value;
  
  sessionStorage.set('calc', true);
  caching('cacheC', userChar[char]['ROW'], userChar[char]);
  
  let user = sessionStorage.get('user');
  user.Characters = userChar;
  sessionStorage.set('user', user);
  console.log(char, attr, value, sessionStorage.get('user'));
  makeChar();
}

function updateW(wpn, attr, value){
  userWpn[wpn][attr] = value;
  
  sessionStorage.set('calc', true);
  caching('cacheW', userWpn[wpn]['ROW'], userWpn[wpn]);
  
  let user = sessionStorage.get('user');
  user.Weapons = userWpn;
  sessionStorage.set('user', user);
  console.log(wpn, attr, value, sessionStorage.get('user'));
  makeWpn();
}

function save(){
  let user = sessionStorage.get('user');
  user.Characters = userChar;
  user.Weapons = userWpn;
  sessionStorage.set('user', user);
  setChar();
  setWpn();
}
