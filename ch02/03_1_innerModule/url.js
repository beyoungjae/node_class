const url = require('url')

const { URL } = url
const myURL = new URL('https://www.naver.com')

console.log(myURL) // 주소 객체로 분해
console.log(url.format(myURL)) // 원래 주소로 만들어줌
