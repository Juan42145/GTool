/*PROCESSING*/
function process(data, store){
  let object = {}
  Object.entries(data).forEach(sheet => {
    if(typeof(sheet[1][0][0]) !== 'object'){//CHAR WPN
      object[sheet[0]] = parse(sheet[1], store);
    }
    else{//MASTER
      let inner = {}
      sheet[1].forEach(table => {
        inner[table[0][0]] = parse(table, store);
      })
      object[sheet[0]] = inner;
    }
  });
  return object;
}

function parse(range, storeRow) {  
  const headers = range.shift(), data = {};
  let id = headers.indexOf('NAME') === 1? 1: 0;
  for(let r in range) {
    const row = {};
    headers.forEach((h, c) => {
      if(c === id) return;
      row[h] = range[r][c];
    })
    if(storeRow) row['ROW'] = r;
    data[range[r][id]] = row;
  }
  return data;
}

function processInventory(user){
  let inv = user.Inventory;
  Object.entries(inv).forEach(([category, items]) => {
    Object.entries(items).forEach(([item, materials]) => {
      let counter = 0, total = 0;
      Object.entries(materials).reverse().forEach(([rank, value]) => {
        if(value === '*' || rank === 'ROW') return
        total += value/(3**counter); counter++;
      });
      if(counter > 1) inv[category][item]['0'] = total;
    });
  });
  user.Inventory = inv; return user;
}

/*INDEX*/
function init(){
  getDB(); myStorage.set('calc', true);
}

function receiveDB(DB){
  const P = document.getElementById('js-password');
  const L = document.getElementById('js-loading');
  P.classList.remove('hide'); L.classList.add('hide')
  myStorage.set('DB', process(DB, false)); preloadImages();
}

function userData(){
  getUser();
}

function receiveUser(user){
  myStorage.set('user', processInventory(process(user, true)));
  window.open('pages/home/home.html','_self')
}

/*FORM*/
function login(){
  const P = document.getElementById('js-password'); getAuth(P.value);
}

function receiveAuth(auth){
  const P = document.getElementById('js-password'); P.value = '';
  if(auth.AUTH){
    P.blur(); P.placeholder = 'Wait Whore'; myStorage.set('code', auth.USER);
    userData();
  } else{
    P.placeholder = 'Naur';
  }
}

/*IMAGES*/
function preloadImages(){
  Object.entries(myStorage.get('DB').DB_Master).forEach(([category, items]) => {
    Object.entries(items).forEach(([item, materials]) => {
      Object.entries(materials).forEach(([rank, link]) => {        
        if(link.includes('/') && !link.includes('*')){
          (new Image()).src = 'https://' + link;
        }
      })
    })
  })
}
