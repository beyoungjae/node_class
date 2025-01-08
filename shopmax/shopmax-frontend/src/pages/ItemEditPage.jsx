import { Container } from '@mui/material'
import ItemForm from '../components/item/ItemForm'

import { useDispatch } from 'react-redux'
import { useCallback } from 'react'

function ItemEditPage() {
   return (
      <Container maxWidth="md" sx={{ marginTop: 10, marginBottom: 13 }}>
         <h1>상품 수정</h1>
         <ItemForm />
      </Container>
   )
}

export default ItemEditPage
