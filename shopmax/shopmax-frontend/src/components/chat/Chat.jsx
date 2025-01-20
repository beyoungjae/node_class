import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { TextField, Button, Box } from '@mui/material'

// 서버와 연결 => connection 진행
const socket = io(process.env.REACT_APP_API_URL, {
   withCredentials: true, // 소켓에서 세션을 사용하므로 쿠키를 포함하여 세션 유지
})

function Chat() {
   const [messages, setMessages] = useState([]) // 채팅 메세지
   const [input, setInput] = useState('') // 입력 메세지
   const [user, setUser] = useState(null) // 사용자
   const messagesContainerRef = useRef(null) // 메세지 컨테이너 스크롤이 항상 아래로 가게 하기 위한 ref

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
