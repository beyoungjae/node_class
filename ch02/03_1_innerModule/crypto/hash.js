// 단방향 암호화: 복호화 할 수 없다
const crypto = require('crypto')

console.log(crypto.createHash('sha512').update('비밀번호').digest('base64'))
console.log(crypto.createHash('sha512').update('비밀번호').digest('hex'))
console.log(crypto.createHash('sha512').update('다른 비밀번호').digest('base64'))
