// 가격 콤마 추가
export const formatWithComma = (value) => {
   if (!value) return '' // 빈 값이면 빈 문자열 리턴

   // 콤마 제거 후 다시 콤마 추가
   return Number(value.replace(/,/g, '')).toLocaleString('ko-KR')
}

// 가격 콤마 제거
export const stripComma = (value) => {
   return value.replace(/,/g, '') // 콤마 제거
}
