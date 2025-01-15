const express = require('express')
const router = express.Router()
const { sequelize } = require('../models')
const { Order, Item, User, OrderItem, Img } = require('../models')
const { isLoggedIn } = require('./middlewares')
const { Op } = require('sequelize')

// 주문 localhost:8000/order
router.post('/', isLoggedIn, async (req, res) => {
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

module.exports = router
