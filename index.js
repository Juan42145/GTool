/*PROCESSING*/
function process(data, store){
  let object = {}
  Object.entries(data).forEach(sheet => {
    if(sheet[1][0]){
      if(typeof(sheet[1][0][0]) !== 'object'){
        object[sheet[0]] = parse(sheet[1], store);
      }
      else{
        let inner = {}
        sheet[1].forEach(table => {
          inner[table[0][0]] = parse(table, store);
        })
        object[sheet[0]] = inner;
      }
    } else{
      let outer = {}
      Object.entries(sheet[1]).forEach(table => {
        let inner = {}
        table[1].forEach(array => {
          inner[array[0][0]] = parse(array, store)
        })
        outer[table[0]] = inner
      });
      object[sheet[0]] = outer;
    }
  });
  return object;
}

function parse(range, storeRow) {
  let headers = range.shift()
  let data = {};
  for(let r in range) {
    const row = {};
    headers.forEach((h, c) => {
      if(c === 0) return;
      row[h] = range[r][c];
    })
    if(storeRow) row["ROW"] = r;
    data[range[r][0]] = row;
  }
  return data;
}

function processInventory(user){
  let inv = user.Inventory;
  Object.entries(inv).forEach(section => {
    Object.entries(section[1]).forEach(row => {
      let counter = total = 0;
      Object.entries(row[1]).reverse().forEach(item => {
        if(item[1] !== '' && item[0] !== 'ROW'){
          total += item[1]/(3**counter);
          counter++;
        }
      });
      if(counter > 1){
        inv[section[0]][row[0]]['0'] = total;
      }
    });
  });
  user.Inventory = inv;
  return user;
}

/*INDEX*/
function init(){
  getDB();
  sessionStorage.set('calc', true);
  preloadImages();
}

function receiveDB(DB){
  sessionStorage.set('DB', process(DB, false));
}

function userData(){
  getUser();
}

function receiveUser(user){
  sessionStorage.set('user', processInventory(process(user, true)));
  window.open("home.html",'_self')
}

/*FORM*/
function login(){
  const P = document.getElementById("password");
  getAuth(P.value);
}

function receiveAuth(isCorrect){
  const P = document.getElementById("password");
  P.value = ''
  if(isCorrect){
    P.blur()
    P.placeholder = 'Loading';
    userData();
  } else{
    P.placeholder = 'Naur';
  }
}

/*IMAGES*/
function preloadImages(){
  Object.entries(sessionStorage.get('DB').DB_Master).forEach(section => {
    Object.entries(section[1]).forEach(item => {
      Object.entries(item[1]).forEach(rank => {        
        if(rank[1].includes('/') && !rank[1].includes('*')){
          (new Image()).src = "https://" + rank[1];
        }
      })
    })
  })
}