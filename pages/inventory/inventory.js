let userInv = myStorage.get('user').Inventory;

/*INVENTORY*/
function inventory(){
  Object.entries(userInv).forEach(([category, items]) => {
    const SEC = document.getElementById(category);

    const TITLE = create(SEC, 'div', {'class': 'section__title'});
    TITLE.textContent = category;

    const TBL = create(SEC, 'div', {'class':'section__table'});
  
    Object.entries(items).forEach(([item, materials], ii) => {
      const ROW = create(TBL, 'div', {'class':'row'})
      ROW.style = 'grid-row: '+(ii+1);

      const NAME = create(ROW, 'div', {'class':'row__name'}); NAME.textContent = item;
      
      recalculate(category, item);
      Object.entries(materials).reverse().forEach(([rank, value], mi) => {
        if(rank === '0'){
          const TOTAL = create(ROW, 'div', {'class':'row__total','id':'I_'+item})
          TOTAL.textContent = Math.floor(value).toLocaleString('en-us');
          return
        }
        if(value === '*' || rank === 'ROW') return;
        
        const CARD = create(ROW, 'div', {'class':'row__card r_'+rank})

        const IMG = create(CARD, 'img', {'class':'row__card--img','src':getImage(category, item, rank)})
        setError(IMG)
        
        const INP = create(CARD, 'input', {
          'type':'text','pattern':'\\d*','value': value, 'data-column':rank})
        INP.addEventListener('blur',()=>{ if(INP.defaultValue === INP.value) return;
          if(INP.value == '') INP.value = 0;
          
          userInv[category][item][rank] = +INP.value; store('Inventory', userInv);
          caching('cacheI', category + '_' + rank + '_' + materials['ROW'], INP.value);
          
          recalculate(category, item);
        }, false);
        INP.addEventListener('click', (e)=>{focusText(e)})
      });
    });
  });
}

function save(){
  store('Inventory', userInv); setInv();
}
