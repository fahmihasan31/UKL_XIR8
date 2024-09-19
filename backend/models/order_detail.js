'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.order_list, { foreignKey: 'orderList_id' });
      this.belongsTo(models.coffee, { foreignKey: 'coffee_id', as: 'orderCoffee' });
    }
  }
  order_detail.init({
    orderDetail_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    orderList_id: DataTypes.INTEGER,
    coffee_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'order_detail',
  });
  return order_detail;
};