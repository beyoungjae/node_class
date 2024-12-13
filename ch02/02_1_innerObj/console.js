const string = 'abc'
const number = 1
const boolean = true
const obj = {
   outside: {
      inside: {
         key: 'value',
      },
   },
}

console.table([
   { name: '제로', birth: 1994 },
   { name: 'hero', birth: 1988 },
])

console.dir(obj, { colors: false, depth: 2 })
console.dir(obj, { colors: true, depth: 1 })

// 코드의 실행시간 측정시 사용
console.time('실행 시간측정') // time()과 timeEnd() 함수의 글자가 같아야 한다.
for (let i = 0; i < 100000; i++) {}
console.timeEnd('실행 시간측정')

function b() {
   console.trace('에러 위치 추적') // 에러가 어디서 발생했는지 추적하게 해줌.
   // 에러발생 시 위치를 알려주지 않을 경우 사용하기 좋음
}

function a() {
   b()
}
a()
