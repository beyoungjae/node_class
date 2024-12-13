const a = false

/*
ES모듈 방식은 특정 조건절에 사용 X
if (a) {
   import './func.mjs'
}
*/

if (a) {
   await import('./func.mjs')
}

console.log('성공')
