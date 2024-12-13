const path = require('path')

const string = __filename // 파일의 경로와 이름
console.log(string)

console.log('경로 정보 정리 -----------------')
console.log(path.sep) // 경로의 구분자를 알려줌

console.log('경로 분석 ------------------')
console.log(path.dirname(string)) // 폴더 경로
console.log(path.extname(string)) // 파일의 확장자
console.log(path.basename(string)) // 파일의 이름 표시
console.log(path.basename(string, '.js')) // 파일의 이름에서 확장자 제거

console.log('경로 조작 ---------------------')
console.log(path.parse(string)) // 파일 경로 분리
console.log(
   path.format({
      // parse한 경로를 다시 합친다
      root: 'C:\\',
      dir: 'C:\\project\\node_class\\ch02\\03_1_innerModule',
      base: 'path.js',
      ext: '.js',
      name: 'path',
   })
)

// 슬래시나 역슬래시를 잘 못 입력했거나 여러 번 입력했을 때 정상적인 경로로 표시해주는 역할
console.log(path.normalize('C://project\\node_class\\ch02\\03_1_innerModule'))

console.log('경로 성격 확인 ----------------------')

// 절대경로인지 상대경로인지 true false로 알려줌
console.log(path.isAbsolute('C:\\'))
console.log(path.isAbsolute('./home'))

console.log('경로 계산 ----------------------')
// 경로 두개 중 첫번째 경로에서 두 번째 매서드의 경로로 가는 방법을 알려줌
console.log(path.relative('C:\\project\\node_class\\ch02\\03_1_innerModule\\path.js', 'C:\\'))
console.log(path.join('C:project/node', '/users', '/ezen'))
