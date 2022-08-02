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
  server('getUser=handleUser');
}

function getAuth(p){
  server('a=handleAuth&p='+p);
}

/*--SETTERS--*/
function setter(string, query){
  let store = JSON.stringify(sessionStorage.get('cache'+string[0]));
  console.log(store);
  if(store == 'null'){
    toast(`No ${string} to Save`); return;
  }
  toast('Saving '+string); server(query+'&cord='+store);
}

function setInv(){
  setter('Inventory','setInv=handleInv');
}

function setChar(){
  setter('Characters','setChar=handleChar');
}

function setWpn(){
  setter('Weapons','setWpn=handleWpn');
}

/*--HANDLERS--*/
function handleUser(data){
  console.log(data); receiveUser(data);
}

function handleDB(data){
  console.log(data); receiveDB(data);
}

function handleAuth(isCorrect){
  console.log(isCorrect); receiveAuth(isCorrect);
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
  const TOAST = document.createElement('div'); document.body.append(TOAST);
  TOAST.classList = 'alert'; TOAST.textContent = message;
  setTimeout(()=>TOAST.remove(),1500)
}
