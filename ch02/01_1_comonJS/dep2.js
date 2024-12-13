// dep2에서는 dep1를 require한다.
const dep1 = require('./dep1')
console.log('require dep1: ', dep1)

function insideDep2() {
   console.log('require dep1: ', dep1)
}

module.exports = insideDep2
