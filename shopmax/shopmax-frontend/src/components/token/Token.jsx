import { TextField, Button, Container, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTokenThunk, readTokenThunk } from '../../features/tokenSlice'

function Token() {
   const dispatch = useDispatch()
   const { token, error } = useSelector((state) => state.token)

   // 읽기 전용으로 만들기
   const StyledTextField = styled(TextField)(() => ({
      '& .Mui-readOnly': {
         backgroundColor: '#f5f5f5', // 읽기 전용 상태의 배경색
         cursor: 'not-allowed', // 비활성화된 커서
      },
   }))

   useEffect(() => {
      dispatch(readTokenThunk())
   }, [dispatch])

   const handleToken = useCallback(() => {
      dispatch(getTokenThunk())
   }, [dispatch])

   const handleCopy = () => {
      if (token) {
         navigator.clipboard
            .writeText(token)
            .then(() => {
               alert('토큰이 클립보드에 복사되었습니다!')
            })
            .catch((err) => {
               alert('토큰 복사 실패: ', err)
            })
      }
   }

   return (
      <Container maxWidth="sm">
         <Typography variant="h4" gutterBottom>
            API Key 발급받기
         </Typography>

         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}

         <Button variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }} onClick={handleToken}>
            API key 발급받기
         </Button>

         <StyledTextField sx={{ width: '100%', marginTop: '20px' }} value={token || ''} readOnly />

         {token && (
            <Button variant="outlined" color="primary" fullWidth style={{ marginTop: '10px' }} onClick={handleCopy}>
               복사하기
            </Button>
         )}
      </Container>
   )
}

export default Token
