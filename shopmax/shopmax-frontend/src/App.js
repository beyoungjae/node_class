import './styles/common.css'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuthStatusThunk } from './features/authSlice'

import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import Home from './pages/Home'

function App() {
   const dispatch = useDispatch()
   const { isAuthenticated, user } = useSelector((state) => state.auth) // 로그인 상태, 로그인 한 사용자 정보

   // 새로고침 시 redux state가 초기화 되거나, 프로그램 실행 중 문제 발생 시 로그인이 초기화가 될 수 있으므로 지속적인 로그인 상태 확인을 위해 사용
   useEffect(() => {
      dispatch(checkAuthStatusThunk())
   }, [dispatch])

   return (
      <>
         <Navbar isAuthenticated={isAuthenticated} user={user} />
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
         </Routes>
         <Footer />
      </>
   )
}

export default App
