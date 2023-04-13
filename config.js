
const _ = require('lodash')
const years = _.range(2018, 2023)
const months = ['06','07','08','09']
const min = 0
const max = 60
const location = ['BeiJing'] // BeiJing,GuangZhou,ChengDu,Europe,Canada,India,Others,Mexico,ShangHai,Toronto,ShenYang,HongKong...
const status = ['Clear'] //Pending, Clear, Reject
const f1Entry = 'New'

module.exports = {
  months, years,location,min,max,status, f1Entry
}