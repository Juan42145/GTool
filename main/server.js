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
  server('getUser=handleUser&user='+sessionStorage.get('code'));
}

function getAuth(p){
  server('a=handleAuth&p='+p);
}

/*--SETTERS--*/
function setter(string, query){
  let store = JSON.stringify(sessionStorage.get('cache'+string[0]));
  console.log(string, store);
  if(store == 'null'){
    toasty(`No ${string} to Save`); return;
  }
  toast('Saving '+string); server(query+'&cord='+store);
}

function setInv(){
  setter('Inventory','setInv=handleInv&user='+sessionStorage.get('code'));
}

function setChar(){
  setter('Characters','setChar=handleChar&user='+sessionStorage.get('code'));
}

function setWpn(){
  setter('Weapons','setWpn=handleWpn&user='+sessionStorage.get('code'));
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
  toast('Saved Inventory'); sessionStorage.set('cacheI',null);
}
 
function handleChar(){
  toast('Saved Characters'); sessionStorage.set('cacheC',null);
}

function handleWpn(){
  toast('Saved Weapons'); sessionStorage.set('cacheW',null);
}

/*--ALERT--*/
function toast(message){
  const TOAST = create(document.body, 'div', {'id':'alert','class':'alert'});
  const MSG = create(TOAST, 'div', {'class':'alert__msg'});
  MSG.textContent = message;
  setTimeout(()=>TOAST.remove(),1500)
}

function toasty(message){
  const TOAST = create(document.body, 'div', {'id':'alerty','class':'alert alerty'});
  const MSG = create(TOAST, 'div', {'class':'alert__msg'});
  MSG.textContent = message;
  setTimeout(()=>TOAST.remove(),1000)
}
