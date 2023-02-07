
function data(){
  Object.entries(SDB_Calculate).forEach(([name, table])=>{
    console.log(name, table)
    makeTable(name,table)
  })
  // makeTable('t',SDB_Calculate['TALENT'])
}

function makeTable(name, data){
  let cont = document.getElementById('content')
  let table = create(cont, 'table')
  let head = create(table, 'thead')
  let bod = create(table, 'tbody')
  let hCatg = create(head,'tr')
  let hRank = create(head, 'tr')

  let rowArray = [];
  let f;

  let title = create(hCatg, 'th', {'rowspan': 2, 'class':'title'})
  title.textContent = name

  Object.entries(data).forEach(([category, rows], ci)=>{
    let colH = Object.keys(Object.values(rows)[0])
    let cClass = ci%2?'odd':'even';

    let cat = create(hCatg, 'th', {'colspan':colH.length, 'class':cClass})
    cat.textContent = category

    colH.forEach(r => {
      let rank = create(hRank, 'th', {'class':cClass})
      rank.textContent = r
    })

    Object.entries(rows).forEach(([row, cols], ri)=>{
      if(!rowArray[row]){
        rowArray[row] = create(bod,'tr')
        let rowHead = create(rowArray[row],'th')
        rowHead.textContent = row
      }
      if(ri === 0) f = row;
      let prev = (rows[row-1])? Object.values(rows[row-1]): []
      Object.values(cols).forEach((cumm, i)=>{
        let cell = create(rowArray[row],'td',{'class':cClass})
        let value = cumm - +prev[i]
        if(value === 0) value = '';
        cell.textContent = (row === f)? cumm: value
      })
    })
  })
}