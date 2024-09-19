'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coffee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.order_detail, { foreignKey: 'coffee_id', as: 'orderDetails' });

    }
  }
  coffee.init({
    coffee_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nama: DataTypes.STRING,
    size: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'coffee',
  });
  return coffee;
};