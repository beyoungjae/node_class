// dep1에서는 dep2를 require한다.
const dep2 = require('./dep2')
console.log('require dep2: ', dep2)

function insideDep1() {
   console.log('require dep2: ', dep2)
}

module.exports = insideDep1
