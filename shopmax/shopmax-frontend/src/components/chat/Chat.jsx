import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { TextField, Button, Box } from '@mui/material'

// 서버와 연결 => connection 진행
const socket = io(process.env.REACT_APP_API_URL, {
   withCredentials: true, // 소켓에서 세션을 사용하므로 쿠키를 포함하여 세션 유지
})

function Chat() {
   const [messages, setMessages] = useState([]) // 서버에서 전달받은 채팅 메세지
   const [input, setInput] = useState('') // 입력 메세지
   const [user, setUser] = useState(null) // 소켓 서버에서 전달받은 사용자의 정보
   const messagesContainerRef = useRef(null) // 메세지 컨테이너 스크롤이 항상 아래로 가게 하기 위한 ref

   useEffect(() => {
      // 소켓서버에서 사용자 정보를 얻기위해 메세지 전송
      socket.emit('user info', 'requestUserInfo')

      // 서버에서 사용자 정보 가져오기
      socket.on('user info', (userInfo) => {
         setUser(userInfo)
      })

      // 서버에서 메세지 수신
      socket.on('chat message', (msg) => {
         setMessages((prevMessages) => [...prevMessages, msg])
      })

      // 컴포넌트 언마운트 시 이벤트 제거
      return () => {
         socket.off('chat message')
         socket.off('user info')
      }
   }, [])

   useEffect(() => {
      // 스크롤을 메세지 컨테이너의 가장 아래로 이동
      if (messagesContainerRef.current) {
         messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight // 스크롤을 메세지 컨테이너의 가장 아래로 이동
      }
   }, [messages]) // messages 상태가 변경될 때마다 실행

   // 전송버튼 클릭 시
   const sendMessage = () => {
      if (!input.trim()) return

      // 서버로 메세지 전송
      socket.emit('chat message', input)
      setInput('') // 입력 state 초기화
   }

   // 메세지 입력 후 엔터 클릭 시
   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         e.preventDefault() // 기본 엔터키 동작 방지(줄바꿈 방지)
         sendMessage() // 메세지 전송
      }
   }

   return (
      <Box
         sx={{
            width: 400,
            margin: '0 auto',
            border: '1px solid #ccc',
            borderRadius: 2,
            padding: 2,
         }}
      >
         <h2>채팅</h2>
         <Box
            ref={messagesContainerRef} // 메시지 컨테이너에 ref 추가
            sx={{
               height: 300,
               overflowY: 'auto',
               border: '1px solid #ccc',
               borderRadius: 1,
               padding: 1,
               marginBottom: 2,
            }}
         >
            {messages.map((msg, index) => {
               // 메시지를 보낸 사람이 현재 사용자일 경우 스타일을 오른쪽으로
               const isOwnMessage = msg.user === user?.name

               return (
                  <Box
                     key={index}
                     sx={{
                        display: 'flex',
                        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                        marginBottom: 1,
                     }}
                  >
                     <Box
                        sx={{
                           backgroundColor: isOwnMessage ? '#dcf8c6' : '#f1f1f1',
                           padding: '8px 15px',
                           borderRadius: 2,
                           maxWidth: '80%',
                        }}
                     >
                        <strong>{msg.user || '알 수 없음'}:</strong> {msg.message}
                     </Box>
                  </Box>
               )
            })}
         </Box>
         <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
               fullWidth
               variant="outlined"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="메시지를 입력하세요"
               onKeyDown={handleKeyDown} // 엔터키 눌렀을 때 전송
               sx={{
                  marginRight: 1,
                  '& .MuiInputBase-input': {
                     padding: '8px', // 원하는 패딩 값
                  },
               }}
            />
            <Button variant="contained" color="primary" onClick={sendMessage} sx={{ flexShrink: 0 }}>
               전송
            </Button>
         </Box>
      </Box>
   )
}

export default Chat
