import { odd, even } from './ment.mjs'

// 짝수 홀수 판단
function checkOddOrEven(num) {
   if (num % 2 === 0) {
      return even
   } else {
      return odd
   }
}

export default checkOddOrEven
