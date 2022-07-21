let userInv = sessionStorage.get('user').Inventory;

/*HOME*/
function home(){
  if(sessionStorage.get('calc')) calculate();

  Object.entries(sessionStorage.get('pivot')).forEach(section => {
    const SEC = document.getElementById(section[0]);
    if(Object.keys(section[1]).length === 0) return;
    SEC.classList.remove("hide");
    const TBL = document.createElement("div");
    TBL.classList = "home-tbl";
    SEC.append(TBL);
  
    Object.entries(section[1]).forEach((row, ri) => {
      const ROW = document.createElement("div");
      ROW.classList = "home-row";
      ROW.style = `grid-row: ${(ri+1)};`;
      TBL.append(ROW);

      const NAME = document.createElement("div");
      NAME.classList = "home-name";
      NAME.textContent = row[0];
      ROW.append(NAME);

      let [tSec, tRow] = translate(section[0], row[0]);
      let values = getInventory(tSec, tRow, row[1]);

      Object.entries(row[1]).forEach(item => {
        if(item[1]){
          const ITEM = document.createElement("div");
          ITEM.classList = `home-item r_${item[0]}`;
          ROW.append(ITEM);

          const IMG = document.createElement("img");
          IMG.classList = "home-image";
          IMG.onerror = function(){this.classList.add('hide')};
          IMG.src = getImage(tSec, tRow, item[0]);
          ITEM.append(IMG);

          if(row[0] === 'EXP'){
            values[item[0]] = Math.floor(values[0]);
          }
          
          const INV = document.createElement("p");
          INV.classList = "c-inv";
          INV.innerText = values[item[0]];
          const NEED = document.createElement("p");
          NEED.classList= "c-need";
          NEED.innerText = "/" + item[1];

          if(row[0] === 'Mora'){
            const TOTAL = document.createElement("div");
            TOTAL.classList = `home-total`;
            ROW.append(TOTAL);

            if(values[item[0]] >= item[1]) TOTAL.classList.add('completed');
            else TOTAL.classList.remove('completed');

            TOTAL.append(INV);
            TOTAL.append(NEED);
          } else{
            ITEM.append(INV);
            ITEM.append(NEED);
          }

          if(values[item[0]] >= item[1]) ITEM.classList.add('completed');
          else ITEM.classList.remove('completed');
        }
      });

      let complete = ROW.querySelectorAll(".home-item").length <= ROW.querySelectorAll(".completed").length;
      if(complete) NAME.classList.add('completed');
      else NAME.classList.remove('completed');

      if(SEC.parentElement.id === "h-lt"){
        const TOTAL = document.createElement("div");
        TOTAL.classList = `home-total`;
        ROW.append(TOTAL);

        const INV = document.createElement("p");
        INV.classList = "c-inv";
        INV.textContent = Math.floor(values[0]*100)/100;
        TOTAL.append(INV);
        
        const NEED = document.createElement("p");
        NEED.classList = "c-need";
        NEED.textContent = Math.floor(values['total']*100)/100;
        TOTAL.append(NEED);

        if(complete) TOTAL.classList.add('completed');
        else TOTAL.classList.remove('completed');
      }
    });
  });
}

function translate(section, row){
  if(section === "COMMON" || section === "ELITE") return ["ENEMIES", row];
  else if(section === "EXP" || section === "MORA") return ["RESOURCES", row];
  else if(section === "BOSS") return ["BOSSES", row];
  else if(section === "WEEKLY") return [section + "S", row.split(' ')[1]];
  else return [section + "S", row]; 
}
 
function getInventory(section, name, items){
  let inv = userInv[section][name];
  let calc = {...inv};
  let l = Object.keys(items).length-1;
  let agg = 0;

  let flag = 0;
  Object.entries(items).forEach((item, i) => {
    if(item[1] !== 0) flag = item[0];
    if(i < l && item[1] < inv[item[0]]){
      calc[item[0]] = item[1];
      inv[+item[0]+1] += Math.floor(inv[item[0]] - item[1])/3;
    } else{
      calc[item[0]] = Math.floor(inv[item[0]]);
    }
    agg += item[1]/(3**(l - i));
  });
  calc[flag] = Math.floor(inv[flag]);
  calc['total'] = agg;
  return calc;
}