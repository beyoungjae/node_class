import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
// import { Link as MUILink } from '@mui/material'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'
// https://mui.com/material-ui/react-app-bar/#app-bar-with-responsive-menu

import { Link } from 'react-router-dom'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { logoutUserThunk } from '../../features/authSlice'

function Navbar({ isAuthenticated, user }) {
   const dispatch = useDispatch()
   const [anchorElNav, setAnchorElNav] = useState(null)
   const [anchorElUser, setAnchorElUser] = useState(null)

   const handleLogout = useCallback(() => {
      dispatch(logoutUserThunk())
         .unwrap()
         .then(() => {
            window.location.href = '/' // 로그아웃 시 새로고침
         })
         .catch((error) => {
            alert(`로그아웃 실패: ${error}`)
         })
   }, [dispatch])

   const handleOpenNavMenu = useCallback((event) => {
      setAnchorElNav(event.currentTarget)
   }, [])

   const handleOpenUserMenu = useCallback((event) => {
      setAnchorElUser(event.currentTarget)
   }, [])

   const handleCloseNavMenu = useCallback(() => {
      setAnchorElNav(null)
   }, [])

   const handleCloseUserMenu = useCallback(() => {
      setAnchorElUser(null)
   }, [])

   return (
      <AppBar position="fixed" sx={{ backgroundColor: '#fff', color: '#000' }}>
         <Container maxWidth="lg">
            <Toolbar disableGutters>
               {/* pc버전 메뉴 */}
               <ShoppingBasketIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
               <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                     mr: 2,
                     display: { xs: 'none', md: 'flex' },
                     fontFamily: 'monospace',
                     fontWeight: 700,
                     letterSpacing: '.3rem',
                     color: 'inherit',
                     textDecoration: 'none',
                  }}
               >
                  SHOPMAX
               </Typography>

               <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                  <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                     <MenuIcon />
                  </IconButton>
                  <Menu
                     id="menu-appbar"
                     anchorEl={anchorElNav}
                     anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                     }}
                     keepMounted
                     transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                     }}
                     open={Boolean(anchorElNav)}
                     onClose={handleCloseNavMenu}
                     sx={{ display: { xs: 'block', md: 'none' } }}
                  >
                     <MenuItem>
                        {/* 라우터의 Link 사용시 페이지 state가 그대로 남아있어서 2페이지에 있으면 메뉴를 클릭해도 2페이지가 그대로 보임. 따라서 href사용 */}
                        <Link to="/items/createlist" style={{ color: 'black', textDecoration: 'none' }}>
                           <Typography sx={{ textAlign: 'center' }}>상품등록</Typography>
                        </Link>
                     </MenuItem>
                     <MenuItem>
                        <Typography sx={{ textAlign: 'center' }}>상품구매</Typography>
                     </MenuItem>
                     <MenuItem>
                        <Typography sx={{ textAlign: 'center' }}>고객문의</Typography>
                     </MenuItem>
                  </Menu>
               </Box>

               {/* 모바일 메뉴 */}
               <ShoppingBasketIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
               <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                     mr: 2,
                     display: { xs: 'flex', md: 'none' },
                     flexGrow: 1,
                     fontFamily: 'monospace',
                     fontWeight: 700,
                     letterSpacing: '.3rem',
                     color: 'inherit',
                     textDecoration: 'none',
                  }}
               >
                  SHOPMAX
               </Typography>
               <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  {user && user.role === 'ADMIN' && (
                     <MenuItem>
                        <Link to="/items/createlist" style={{ color: 'black', textDecoration: 'none' }}>
                           <Typography sx={{ textAlign: 'center' }}>상품등록</Typography>
                        </Link>
                     </MenuItem>
                  )}
                  <MenuItem>
                     <Typography sx={{ textAlign: 'center' }}>상품구매</Typography>
                  </MenuItem>
                  <MenuItem>
                     <Typography sx={{ textAlign: 'center' }}>고객문의</Typography>
                  </MenuItem>
               </Box>

               {/* 내 프로필 */}
               {isAuthenticated ? (
                  <Box sx={{ flexGrow: 0 }}>
                     <Typography variant="span" style={{ marginRight: '20px', color: '#000', fontSize: 14 }}>
                        {/* ?(optional chaining): 값이 undefined 이거나 null일때 에러를 반환하지 않고 그냥 undefined를 반환 */}
                        {user?.name} 님
                     </Typography>
                     <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                           <Avatar alt={user?.name} src="/images/logo.png" />
                        </IconButton>
                     </Tooltip>
                     <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                     >
                        <MenuItem>
                           <Link to="/myorderlist" style={{ color: 'black', textDecoration: 'none' }}>
                              <Typography sx={{ textAlign: 'center' }}>주문내역</Typography>
                           </Link>
                        </MenuItem>
                        <MenuItem onClick={handleCloseUserMenu}>
                           <Typography sx={{ textAlign: 'center' }}>장바구니</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                           <Typography sx={{ textAlign: 'center' }}>로그아웃</Typography>
                        </MenuItem>
                        <MenuItem>
                           <Link to="/chat" style={{ color: 'black', textDecoration: 'none' }}>
                              <Typography sx={{ textAlign: 'center' }}>1:1 채팅 문의</Typography>
                           </Link>
                        </MenuItem>
                        {user && user.role === 'ADMIN' && (
                           <MenuItem>
                              <Link to="/token" style={{ color: 'black', textDecoration: 'none' }}>
                                 <Typography sx={{ textAlign: 'center' }}>API Key</Typography>
                              </Link>
                           </MenuItem>
                        )}
                     </Menu>
                  </Box>
               ) : (
                  <Link to="/login">
                     <Button variant="contained">로그인</Button>
                  </Link>
               )}
            </Toolbar>
         </Container>
      </AppBar>
   )
}

export default Navbar
