const Sequelize = require('sequelize')

module.exports = class Cart extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {},
         {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Cart',
            tableName: 'carts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
         }
      )
   }

   static associate(db) {
      Cart.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id', onDelete: 'CASCADE' }) // belongsTo: 1:N 관계

      // 1:N 관계 설정
      Cart.hasMany(db.CartItem, { foreignKey: 'cartId', sourceKey: 'id', onDelete: 'CASCADE' })

      // 교차 테이블 관계 설정
      Cart.belongsToMany(db.Item, { through: db.CartItem, foreignKey: 'cartId', otherKey: 'itemId' }) // N:M 관계
   }
}
