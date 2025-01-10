import { Card, CardMedia, CardContent, Typography, Pagination, Box } from '@mui/material'

import { formatWithComma } from '../../utils/priceSet'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchItemsThunk } from '../../features/itemSlice'

function ItemSellList({ searchTerm }) {
   const dispatch = useDispatch()
   const { items, pagination, loading, error } = useSelector((state) => state.items)
   const [page, setPage] = useState(1)

   useEffect(() => {
      dispatch(fetchItemsThunk({ page, limit: 8, searchTerm }))
   }, [dispatch, page, searchTerm]) // 검색어 입력시 다시 state변경(searchIcon 클릭시 -> searchTerm state가 변경되면서 useEffect 실행)

   if (loading) {
      return null // 아무것도 보여주지 않음
   }

   if (error) {
      return (
         <Typography variant="body1" align="center" color="error">
            에러 발생: {error}
         </Typography>
      )
   }

   return (
      <Box sx={{ padding: '20px' }}>
         {items.length > 0 ? (
            <Box
               sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                     xs: 'repeat(1, 1fr)', // 모바일: 1열
                     sm: 'repeat(2, 1fr)', // 작은 화면: 2열
                     md: 'repeat(3, 1fr)', // 중간 화면: 3열
                     lg: 'repeat(4, 1fr)', // 큰 화면: 4열
                  },
                  gridAutoRows: 'auto',
                  gap: '16px',
                  justifyItems: 'center',
               }}
            >
               {items.map((item) => (
                  <Link key={item.id} to={`/items/detail/${item.id}`} style={{ textDecoration: 'none' }}>
                     <Card sx={{ width: '250px' }}>
                        {/* 대표이미지만 가져오기 */}
                        <CardMedia component="img" height="140" image={`${process.env.REACT_APP_API_URL}${item.Imgs.filter((img) => img.repImgYn === 'Y')[0].imgUrl}`} alt={item.itemNm} />
                        <CardContent>
                           <Typography variant="h6" component="div">
                              {item.itemNm}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                              {/* price는 int타입이므로 문자 타입으로 변경 후 사용 */}
                              {formatWithComma(String(item.price))}원
                           </Typography>
                        </CardContent>
                     </Card>
                  </Link>
               ))}
            </Box>
         ) : (
            <Box sx={{ textAlign: 'center' }}>
               <Typography variant="h6">검색된 상품이 없습니다.</Typography>
            </Box>
         )}
         {pagination && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
               <Pagination count={pagination.totalPages} page={page} onChange={(event, value) => setPage(value)} color="primary" />
            </Box>
         )}
      </Box>
   )
}

export default ItemSellList
