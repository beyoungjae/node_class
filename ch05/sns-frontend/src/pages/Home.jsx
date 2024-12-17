import { Container, Typography, Pagination, Stack } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostsThunk } from '../features/postSlice'
import PostItem from '../components/post/PostItem'

const Home = ({ isAuthenticated, user }) => {
   const [page, setPage] = useState(1) // 현재 페이지
   const dispatch = useDispatch()
   const { posts, pagination, loading, error } = useSelector((state) => state.posts)

   useEffect(() => {
      dispatch(fetchPostsThunk(page))
   }, [dispatch, page])

   // 페이지 변경
   const handlePageChange = useCallback((event, value) => {
      setPage(value)
   }, [])

   return (
      <Container maxWidth="xs">
         <Typography variant="h4" align="center" gutterBottom>
            Home Feed
         </Typography>

         {loading && (
            <Typography variant="body1" align="center">
               로딩 중...
            </Typography>
         )}

         {posts.length > 0 ? (
            <>
               {posts.map((post) => (
                  <PostItem key={post.id} post={post} isAuthenticated={isAuthenticated} user={user} />
               ))}
               <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                  <Pagination count={pagination.totalPages} page={page} onChange={handlePageChange} />
               </Stack>
            </>
         ) : (
            !loading && (
               <Typography variant="body1" align="center">
                  게시물이 없습니다.
               </Typography>
            )
         )}

         {error && (
            <Typography variant="body1" align="center" color="error">
               에러 발생: {error}
            </Typography>
         )}
      </Container>
   )
}

export default Home
