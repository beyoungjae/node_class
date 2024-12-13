const A = require('./globalA')

// 글로벌 객체를 이용해 값 전달
global.message = '안녕하세요'

console.log(A())
