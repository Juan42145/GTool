//const url = 'https://script.google.com/macros/s/AKfycbyV8Y3q9Qm7xbFs_6fMPgX4_Sm-T4Nr37jJgAiPKl_N/dev';
const url = 'https://script.google.com/macros/s/AKfycbwCioh-jh0XCMIi_BwhsIybNf1JWA4hfZQkdfBsFWjjnbLiMSbqNigpG4zTEvqzLPOUhw/exec';

function server(query){
  const script = document.createElement('script'); document.body.append(script);
  script.setAttribute('src', url + '?' + query); 
}

/*--GETTERS--*/
function getDB(){
  server('getDB=handleDB');
}

function getUser(){
  server('getUser=handleUser&user='+myStorage.get('code'));
}

function getAuth(p){
  server('a=handleAuth&p='+p);
}

/*--SETTERS--*/
function setter(string, query){
  let store = JSON.stringify(myStorage.get('cache'+string[0]));
  console.log(string, store);
  if(store == 'null'){
    toasty(`No ${string} to Save`); return;
  }
  toast('Saving '+string); server(query+'&cord='+store);
}

function setInv(){
  setter('Inventory','setInv=handleInv&user='+myStorage.get('code'));
}

function setChar(){
  setter('Characters','setChar=handleChar&user='+myStorage.get('code'));
}

function setWpn(){
  setter('Weapons','setWpn=handleWpn&user='+myStorage.get('code'));
}

/*--HANDLERS--*/
function handleUser(data){
  console.log(data); receiveUser(data);
}

function handleDB(data){
  console.log(data); receiveDB(data);
}

function handleAuth(auth){
  console.log(auth); receiveAuth(auth);
}

function handleInv(){
  toast('Saved Inventory'); myStorage.set('cacheI',null);
}
 
function handleChar(){
  toast('Saved Characters'); myStorage.set('cacheC',null);
}

function handleWpn(){
  toast('Saved Weapons'); myStorage.set('cacheW',null);
}

/*--ALERT--*/
function toast(message){
  let TOAST = document.getElementById('dialog');
  if(!TOAST.open) TOAST.showModal()
  const MSG = create(TOAST, 'div', {'class':'alert__msg'});
  MSG.textContent = message;
}

let timer;
function toasty(message){
  let TOAST = document.getElementById('alerty');
  if(!TOAST) TOAST = create(document.body, 'div', {'id':'alerty','class':'alert alerty'});
  const MSG = create(TOAST, 'div', {'class':'alert__msg'});
  MSG.textContent = message;
  clearTimeout(timer);
  timer = setTimeout(()=>TOAST.remove(),1000)
  setTimeout(()=>MSG.remove(),1000)
}
