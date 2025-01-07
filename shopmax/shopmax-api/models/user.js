const Sequelize = require('sequelize')

module.exports = class User extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            email: {
               type: Sequelize.STRING(255),
               allowNull: false,
               unique: true,
            },
            name: {
               type: Sequelize.STRING(255),
               allowNull: false,
            },
            password: {
               type: Sequelize.STRING(255),
               allowNull: false,
            },
            role: {
               type: Sequelize.ENUM('ADMIN', 'USER'), // 'ADMIN' 또는 'USER'만 값으로 허용
               allowNull: false,
               defaultValue: 'USER', // 기본값 'USER'
            },
            address: {
               type: Sequelize.STRING(255),
               allowNull: false,
            },
         },
         {
            sequelize,
            timestamps: true, //createAt, updateAt ..등 자동 생성
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false, //deleteAt 사용 X
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
         }
      )
   }

   static associate(db) {
      User.hasOne(db.Cart, { foreignKey: 'userId', sourceKey: 'id', onDelete: 'CASCADE' }) // hasOne: 1:1 관계

      User.hasMany(db.Domain, { foreignKey: 'userId', sourceKey: 'id', onDelete: 'CASCADE' }) // hasMany: 1:N 관계

      User.hasMany(db.Order, { foreignKey: 'userId', sourceKey: 'id', onDelete: 'CASCADE' }) // hasMany: 1:N 관계
   }
}
