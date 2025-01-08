import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createItem, updateItem, deleteItem, getItemById, getItems } from '../api/itemApi'

// 상품 등록
export const createItemThunk = createAsyncThunk('items/createItem', async (itemData, { rejectWithValue }) => {
   try {
      const response = await createItem(itemData)
      return response.data.item
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '상품 등록 실패')
   }
})

// 상품 수정
export const updateItemThunk = createAsyncThunk('items/updateItem', async (data, { rejectWithValue }) => {})

// 상품 삭제
export const deleteItemThunk = createAsyncThunk('items/deleteItem', async (id, { rejectWithValue }) => {})

// 특정 상품 가져오기
export const fetchItemByIdThunk = createAsyncThunk('items/fetchItemById', async (id, { rejectWithValue }) => {})

// 전체 상품 리스트 가져오기
export const fetchItemsThunk = createAsyncThunk('items/fetchItems', async (data, { rejectWithValue }) => {})

const itemSlice = createSlice({
   name: 'items',
   initialState: {
      items: [],
      item: null,
      pagination: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 상품 등록
      builder
         .addCase(createItemThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createItemThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(createItemThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default itemSlice.reducer