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
  status,
  f1Entry
} = require('./config')
const tabletojson = require('tabletojson').Tabletojson;


const arr = years.reduce((res,item)=>{
  res.push(...months.map(month=>`${item}-${month}`))
  return res
},[])


const dataDir = path.join(__dirname, 'data-by-year')

const jsonify = (obj) => {
  const arr = obj.map(item=>Number(item["9"]))
  return JSON.stringify({
    mean: mean(arr),
    median: median(arr),
    mode: mode(arr),
    range: range(arr),
  }, null, 4)
}

let map = {

}

for (const year of years) {
  map[year] = {
    h1b: [],
    f1:[]
  }
}

const fetch = async () => {
  for (const str of arr) {
    const y = str.split('-')[0]
    await tabletojson.convertUrl(
      `https://www.checkee.info/main.php?dispdate=${str}`,
      function(tablesAsJson) {
        const json = tablesAsJson[6]
        const arr = json.filter(item=>status.includes(item["6"])&&item["9"]>min&&item["9"]<max&&location.includes(item["4"]))
        const h1b = arr.filter(item=>item["2"]==='H1')
        const f1 = arr.filter(item=>item["2"]==='F1'&&item["3"]===f1Entry)
        map[y].h1b.push(...h1b)
        map[y].f1.push(...f1)
      }
  );
  }
  getWhole()
  // getPerYear()
}

fetch()

const getWhole = () => {
  const {h1b, f1} = _.toPairs(map).reduce((res,item)=>{
    res.h1b.push(...item[1].h1b)
    res.f1.push(...item[1].f1)
    return res
  },{
    h1b:[],
    f1:[]
  })

  fs.mkdirpSync(path.join(dataDir, 'whole'))
  fs.writeFileSync(path.join(dataDir, 'whole', 'H1B.json'), jsonify(h1b), 'utf8')
  fs.writeFileSync(path.join(dataDir, 'whole','F1.json'), jsonify(f1), 'utf8')
}

const getPerYear = () => {
  for(str in map) {
    fs.mkdirpSync(path.join(dataDir, str))
    fs.writeFileSync(path.join(dataDir, str, 'H1B.json'), jsonify(map[str].h1b), 'utf8')
    fs.writeFileSync(path.join(dataDir, str,'F1.json'), jsonify(map[str].f1), 'utf8')
  }
}

