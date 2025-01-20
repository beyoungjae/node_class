const { Server } = require('socket.io')
const passport = require('passport')

module.exports = (server, sessionMiddleware) => {
   // Soket.IO 서버 생성
   const io = new Server(server, {
      // 소켓에서 별도로 cors 설정 : socket.IO와 Express의 cors 처리 방식이 다르기 때문
      cors: {
         origin: process.env.FRONTEND_APP_URL, // 클라이언트의 url 허용
         methods: ['GET', 'POST'], // 허용된 http 메서드, 다른 메서드(put, delete, patch)는 차단 (클라이언트가 delete 요청을 보내 데이터가 삭제되는 상황 방지)
         credentials: true, // 세션 사용을 위해 인증 정보(쿠키 등)허용
      },
   })

   // 소켓의 연결(connection 이벤트)이 발생하기 직전에 실행되는 미들웨어
   io.use((socket, next) => {
      // express의 세션 미들웨어를 Socket.IO에서 사용할 수 있도록 설정
      sessionMiddleware(socket.request, {}, next)
   })

   // 소켓의 연결(connection 이벤트)이 발생하기 직전에 실행되는 미들웨어
   // Passport의 역직렬화 호출 추가
   io.use((socket, next) => {
      // socket.request.session.passport.user에 저장된 사용자 id 확인
      if (socket.request.session?.passport?.user) {
         // passport의 역직렬화 호출
         passport.deserializeUser(socket.request.session.passport.user, (err, user) => {
            if (err) return next(err)
            socket.request.user = user // 역직렬화된 사용자 정보를 socket request객체에서 저장
            next() // 다음 미들웨어 진행
         })
      } else {
         // 로그인이 안된 상태에서 소켓에 접속 시 소켓 연결 해제(로그인 한 사람만 채팅 사용가능)
         console.log('비인증 사용자 연결 시도')
         return socket.disconnect() // 인증되지 않은 사용자 연결 해제
      }
   })

   // Soket.IO 연결 이벤트 처리
   io.on('connection', (socket) => {
      // 역직렬화된 사용자 정보 가져오기
      const user = socket.request.user

      console.log('사용자 연결됨:', user?.id) // 연결된 사용자의 id출력

      // 클라이언트에서 'user info' 이벤트 요청 시 사용자 정보 클라이언트에게 전송
      socket.on('user info', (msg) => {
         if (msg) {
            socket.emit('user info', user) // 클라이언트로 사용자 정보 전송
         }
      })

      // 클라이언트에서 'chat message' 이벤트 요청 시 모든 클라이언트에게 메세지 전송
      socket.on('chat message', (msg) => {
         // 모든 클라이언트에게 메세지와 사용자 이름 전송
         io.emit('chat message', { user: user?.name, message: msg })
      })

      // 클라이언트가 연결 해제 요청시
      socket.on('disconnect', () => {
         console.log('사용자 연결 해제: ', user?.id) // 연결해제된 사용자의 id 출력
         return socket.disconnect()
      })
   })

   return io
}
