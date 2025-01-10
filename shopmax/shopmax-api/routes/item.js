const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { Op, where } = require('sequelize')
const router = express.Router()
const { isAdmin } = require('./middlewares')
const { Item, Img } = require('../models')

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
      res.status(500).json({ success: false, message: '상품 등록 중 오류가 발생하였습니다.', error })
   }
})

// 전체 상품 불러오기(페이징, 검색 기능) localhost:8000/item?page=1&limit=3
// localhost:8000/item?page=1&limit=3&sellCategory=SELL&searchTerm=가방&searchCategory=itemNm => 판매중인 상품에서 상품명 '가방' 검색

// localhost:8000/item?page=1&limit=3&sellCategory=SOLD_OUT&searchTerm=가방&searchCategory=itemDetail => 품절 상품에서 상품명 '가방' 검색
router.get('/', async (req, res) => {
   try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 5
      const offset = (page - 1) * limit

      // 판매 상태, 상품명, 상품 설명으로 검색
      const searchTerm = req.query.searchTerm || '' // 사용자가 입력한 검색어
      const searchCategory = req.query.searchCategory || 'itemNm' // 상품명 or 상품 설명으로 검색
      const sellCategory = req.query.sellCategory // 판매 상태('SELL' 또는 'SOLD_OUT'만 존재)

      /* 
            스프레드 연산자(...)를 사용하는 이유는 조건적으로 객체를 추가하기 위해서,
            스프레드 연산자는 "", false, 0, null, undefined와 같은 flasy값들은 무시
            값이 true 일때는 반환된 객체를 추가
        */

      // 조건부 where 절을 만드는 객체
      const whereClause = {
         // searchTerm, sellCategory 값이 있으면 whereClause 변수에 저장
         // searchTerm이 존재하면 해당 검색어가 포함된 검색 범주(searchCategory)를 조건으로 추가
         ...(searchTerm && {
            [searchCategory]: {
               [Op.like]: `%${searchTerm}%`,
            },
         }),
         // sellCategory가 존재하면 itemSellStatus가 해당 판매 상태와 일치하는 항목을 조건으로 추가
         ...(sellCategory && {
            itemSellStatus: sellCategory,
         }),
      }

      // localhost:8000/item?page=1&limit=3&sellCategory=SOLD_OUT&searchTerm=가방&searchCategory=itemDetail => 품절 상품에서 상품명 '가방' 검색

      /* 
        whereClause = {
          itemDetail: {
           [Op.like]: '가방' / '다른 입력 값'
          },
          {itemSellStatus: 'SOLD_OUT'} / 'SELL'
        }
      */

      const count = await Item.count({
         where: whereClause,
      })

      const items = await Item.findAll({
         where: whereClause,
         limit,
         offset,
         order: [['createdAt', 'DESC']],
         include: [
            {
               model: Img,
               attributes: ['id', 'oriImgName', 'imgUrl', 'repImgYn'],
            },
         ],
      })

      res.json({
         success: true,
         message: '상품 목록 조회 성공',
         items,
         pagination: {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit,
         },
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '상품 불러오기 중 오류가 발생하였습니다.', error })
   }
})

// 상품 삭제 localhost:8000/item/:id
router.delete('/:id', isAdmin, async (req, res) => {
   try {
      const { id } = req.params // 상품 id

      // 상품이 존재하는지 확인
      const item = await Item.findByPk(id)

      if (!item) {
         return res.status(404).json({
            success: false,
            message: '상품을 찾을 수 없습니다.',
         })
      }

      // 상품 삭제 (연관된 이미지도 삭제됨 - CASCADE 설정)
      await item.destroy()

      res.json({
         success: true,
         message: '상품이 성공적으로 삭제되었습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '상품 삭제 중 오류가 발생하였습니다.', error })
   }
})

// 특정 상품 불러오기(id로 상품 조회)
router.get('/:id', async (req, res) => {
   try {
      const { id } = req.params

      const item = await Item.findOne({
         where: { id }, // 특정 상품 조회
         include: [
            {
               model: Img,
               attributes: ['id', 'oriImgName', 'imgUrl', 'repImgYn'], // 특정 컬럼만 선택
            },
         ],
      })

      if (!item) {
         return res.status(404).json({
            success: false,
            message: '해당 상품을 찾을 수 없습니다.',
         })
      }

      res.json({
         success: true,
         message: '상품 조회 성공',
         item,
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '상품 조회 중 오류가 발생하였습니다.', error })
   }
})

// 상품 수정
router.put('/:id', isAdmin, upload.array('img'), async (req, res) => {
   try {
      const { id } = req.params

      const { itemNm, price, stockNumber, itemDetail, itemSellStatus } = req.body

      // 상품이 존재하는지 확인
      const item = await Item.findByPk(id)

      if (!item) {
         return res.status(404).json({
            success: false,
            message: '상품을 찾을 수 없습니다.',
         })
      }

      await item.update({
         itemNm,
         price,
         stockNumber,
         itemDetail,
         itemSellStatus,
      })

      if (req.files && req.files.length > 0) {
         // 기존 이미지 삭제
         await Img.destroy({ where: { itemId: id } })

         // 새 이미지 추가
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
      }

      res.json({
         success: true,
         message: '상품과 이미지가 성공적으로 수정 되었습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '상품 수정 중 오류가 발생하였습니다.', error })
   }
})

module.exports = router
