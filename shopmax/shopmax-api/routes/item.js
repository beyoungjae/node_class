const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const router = express.Router()
const { isAdmin } = require('./middlewares')
const { Item, Img} = require('../models')

// uploads 폴더가 없을 경우 새로 생성
try {
   fs.readdirSync('uploads') //해당 폴더가 있는지 확인
} catch (error) {
   console.log('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
   fs.mkdirSync('uploads') //폴더 생성
}

// 이미지 업로드를 위한 multer 설정
const upload = multer({
   // 저장할 위치와 파일명 지정
   storage: multer.diskStorage({
      destination(req, file, cb) {
         cb(null, 'uploads/') // uploads폴더에 저장
      },
      filename(req, file, cb) {
         const decodedFileName = decodeURIComponent(file.originalname) //파일명 디코딩(한글 파일명 깨짐 방지) => 제주도.jpg
         const ext = path.extname(decodedFileName) //확장자 추출
         const basename = path.basename(decodedFileName, ext) //확장자 제거한 파일명 추출

         // 파일명 설정: 기존이름 + 업로드 날짜시간 + 확장자
         // dog.jpg
         // ex) dog + 1231342432443 + .jpg
         cb(null, basename + Date.now() + ext)
      },
   }),
   // 파일의 크기 제한
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB로 제한
})

// 상품 등록 localhost:8000/item
// upload.array(값)의 매개변수 값은 input 태그의 name 값 사용, 만약, formData 사용 시 formData의 key 값 사용
router.post('/', isAdmin, upload.array('img'), async (req, res) => {
    try {
        // 업로드된 파일 확인
        if (!req.files) {
            return res.status(400).json({
                success: false,
                message: '파일 업로드에 실패했습니다.',
                error,
            })
        }

        // 상품 insert
        const { itemNm, price, stockNumber, itemDetail, itemSellStatus } = req.body
        const item = await Item.create({
           itemNm,
           price,
           stockNumber,
           itemDetail,
           itemSellStatus,
        })

        const images = req.files.map((file) => ({
            oriImgName: file.originalname, // 원본 이미지명
            imgUrl: `/${file.filename}`, // 이미지 경로
            repImgYn: 'N', // 기본적으로 'N' 설정
            itemId: item.id, // 생성된 상품 ID 연결
        }))

        // 첫 번째 이미지는 대표 이미지로 설정
        if (images.length > 0) {
            images[0].repImgYn = 'Y'
        }

        // 이미지 여러개 insert
        await Img.bulkCreate(images)

        // 상품 생성
        res.status(201).json({
            success: true,
            message: '상품과 이미지가 성공적으로 등록되었습니다.',
            item,
            images,
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: '상품 등록 중 오류가 발생하였습니다.', error})
    }
})

module.exports = router
