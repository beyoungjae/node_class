import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Stack, Pagination, Select, MenuItem, FormControl, InputLabel, IconButton, Typography, Link } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import dayjs from 'dayjs'

import { useState, useEffect, useCallback } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

function ItemList() {
   return (
      <Box sx={{ p: 4 }}>
         {/* 등록버튼 */}
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <RouterLink to="/items/create">
               <Button variant="contained">상품등록</Button>
            </RouterLink>
         </Box>
      </Box>
   )
}

export default ItemList
