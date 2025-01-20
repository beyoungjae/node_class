const express = require('express')
const router = express.Router()
const { sequelize } = require('../models')
const { Order, Item, User, OrderItem, Img } = require('../models')
const { isLoggedIn, verifyToken } = require('./middlewares')
const { Op } = require('sequelize')

// 주문 localhost:8000/order
router.post('/', verifyToken, isLoggedIn, async (req, res) => {
   /* ★트랜잭션 처리: 주문 처리 중 에러 발생시 차감된 재고를 복구하지 않으면 데이터가 
     불일치 상태가 되므로 트랜잭션 처리 
 
      <아래 3가지가 쪼갤 수 없는 업무 단위인 트랜잭션으로 묶임, 3가지 중 하나에서 문제 발생시 3가지 모두 취소됨>
      -Order 테이블에 주문내역 insert
      -Item 테이블에서 재고 차감
      -OrdertItem 테이블에 주문상품 insert
     */
   const transaction = await sequelize.transaction() // 하나의 트랜잭션

   try {
      // 주문 상품 목록 데이터
      // req.body = { items: [{itemId: 1, count: 2 }, {itemId: 2, count: 1 }] }
      const { items } = req.body

      // 회원 확인(주문은 회원만 가능)
      const user = await User.findByPk(req.user.id)
      if (!user) {
         throw new Error('회원이 존재하지 않습니다.')
      }

      // Order 테이블에 주문내역 insert
      const order = await Order.create(
         {
            userId: user.id,
            orderDate: new Date(),
            orderStatus: 'ORDER',
         },
         { transaction } // 하나의 트랜잭션으로 묶을 작업에만 { transaction } 작성
      )

      // Item 테이블에서 재고 차감

      let totalOrderPrice = 0 // 총 주문 상품 가격

      /*
       Promise.all(...): 비동기 작업들을 병렬실행(여러작업을 동시 실행)을 통해 성능을 최적화 한다.
       
       각 비동기 작업 async (item) => { .. } 을 병렬로 실행한다.
       아래와 같이 for문을 이용해 처리하는 것은 성능상 효율적이지 X
       다만, 단순하게 findByPk만 한다면 아래와 같이 처리해도 괜찮음
       하지만 상품확인, 재고차감, 재고 update 와 같은 여러가지 일을 처리할 경우
       비동기 + 병렬 처리 방식을 추천

       for(const item of items) {
           const product = await Item.findByPk(item.itemId, { transaction })
           ...
           ...
       }
      */
      const orderItemsData = await Promise.all(
         // items: [{itemId: 1, count: 2 }, {itemId: 2, count: 1 }]
         items.map(async (item) => {
            //1. 주문한 상품이 있는지 확인
            const product = await Item.findByPk(item.itemId, { transaction })

            if (!product) {
               throw new Error(`상품 id ${item.itemId}에 해당하는 상품이 존재하지 않습니다.`)
            }

            // 주문한 상품의 재고가 있는지 확인
            if (product.stockNumber < item.count) {
               throw new Error(`상품 id ${item.itemId}에 해당하는 상품의 재고가 부족합니다.`)
            }

            //2. 재고 차감
            product.stockNumber -= item.count

            //3. 재고 차감 후 item 테이블에 update
            await product.save({ transaction })

            // 총 주문 상품 가격 누적 합산
            const orderItemPrice = product.price * item.count
            totalOrderPrice += orderItemPrice

            //orderItems 테이블에 insert 해줄 값을 return
            return {
               orderId: order.id,
               itemId: product.id,
               orderPrice: orderItemPrice,
               count: item.count,
            }
         })
      )

      // OrdertItem 테이블에 주문상품 insert
      await OrderItem.bulkCreate(orderItemsData, { transaction })

      // 트랜잭션 커밋
      await transaction.commit()

      res.status(201).json({
         success: true,
         message: '주문이 성공적으로 생성되었습니다.',
         orderId: order.id, // 주문 id
         totalPrice: totalOrderPrice, //총 주문 상품 금액
      })
   } catch (error) {
      await transaction.rollback() // 트랜잭션 롤백

      console.error(error)
      res.status(500).json({ success: false, message: '주문 중 오류가 발생했습니다.', error })
   }
})

// 주문 목록(페이징)
// localhost:8000/order/list?page=1&limit=5&startDate=2025-01-01&endDate=2025-01-16
router.get('/list', verifyToken, isLoggedIn, async (req, res) => {
   try {
      // 페이지 번호는 ?page=1로 요청이 오면 그 값을, 없으면 기본값 1을 사용
      const page = parseInt(req.query.page, 10) || 1

      // 한 페이지에 보여줄 항목 개수는 ?limit=5로 요청이 오면 그 값을, 없으면 기본값 5를 사용
      const limit = parseInt(req.query.limit, 10) || 5

      // (페이지 번호 - 1) * 한 페이지에 보여줄 항목 수 로 오프셋 계산
      const offset = (page - 1) * limit

      // 시작 날짜와 끝 날짜를 가져옴
      const startDate = req.query.startDate // YYYY-MM-DD 형식 (예: 2025-01-01)
      const endDate = req.query.endDate // YYYY-MM-DD 형식 (예: 2025-01-16)

      const endDateTime = `${endDate} 23:59:59` // 년월일만 받을 시 시분초는 00:00:00으로 인식하므로 시간 변경(endDate 날짜에 주문한 내용도 검색되도록 강제적으로 23:59:59까지 가져올 수 있도록 지정함)

      // 주문 내역의 총 개수를 구함
      const count = await Order.count({
         where: {
            userId: req.user.id, // 주문한 사람의 id를 가져옴
            ...(startDate && endDate ? { orderDate: { [Op.between]: [startDate, endDateTime] } } : {}), // startDate랑 endDate가 있으면? orderDate의 startDate와 endDate 사이의 값을 가져오고, 없으면 빈 값
         },
      })

      // 실제 주문 목록을 가져오기 (페이징 처리 포함)
      const orders = await Order.findAll({
         where: {
            userId: req.user.id, // 주문한 사람의 id를 가져옴
            ...(startDate && endDate ? { orderDate: { [Op.between]: [startDate, endDateTime] } } : {}), // 날짜 검색
         },
         limit: parseInt(limit), // 한 페이지에 몇 개의 주문을 보여줄지
         offset: parseInt(offset), // 페이지에 맞는 시작 위치 (이전 페이지는 건너뛰기)
         include: [
            {
               model: Item, // 주문 내역에 포함된 아이템 정보도 가져옴
               attributes: ['id', 'itemNm', 'price'], // 아이템 ID, 이름, 가격만 가져옴
               // 교차테이블 데이터(OrderItem 테이블에서 필요한 컬럼 선택)
               through: {
                  attributes: ['count', 'orderPrice'], // 주문한 수량과 가격 정보 가져옴
               },
               include: [
                  {
                     model: Img, // 이미지 테이블의 정보도 가져옴
                     attributes: ['imgUrl'], // attributes는 필요한 컬럼을 가져오는 것
                     where: { repImgYn: 'Y' }, // 어디에서? repImgYn의 Y가 체크된, 대표이미지만 가져온다
                  },
               ],
            },
         ],
         order: [['orderDate', 'DESC']], // 최근 주문내역이 먼저 오도록 정렬을 하는 것.
      })

      // 결과를 클라이언트에 응답
      res.status(200).json({
         success: true,
         message: '주문 목록 조회 성공',
         orders, // 조회한 주문 내역
         pagination: {
            totalOrder: count, // 전체 주문 내역의 개수
            totalPages: Math.ceil(count / limit), // 전체 페이지 수 (소수점 올림)
            currentPage: page, // 현재 페이지 번호
            limit, // 한 페이지에 표시할 주문 개수
         },
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '주문 내역 조회 중 오류가 발생했습니다.', error })
   }
})

// 주문 취소
router.post('/cancel/:id', verifyToken, isLoggedIn, async (req, res) => {
   // sequelize.transaction()을 사용해 트랜잭션을 시작
   const transaction = await sequelize.transaction()

   try {
      // URL 파라미터에서 주문 ID를 추출
      const { id } = req.params

      // 주어진 주문 ID에 해당하는 주문을 찾고, 관련된 OrderItem과 그에 속한 Item도 함께 가져옴
      const order = await Order.findByPk(id, {
         include: [
            {
               model: OrderItem, // 주문 항목 모델
               include: [{ model: Item }], // 각 주문 항목에 해당하는 아이템 정보 포함
            },
         ],
         transaction, // 트랜잭션을 사용해 쿼리 실행
      })

      // 주문이 없으면 오류 반환
      if (!order) {
         return res.status(404).json({
            success: false,
            message: '주문 내역이 없습니다.',
         })
      }

      // 주문 상태가 이미 'CANCEL'이면 취소된 주문이라 400 오류 반환
      if (order.orderStatus === 'CANCEL') {
         return res.status(400).json({
            success: false,
            message: '이미 취소된 주문입니다.',
         })
      }

      // 재고 복구: 주문된 각 아이템에 대해 재고 수량을 복구
      for (const orderItem of order.OrderItems) {
         const product = orderItem.Item // 주문 항목에 해당하는 아이템 정보

         // 주문한 수량만큼 재고를 복구
         product.stockNumber += orderItem.count

         // 재고 변경 사항을 트랜잭션을 통해 저장
         await product.save({ transaction })
      }

      // 주문 상태를 'CANCEL'로 변경하여 주문 취소 처리
      order.orderStatus = 'CANCEL'

      // 변경된 주문 상태를 트랜잭션을 통해 저장
      await order.save({ transaction })

      // 모든 작업이 성공했으므로 트랜잭션 커밋
      await transaction.commit()

      res.json({
         success: true,
         message: '주문이 성공적으로 취소되었습니다.',
      })
   } catch (error) {
      // 모든 작업 중 하나라도 실패했을 경우 트랜잭션 롤백
      await transaction.rollback()
      console.error(error)
      res.status(500).json({ success: false, message: '주문 취소 중 오류가 발생했습니다.', error })
   }
})

// 주문 삭제
router.delete('/delete/:id', verifyToken, isLoggedIn, async (req, res) => {
   try {
      // URL 파라미터에서 삭제할 주문의 ID를 추출
      const { id } = req.params

      // 주어진 주문 ID로 해당 주문을 데이터베이스에서 찾음
      const order = await Order.findByPk(id)

      // 만약 주문이 존재하지 않으면 오류 반환
      if (!order) {
         return res.status(404).json({
            success: false,
            message: '주문 내역이 없습니다.',
         })
      }

      // 주문을 삭제합니다. 'CASCADE' 설정에 따라 해당 주문에 연관된 OrderItem도 함께 삭제됨
      await Order.destroy({ where: { id: order.id } })

      // 삭제가 성공적으로 이루어진 경우, 성공 메시지를 반환
      res.json({
         success: true,
         message: '주문 내역이 성공적으로 삭제되었습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '주문 삭제 중 오류가 발생했습니다.', error })
   }
})

module.exports = router
