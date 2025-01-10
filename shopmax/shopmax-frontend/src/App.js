import './styles/common.css'
import { Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatusThunk } from './features/authSlice'
import { useEffect } from 'react'

import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import Home from './pages/Home'
import ItemCreatePage from './pages/ItemCreatePage'
import ItemEditPage from './pages/ItemEditPage'
import ItemListPage from './pages/ItemListPage'
import ItemSellDatailPage from './pages/ItemSellDetailPage'

import RedirectLoginRoute from './components/auth/RedirectLoginRoute'
import AdminRoute from './components/auth/AdminRoute'
import { Toolbar } from '@mui/material'

function App() {
   const dispatch = useDispatch()
   const { isAuthenticated, user } = useSelector((state) => state.auth) //로그인 상태, 로그인 한 사용자 정보

   //새로고침시 redux state가 초기화 되거나 프로그램 실행 중 문제 발생 가능성이 있으므로 지속적인 로그인 상태 확인을 위해 사용
   useEffect(() => {
      dispatch(checkAuthStatusThunk())
   }, [dispatch])

   return (
      <>
         <Navbar isAuthenticated={isAuthenticated} user={user} />
         {/* 메뉴에 아래 컨텐츠가 가려져서 보이는 문제 해결 -> Appbar 높이만큼 여백추가 */}
         <Toolbar />
         <Routes>
            <Route path="/" element={<Home />} />
            <Route
               path="/signup"
               element={
                  <RedirectLoginRoute>
                     <SignupPage />
                  </RedirectLoginRoute>
               }
            />
            <Route
               path="/login"
               element={
                  // 로그인 상태일때는 home으로 리다이렉트
                  <RedirectLoginRoute>
                     <LoginPage />
                  </RedirectLoginRoute>
               }
            />

            {/* 상품 등록 */}
            <Route
               path="/items/create"
               element={
                  // 관리자가 아닐경우 home으로 리다이렉트
                  <AdminRoute>
                     <ItemCreatePage />
                  </AdminRoute>
               }
            />
            {/* 상품 수정 */}
            <Route
               path="/items/edit/:id"
               element={
                  // 관리자가 아닐경우 home으로 리다이렉트
                  <AdminRoute>
                     <ItemEditPage />
                  </AdminRoute>
               }
            />
            {/* 상품리스트 */}
            <Route
               path="/items/createlist"
               element={
                  // 관리자가 아닐경우 home으로 리다이렉트
                  <AdminRoute>
                     <ItemListPage />
                  </AdminRoute>
               }
            />
            {/* 상품 상세페이지 */}
            <Route path="/items/detail/:id" element={<ItemSellDatailPage />} />
         </Routes>
         <Footer />
      </>
   )
}

export default App
