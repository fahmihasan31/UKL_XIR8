const coffeeModel = require(`../models/index`).coffee
const upload = require(`./image-coffee`).single(`image`)
const Op = require(`sequelize`).Op
const path = require(`path`)
const fs = require(`fs`)

exports.getAllCoffee = async (req, res) => {
  let kopi = await coffeeModel.findAll()
  if (kopi.length === 0) {
    return res.status(400).json({
      success: false,
      message: `data kopi tidak ada`
    })
  }
  return res.json({
    success: true,
    data: kopi,
    message: `data kopi telah di tampilkan`
  })
}

exports.findCoffee = async (req, res) => {
  let keyword = req.params.key
  let kopi = await coffeeModel.findAll({
    where: {
      [Op.or]: [
        { coffee_id: { [Op.substring]: keyword } },
        { nama: { [Op.substring]: keyword } },
        { size: { [Op.substring]: keyword } },
        { price: { [Op.substring]: keyword } },
      ]
    }
  })
  return res.json({
    success: true,
    data: kopi,
    message: `kopi ditemukan`
  })
}

exports.addCoffee = async (req, res) => {
  upload(req, res, async error => {
    if (error) {
      return res.json({
        message: error.message
      })
    }
    if (!req.file) {
      return res.json({
        message: 'Nothing to upload'
      })

    }
    let newCoffee = {
      nama: req.body.nama,
      price: req.body.price,
      size: req.body.size,
      image: req.file.filename,
    }


    if (!req.body.nama || !req.body.price || !req.body.size || !req.file) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    let existingCoffee = await coffeeModel.findOne({ where: { nama: req.body.nama } });

    if (existingCoffee) {
      return res.status(400).json({
        success: false,
        message: 'Coffee with the same name already exists'
      });
    }

    coffeeModel.create(newCoffee)
      .then(result => {
        return res.json({
          Status: true,
          Data: result,
          Message: 'Data kopi baru telah berhasil dimasukkan'
        })
      })
      .catch(error => {
        return res.json({
          Status: false,
          Message: error.message
        })
      });

  })
}

exports.updateCoffee = async (req, res) => {
  upload(req, res, async error => {
    if (error) {
      return res.json({ message: error });
    }

    let coffeeID = req.params.id;
    let dataKopi = {
      nama: req.body.nama,
      price: req.body.price,
      size: req.body.size,
      image: req.file ? req.file.filename : undefined // Jika tidak ada file, image akan menjadi undefined
    };

    // Memeriksa apakah semua input diisi
    if (!dataKopi.nama || !dataKopi.price || !dataKopi.size || !dataKopi.image) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (req.file) {
      const selectedCoffee = await coffeeModel.findOne({
        where: { coffee_id: coffeeID }
      });

      const oldImage = selectedCoffee.image;
      const pathImage = path.join(__dirname, '../image', oldImage);
      if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, error => console.log(error));
      }
      dataKopi.image = req.file.filename;
    }

    coffeeModel.update(dataKopi, { where: { coffee_id: coffeeID } })
      .then(result => {
        if (result[0] === 0) { // Jika tidak ada baris yang diupdate
          return res.json({
            success: false,
            message: 'No data updated'
          });
        } else {
          return res.json({
            success: true,
            message: 'Data coffee sudah diupdate'
          });
        }
      })
      .catch(error => {
        return res.json({
          success: false,
          message: error.message
        });
      });
  });
};


exports.deleteCoffee = async (req, res) => {
  const kopiID = req.params.id
  const coffee = await coffeeModel.findOne({ where: { coffee_id: kopiID } })
  const oldImage = coffee.image
  const pathImage = path.join(__dirname, `../image`, oldImage)

  if (fs.existsSync(pathImage)) {
    fs.unlink(pathImage, error => console.log(error))
  }
  coffeeModel.destroy({ where: { coffee_id: kopiID } })
    .then(result => {
      return res.json({
        success: true,
        message: `Data kopi sudah di hapus`
      })
    })
    .catch(error => {
      return res.json({
        success: false,
        message: error.message
      })
    })
}