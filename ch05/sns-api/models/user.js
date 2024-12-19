const Sequelize = require('sequelize')

module.exports = class User extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            email: {
               type: Sequelize.STRING(40),
               allowNull: false,
               unique: true,
            },
            nick: {
               type: Sequelize.STRING(15),
               allowNull: false,
            },
            password: {
               type: Sequelize.STRING(100),
               allowNull: false,
            },
         },
         {
            sequelize,
            timestamps: true, // createAt, updateAt ..등 자동 생성
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
         }
      )
   }

   static associate(db) {
      db.User.hasMany(db.Post)
      db.User.belongsToMany(db.User, {
         foreignKey: 'followingId', // Follow 테이블에서 사용할 FK
         as: 'Followers', // User 테이블 별명
         through: 'Follow', // 교차 테이블명
      })
      db.User.belongsToMany(db.User, {
         foreignKey: 'followerId',
         as: 'Followings',
         through: 'Follow',
      })
   }
}
