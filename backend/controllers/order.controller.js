const OrderList = require('../models/index').order_list;
const OrderDetail = require('../models/index').order_detail;
const Coffee = require('../models/index').coffee;

// Fungsi untuk menambahkan transaksi baru
exports.createOrder = async (req, res) => {
  try {
    const { customer_name, order_type, order_date, order_detail } = req.body;

    // Validasi input untuk memastikan semua data tersedia
    if (!customer_name || !order_type || !order_date || !order_detail) {
      return res.status(400).json({
        status: false,
        message: 'Semua data harus diisi'
      });
    }

    // Buat transaksi baru di tabel "order_list"
    const orderList = await OrderList.create({
      customer_name,
      order_type,
      order_date
    });

    // Simpan detail transaksi ke dalam tabel "order_detail"
    await Promise.all(order_detail.map(async (detail) => {
      const coffee = await Coffee.findByPk(detail.coffee_id); // Cari kopi berdasarkan ID
      if (coffee) { // Pastikan kopi ditemukan
        await OrderDetail.create({
          orderList_id: orderList.orderList_id,
          coffee_id: detail.coffee_id,
          price: coffee.price, // Ambil harga kopi dari database
          quantity: detail.quantity
        });
      } else {
        throw new Error(`Coffee with ID ${detail.coffee_id} not found.`);
      }
    }));

    res.status(201).json({
      status: true,
      data: {
        id: orderList.orderList_id, // Ganti dengan ID order yang benar
        customer_name: orderList.customer_name,
        order_type: orderList.order_type,
        order_date: orderList.order_date,
        createdAt: orderList.createdAt,
        updatedAt: orderList.updatedAt
      },
      message: 'Order list has been created'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: false, message: 'Failed to create order list', error: error.message });
  }
};

exports.getAllOrder = async (req, res) => {
  try {
    // Ambil semua data dari tabel "order list" dengan detailnya
    const orders = await OrderList.findAll({
      include: [{
        model: OrderDetail,
        as: 'orderDetails' // Menggunakan alias yang telah didefinisikan di model
      }]
    });

    // Format respons sesuai kebutuhan
    const formattedOrders = orders.map(order => ({
      id: order.orderList_id,
      customer_name: order.customer_name,
      order_type: order.order_type,
      order_date: order.order_date,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      order_detail: order.orderDetails.map(detail => ({
        id: detail.orderDetail_id,
        order_id: detail.orderList_id, // Ubah 'order_id' menjadi 'orderList_id'
        coffee_id: detail.coffee_id,
        quantity: detail.quantity,
        price: detail.price,
        total: detail.price * detail.quantity,
        createdAt: detail.createdAt,
        updatedAt: detail.updatedAt
      }))
    }));


    res.json({
      status: true,
      data: formattedOrders,
      message: 'Order list has retrieved'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: false, message: 'Gagal mengambil daftar pesanan' });
  }
};

