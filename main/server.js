//const url = 'https://script.google.com/macros/s/AKfycbyV8Y3q9Qm7xbFs_6fMPgX4_Sm-T4Nr37jJgAiPKl_N/dev';
const url = 'https://script.google.com/macros/s/AKfycbwCioh-jh0XCMIi_BwhsIybNf1JWA4hfZQkdfBsFWjjnbLiMSbqNigpG4zTEvqzLPOUhw/exec';

/*GETTERS*/
function getDB(){
  const script = document.createElement('script');
  script.setAttribute('src', url + '?getDB=handleDB');
  document.body.append(script);
}

function getUser(){
  const script = document.createElement('script');
  script.setAttribute('src', url + '?getUser=handleUser');
  document.body.append(script);
}

function getAuth(p){
  const script = document.createElement('script');
  script.setAttribute('src', url + `?a=handleAuth&p=${p}`);
  document.body.append(script);
}

/*SETTERS*/
function setInv(){
  let store = JSON.stringify(sessionStorage.get('cacheI'));
  console.log(store)

  const script = document.createElement('script');
  script.setAttribute('src', url + `?setInv=handleInv&cord=${store}`);
  document.body.append(script);
}

function setChar(){
  let store = JSON.stringify(sessionStorage.get('cacheC'));
  console.log(store)
  
  const script = document.createElement('script');
  script.setAttribute('src', url + `?setChar=handleChar&cord=${store}`);
  document.body.append(script);
}

function setWpn(){
  let store = JSON.stringify(sessionStorage.get('cacheW'));
  console.log(store)
  
  const script = document.createElement('script');
  script.setAttribute('src', url + `?setWpn=handleWpn&cord=${store}`);
  document.body.append(script);
}

/*HANDLERS*/
function handleUser(data){
  console.log(data);
  receiveUser(data);
}

function handleDB(data){
  console.log(data);
  receiveDB(data);
}

function handleAuth(isCorrect){
  console.log(isCorrect);
  receiveAuth(isCorrect);
}

function handleInv(){
  toast('Saved Inventory');
  sessionStorage.set('cacheI',{});
}
 
function handleChar(){
  toast('Saved Characters');
  sessionStorage.set('cacheI',{});
}

function handleWpn(){
  toast('Saved Weapons');
  sessionStorage.set('cacheW',{});
}

/*ALERT*/
function toast(message){
  const TOAST = document.createElement('div');
  TOAST.classList = 'alert';
  TOAST.textContent = message;
  document.body.append(TOAST);
  setTimeout(()=>TOAST.remove(),1500)
}
