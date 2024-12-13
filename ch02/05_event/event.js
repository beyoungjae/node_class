const EventEmitter = require('events')

// 이벤트 객체 생성
const myEvent = new EventEmitter()

myEvent.addListener('event1', () => {
   console.log('이벤트1')
})

// evnet2에 리스너 2개 추가
myEvent.on('event2', () => {
   console.log('이벤트2')
})

myEvent.on('event2', () => {
   console.log('이벤트2 추가')
})

myEvent.once('event3', () => {
   console.log('이벤트3')
})

// 이벤트 호출
myEvent.emit('event1')
myEvent.emit('event1')

myEvent.emit('event2')

myEvent.emit('event3')
myEvent.emit('event3') // 실행x (once로 등록된 이벤트는 한 번만 실행가능)

myEvent.on('event4', () => {
   console.log('이벤트4')
})

// 이벤트 제거
myEvent.removeAllListeners('event4') // 모든 이벤트 제거
myEvent.emit('event4') // 실행안됨

const listeners = () => {
   console.log('이벤트5')
}
myEvent.on('event5', listeners)

myEvent.removeListener('event5', listeners)
myEvent.emit('event5')

console.log(myEvent.listenerCount('event2'))
