import { useState, useCallback } from 'react'
import { TextField, IconButton, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

function SearchBar({ onSearch }) {
   const [searchTerm, setSearchTerm] = useState('') // 검색어

   const handleInputChange = useCallback((event) => {
      setSearchTerm(event.target.value)
   }, [])

   // 검색아이콘을 눌렀을 때
   const handleSearch = useCallback(
      (event) => {
         event.preventDefault() // 폼 제출 기본 동작 방지

         // onSearch가 존재하고, searchTerm의 값이 빈 문자열이 아니라면
         if (onSearch && searchTerm.trim() !== '') {
            onSearch(searchTerm.trim()) // home.jsx에 있는 searchTerm state의 값을 바꿔주는 역할 -> itemSellList.jsx에서 검색어를 전달받아서 사용하기 위해
         } else {
            alert('검색 값을 입력해주세요!')
            return
         }
      },
      [searchTerm, onSearch]
   )

   return (
      <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', width: '80%', margin: '0 auto' }}>
         <TextField variant="outlined" fullWidth placeholder="상품을 검색하세요." value={searchTerm} onChange={handleInputChange} sx={{ marginRight: 1 }} />
         <IconButton color="primary" type="submit">
            <SearchIcon />
         </IconButton>
      </Box>
   )
}

export default SearchBar
