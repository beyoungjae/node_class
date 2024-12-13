const a = true

// dynamic import : 특정 조건일 때 require
// commonJS 모듈 방식일 땐 문제X
if (a) {
   require('./func')
}

console.log('성공')
