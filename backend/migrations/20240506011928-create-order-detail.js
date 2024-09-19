'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_details', {
      orderDetail_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderList_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'order_lists',
          key: 'orderList_id'
        }
      },
      coffee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'coffees',
          key: 'coffee_id'
        }
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_details');
  }
};