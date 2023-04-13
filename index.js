const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')
const {
  mean,
  median,
  mode,
  range
} = require('./utils')
const {
  years,
  months,
  location,
  min,
  max,
  status
} = require('./config')
const tabletojson = require('tabletojson').Tabletojson;



const arr = years.reduce((res,item)=>{
  res.push(...months.map(month=>`${item}-${month}`))
  return res
},[])


const dataDir = path.join(__dirname, 'data')

const jsonify = (obj) => {
  const arr = obj.map(item=>Number(item["9"]))
  return JSON.stringify({
    mean: mean(arr),
    median: median(arr),
    mode: mode(arr),
    range: range(arr),
  }, null, 4)
}


const fetch = async () => {
  for (const str of arr) {
    await tabletojson.convertUrl(
      `https://www.checkee.info/main.php?dispdate=${str}`,
      function(tablesAsJson) {
        const json = tablesAsJson[6]
        const arr = json.filter(item=>status.includes(item["6"])&&item["9"]>min&&item["9"]<max&&location.includes(item["4"]))
        const h1b = arr.filter(item=>item["2"]==='H1')
        const f1 = arr.filter(item=>item["2"]==='F1'&&item["3"]==='Renewal')
        fs.mkdirpSync(path.join(dataDir, str))
        fs.writeFileSync(path.join(dataDir, str, 'H1B.json'), jsonify(h1b), 'utf8')
        fs.writeFileSync(path.join(dataDir, str,'F1.json'), jsonify(f1), 'utf8')
  
      }
  );
  }
}

fetch()