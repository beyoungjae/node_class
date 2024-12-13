/*
const timeout = setTimeout(() => {
  console.log('1.5초 후 실행');
}, 1500);

const interval = setInterval(() => {
  console.log('1초마다 실행');
}, 1000);

const timeout2 = setTimeout(() => {
  console.log('실행되지 않습니다');
}, 3000);

setTimeout(() => {
  clearTimeout(timeout2);
  clearInterval(interval);
}, 2500);
*/

// setTimeout(함수, 0)보다 setImmediate이 먼저 실행되기는 하지만 항상 그렇지는 않으므로 두개를 같이 사용하기 권장하지는 않는다.
const immediate = setImmediate(() => {
   console.log('즉시실행')
})

const immediate2 = setImmediate(() => {
   console.log('실행되지 않습니다.')
})

clearImmediate(immediate2)
