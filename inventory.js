let userInv = sessionStorage.get('user').Inventory;

/*INVENTORY*/
function inventory(){
  Object.entries(userInv).forEach(section => {
    const SEC = document.getElementById(section[0])
    const TBL = document.createElement("div");
    TBL.classList = "inv-tbl";
    SEC.append(TBL);
  
    Object.entries(section[1]).forEach((row, ri) => {
      const ROW = document.createElement("div");
      ROW.classList = "inv-row";
      ROW.style = `grid-row: ${(ri+1)};`;
      TBL.append(ROW);

      ROW.append(Object.assign(document.createElement("div"),{
        classList: "inv-name", textContent: row[0],
      }));
      
      Object.entries(row[1]).reverse().forEach((item, i) => {
        if(item[0] === '0'){
          ROW.append(Object.assign(document.createElement("div"),{
            id:row[0], classList: "inv-total", textContent: Math.floor(item[1]).toLocaleString('en-us'),
          }));
        }
        else if(item[1] !== '' && item[0] !== 'ROW'){
          const ITEM = document.createElement("div");
          ITEM.classList = `inv-item r_${item[0]}`;
          ROW.append(ITEM);

          const IMG = document.createElement("img")
          IMG.classList = "inv-image";
          IMG.onerror = function(){this.classList.add('hide')};
          IMG.src = getImage(section[0], row[0], item[0]);
          ITEM.append(IMG);
          
          const INP = Object.assign(document.createElement("input"),{
            type: "text", pattern: "\\d*", value: item[1]
          });
          INP.dataset.column = item[0];
          INP.addEventListener("change", function(){
            //INP.value = parseInt(this.value.replace(/\D/g,''),10).toLocaleString();
            if(this.value == '') INP.value = 0;
            
            userInv[section[0]][row[0]][item[0]] = INP.value;
            recalculate(section[0], row[0]);
            caching('cacheI', section[0] + '_' + item[0] + '_' + row[1]['ROW'], INP.value);
          }, false);
          ITEM.append(INP);
        }
      });
    });
  });
}

function saveInventory(){
  let user = sessionStorage.get('user');
  user.Inventory = userInv;
  sessionStorage.set('user', user);
  setInv();
}