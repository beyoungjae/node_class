import { Box, Typography, Button, Alert, CardMedia } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { NumberInput } from '../../styles/NumberInputBasic'
import LocalMallIcon from '@mui/icons-material/LocalMall'

import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchItemByIdThunk } from '../../features/itemSlice'
import { formatWithComma } from '../../utils/priceSet'
import { createOrderThunk } from '../../features/orderSlice'

function ItemSellDetail() {
   const { id } = useParams() // item의 id
   const { item, loading, error } = useSelector((state) => state.items)
   const dispatch = useDispatch()
   const [count, setCount] = useState(1)
   const [orderPrice, setOrderPrice] = useState(0) // 총 상품 가격
   const [orderComplete, setOrderComplete] = useState(false) // 주문 완료 상태

   // 수량 증가 시 총 가격 계산
   // 처음에 상세 페이지 들어왔을 때 수량이 1개일때의 총 상품가격도 보여주기 위해 useEffect 사용
   useEffect(() => {
      if (item) {
         // 상품이 있다면
         setOrderPrice(item.price * count) // 상품 가격 * 수량
      }
   }, [item, count])

   // 수량 증가
   const handleQuantityChange = useCallback((event, value) => {
      setCount(value)
   }, [])

   /*    
   const handleCountChange = useCallback(
      (event, value) => {
         // 만약 (아이템과 벨류의 값이 1보다 크거나 같거나, 벨류의 값이 아이템에 들어가 있는 재고개수보다 작거나 같을 때)
         if (item && value >= 1 && value <= item.stockNumber) {
            setCount(value)
         }
      },
      [item]
   ) 
   */

   // 상품 주문
   const handleBuy = useCallback(() => {
      // orderData = { items: [{ itemId: 1, count: 2 }, { itemId: 2, count: 1 }] }
      dispatch(
         createOrderThunk({
            items: [
               {
                  itemId: `${id}`, // 상품 id
                  count, // 상품 수량
               },
            ],
         })
      )
         .unwrap()
         .then(() => {
            alert('주문이 완료되었습니다!')
            setOrderComplete(true) // state를 바꿔서 컴포넌트 재렌더링 시 바뀐 재고가 보이도록 함
         })
         .catch((error) => {
            console.error('주문 에러: ', error)
            alert(`주문 실패: ${error}`)
         })
   }, [dispatch, count, id])

   useEffect(() => {
      dispatch(fetchItemByIdThunk(id))
   }, [dispatch, id])

   if (loading) {
      return null //아무것도 보여주지 X
   }

   if (error) {
      return (
         <Typography variant="body1" align="center" color="error">
            에러 발생: {error}
         </Typography>
      )
   }

   return (
      <>
         {item && (
            <Box sx={{ padding: '20px' }}>
               {/* 위쪽 상세 */}
               <Grid
                  container
                  spacing={4}
                  sx={{ justifyContent: 'center', alignItems: 'center' }} // 추가된 스타일
               >
                  <Grid container spacing={10}>
                     {/* 왼쪽 이미지 */}
                     <Grid xs={12} md={6}>
                        <CardMedia component="img" image={`${process.env.REACT_APP_API_URL}${item.Imgs.filter((img) => img.repImgYn === 'Y')[0].imgUrl}`} alt={item.itemNm} sx={{ width: '450px', borderRadius: '8px' }} />
                     </Grid>

                     {/* 오른쪽 상세 정보 */}
                     <Grid xs={12} md={6}>
                        <Typography variant="h4" gutterBottom>
                           <LocalMallIcon sx={{ color: '#ffab40', fontSize: '32px' }} />
                           {item.itemNm}
                        </Typography>

                        <Typography variant="h6" gutterBottom>
                           가격: {formatWithComma(String(item.price))}원
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                           현재 재고: {formatWithComma(String(item.stockNumber))}개
                        </Typography>

                        {item.itemSellStatus === 'SOLD_OUT' ? (
                           <Alert severity="error">품절</Alert>
                        ) : (
                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
                              <NumberInput aria-label="Demo number input" placeholder="수량" value={count} min={1} max={item.stockNumber} onChange={handleQuantityChange} />
                              {/* <Typography variant="h6">총 가격: {formatWithComma(String(item.price * count))}원</Typography> */}
                              <Typography variant="h6">총 가격: {formatWithComma(String(orderPrice))}원</Typography>
                              <Button variant="contained" color="primary" onClick={handleBuy}>
                                 구매하기
                              </Button>
                           </Box>
                        )}
                     </Grid>
                  </Grid>
               </Grid>

               {/* 상세 이미지 */}
               <Box sx={{ marginTop: '180px' }}>
                  <Typography variant="h5" gutterBottom>
                     상세 정보
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ mt: 4, mb: 5 }}>
                     판매중인 {item.itemNm}
                  </Typography>
                  <Grid container spacing={2}>
                     {item.Imgs.map((img, index) => (
                        <Grid xs={12} sm={6} md={4} key={index}>
                           <CardMedia component="img" image={`${process.env.REACT_APP_API_URL}${img.imgUrl}`} alt={`상세 이미지 ${index + 1}`} sx={{ width: '100%', borderRadius: '8px' }} />
                        </Grid>
                     ))}
                  </Grid>
               </Box>
            </Box>
         )}
      </>
   )
}

export default ItemSellDetail
