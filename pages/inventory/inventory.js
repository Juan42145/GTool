let userInv = sessionStorage.get('user').Inventory;

makeNav('INVENTORY')
/*INVENTORY*/
function inventory(){
  Object.entries(userInv).forEach(([category, items]) => {
    const SEC = document.getElementById(category);

    const TITLE = create(SEC, 'div', {'class': 'sec-title'});
    TITLE.textContent = category;

    const TBL = create(SEC, 'div', {'class':'inv-tbl'});
  
    Object.entries(items).forEach(([item, materials], ii) => {
      const ROW = create(TBL, 'div', {'class':'inv-row'})
      ROW.style = 'grid-row: '+(ii+1);

      const NAME = create(ROW, 'div', {'class':'inv-name'}); NAME.textContent = item;
      
      Object.entries(materials).reverse().forEach(([rank, value], mi) => {
        if(rank === '0'){
          const TOTAL = create(ROW, 'div', {'class':'inv-total','id':'I_'+item})
          TOTAL.textContent = Math.floor(value).toLocaleString('en-us');
        }
        else if(value !== '' && rank !== 'ROW'){
          const CARD = create(ROW, 'div', {'class':'inv-item r_'+rank})

          const IMG = create(CARD, 'img', {'class':'inv-image','src':getImage(category, item, rank)})
          IMG.onerror = ()=>this.classList.add('hide');
          
          const INP = create(CARD, 'input', {
            'type':'text','pattern':'\\d*','value': value, 'data-column':rank})
          INP.addEventListener('change', ()=>{
            //INP.value = parseInt(this.value.replace(/\D/g,''),10).toLocaleString();
            if(this.value == '') INP.value = 0;
            
            userInv[category][item][rank] = INP.value; store('Inventory', userInv);
            caching('cacheI', category + '_' + rank + '_' + materials['ROW'], INP.value);
            
            recalculate(category, item);
          }, false);
          INP.addEventListener('click', (e)=>{focusText(e)})
        }
      });
    });
  });
}

function saveInventory(){
  store('Inventory', userInv); setInv();
}
