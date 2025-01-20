import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getToken, readToken } from '../api/tokenApi'

// 토큰 발급
export const getTokenThunk = createAsyncThunk('token/getToken', async (_, { rejectWithValue }) => {
   try {
      const response = await getToken()
      return response.data.token
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '토큰 발급 실패')
   }
})

// 토큰 읽기
export const readTokenThunk = createAsyncThunk('token/readToken', async (_, { rejectWithValue }) => {
   try {
      const response = await readToken()
      return response.data.token
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '토큰 읽기 실패')
   }
})

const tokenSlice = createSlice({
   name: 'token',
   initialState: {
      token: null,
      decode: null,
      loading: true,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 토큰 발급
      builder
         .addCase(getTokenThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getTokenThunk.fulfilled, (state, action) => {
            state.loading = false
            state.token = action.payload
         })
         .addCase(getTokenThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      // 토큰 읽기
      builder
         .addCase(readTokenThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(readTokenThunk.fulfilled, (state, action) => {
            state.loading = false
            state.token = action.payload
         })
         .addCase(readTokenThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default tokenSlice.reducer
