import { Container } from '@mui/material'
import ItemForm from '../components/item/ItemForm'

import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { createItemThunk } from '../features/itemSlice'

function ItemCreatePage() {
    const dispatch = useDispatch()

    const handleSubmit = useCallback((itemData) => {
        dispatch(createItemThunk(itemData))
            .unwrap()
            .then(() => {
            window.location.href = '/items/createlist' // 등록 후 상품등록 리스트 페이지로 이동
            })
            .catch((error) => {
                console.error('상품 등록 에러: ', error)
                alert(`상품 등록 실패: ${error}`)
        })
    }, [dispatch])
   return (
      <Container maxWidth="md" sx={{ marginTop: 10, marginBottom: 13 }}>
         <h1>상품 등록</h1>
         <ItemForm onSubmit={handleSubmit} />
      </Container>
   )
}

export default ItemCreatePage
