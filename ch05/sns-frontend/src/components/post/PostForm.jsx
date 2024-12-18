import React, { useState, useCallback, useMemo } from 'react'
import { TextField, Button, Box } from '@mui/material'

// 등록, 수정 폼 컴포넌트
const PostForm = ({ onSubmit, initialValues = {} }) => {
   const [imgUrl, setImgUrl] = useState(initialValues.img ? process.env.REACT_APP_API_URL + initialValues.img : '') // 이미지 경로(파일명 포함)
   const [imgFile, setImgFile] = useState(null) // 이미지 파일 객체
   const [content, setContent] = useState(initialValues.content || '') // 게시물 내용
   const [hashtags, setHashtags] = useState(initialValues.Hashtags ? initialValues.Hashtags.map((tag) => `#${tag.title}`).join(' ') : '') // 해시태그

   // 이미지 파일 미리보기
   const handleImageChange = useCallback((e) => {
      /* 
       e.target.files는 업로드한 파일 객체를 배열형태로 가져온다.
       File1, File2.. 파일 객체는 업로드한 파일의 정보들이 들어있다
       file = [File1, ~2 , ~3]

       현재 하나의 파일만 업로드 하므로
       e.target.files = [File1]
       */
      // e.target.files가 있으면 첫번째 파일 객체를 가져온다.
      const file = e.target.files && e.target.files[0]
      if (!file) return // 파일이 없을 경우 함수 종료

      setImgFile(file) // 업로드한 파일 객체를 state에 저장

      // 파일을 비동기적으로 읽을 수 있도록 해주는 객체 -> 이미지 미리보기 or 텍스트 파일 읽기 등에 주로 사용
      const reader = new FileReader()

      reader.readAsDataURL(file) // 파일을 Base64 URL로 변환(이미지 미리보기에 주로 사용)

      // onload(): 파일을 성공적으로 읽은 후에 실행되는 함수
      reader.onload = (event) => {
         setImgUrl(event.target.result)
      }
   }, [])

   // 작성한 내용 전송
   const handleSubmit = useCallback(
      (e) => {
         e.preventDefault()

         if (!content.trim()) {
            alert('내용을 입력하세요.')
            return
         }

         if (!hashtags.trim()) {
            alert('해시태그를 입력하세요.')
            return
         }

         // 수정 시 이미지 파일을 바꾸지 않을 경우를 위해 !initialValues.id 조건 추가
         if (!imgFile && !initialValues.id) {
            alert('이미지 파일을 추가하세요.')
            return
         }

         const formData = new FormData() // 폼 데이터를 쉽게 생성하고 전송할 수 있도록 하는 객체
         // formData.append(키, 값) 두 가지가 들어간다.
         // useState와 유사하고 키 값으로 데이터를 불러올 수 있다.
         formData.append('content', content) // 게시물 내용 추가
         formData.append('hashtags', hashtags) // 해시태그 추가

         // 파일명 인코딩(한글 파일명 깨짐 방지)
         if (imgFile) {
            const encodedFile = new File([imgFile], encodeURIComponent(imgFile.name), { type: imgFile.type })

            formData.append('img', encodedFile) // 이미지 파일 추가
         }

         // 등록할때는 PostCreatePage.jsx의 handleSubmit() 함수를 실행시킴
         // 수정할때는 PostEditPage.jsx의 handleSubmit() 함수를 실행시킴
         onSubmit(formData) // formData 객체를 전송
      },
      [content, hashtags, imgFile, onSubmit]
   )

   // state변경 시 등록/수정 버튼 재연산 방지
   const submitButtonLabel = useMemo(() => (initialValues.id ? '수정하기' : '등록하기'), [initialValues.id])

   return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} encType="multipart/form-data">
         {/* 이미지 업로드 필드 */}
         <Button variant="contained" component="label">
            이미지 업로드
            <input type="file" name="img" accept="image/*" hidden onChange={handleImageChange} />
         </Button>

         {imgUrl && (
            <Box mt={2}>
               <img src={imgUrl} alt="업로드 이미지 미리보기" style={{ width: '400px' }} />
            </Box>
         )}

         {/* 게시물 내용 입력 필드 */}
         <TextField label="게시물 내용" variant="outlined" fullWidth multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} sx={{ mt: 2 }} />

         {/* 해시태그 입력 필드 */}
         <TextField label="해시태그 (# 구분)" variant="outlined" fullWidth value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="예: #여행 #음식 #일상" sx={{ mt: 2 }} />

         {/* 등록 / 수정 버튼 */}
         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            {submitButtonLabel}
         </Button>
      </Box>
   )
}

export default PostForm
