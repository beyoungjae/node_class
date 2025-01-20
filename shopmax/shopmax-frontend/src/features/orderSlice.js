import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createOrder, getOrders, cancelOrder, deleteOrder } from '../api/orderApi'

// 주문하기
export const createOrderThunk = createAsyncThunk('order/createOrder', async (orderData, { rejectWithValue }) => {
   try {
      // orderData: 주문 상품 목록 데이터
      // orderData = { items: [{itemId: 1, count: 2 }, {itemId: 2, count: 1 }] }
      const response = await createOrder(orderData)
      return response.data.orderId
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '주문하기 실패')
   }
})

// 전체 주문목록 가져오기
export const getOrdersThunk = createAsyncThunk('order/getOrders', async (data, { rejectWithValue }) => {
   try {
      const response = await getOrders(data)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '주문 목록 조회 실패')
   }
})

//주문 취소
export const cancelOrderThunk = createAsyncThunk('order/cancelOrder', async (id, { rejectWithValue }) => {
   try {
      await cancelOrder(id)
      return id
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '주문 취소 실패')
   }
})

//주문 삭제
export const deleteOrderThunk = createAsyncThunk('order/deleteOrder', async (id, { rejectWithValue }) => {
   try {
      await deleteOrder(id)
      return id
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '주문 삭제 실패')
   }
})

const orderSlice = createSlice({
   name: 'order',
   initialState: {
      orders: [],
      pagination: null,
      loading: true,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 주문하기
      builder
         .addCase(createOrderThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createOrderThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(createOrderThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 주문목록
      builder
         .addCase(getOrdersThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getOrdersThunk.fulfilled, (state, action) => {
            state.loading = false
            state.orders = action.payload.orders
            state.pagination = action.payload.pagination
         })
         .addCase(getOrdersThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 주문취소
      builder
         .addCase(cancelOrderThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(cancelOrderThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(cancelOrderThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 주문삭제
      builder
         .addCase(deleteOrderThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteOrderThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(deleteOrderThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default orderSlice.reducer
