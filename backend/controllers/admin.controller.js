const adminModel = require(`../models/index`).admin
const md5 = require(`md5`)
const Op = require(`sequelize`).Op

//menampilkan semua admin
exports.getAlladmin = async (req, res) => {
  let admin = await adminModel.findAll()
  if (admin.length === 0) {
    return res.status(400).json({
      success: false,
      message: `data admin tidak ada`
    })
  }
  return res.json({
    success: true,
    data: admin,
    message: `semua admin telah di tampilkan`
  })
}

//mencari admin
exports.findAdmin = async (req, res) => {
  let keyword = req.params.key

  let admins = await adminModel.findAll({
    where: {
      [Op.or]: [
        { admin_id: { [Op.substring]: keyword } },
        { name: { [Op.substring]: keyword } },
        { email: { [Op.substring]: keyword } },
      ]
    }
  })
  return res.json({
    success: true,
    data: admins,
    message: `admin ditemukan`
  })
}

//tambah admin
exports.addAdmin = async (req, res) => {
  let newAdmin = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password)
  }

  let existingUser = await adminModel.findOne({ //cek ada apa nggak email yang sama
    where: {
      [Op.or]: [
        { email: newAdmin.email },
      ]
    }
  })

  if (existingUser) {
    return res.status(400).json({ //klo ada, false
      success: false,
      message: `email sudah terdaftar`
    })
  }
  else {
    await adminModel.create(newAdmin)
      .then(result => {
        return res.json({
          success: true,
          data: result,
          message: `data admin berhasil ditambahkan`
        })
      })
      .catch(error => {
        console.log(error.message)
        return res.status(400).json({
          success: false,
          message: `data admin gagal ditambahkan`,
        })
      })
  }

}

exports.updateAdmin = async (req, res) => {
  let adminID = req.params.id //id admin 

  let dataAdmin = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password)
  }

  if (req.body.password) {
    dataAdmin.password = md5(req.body.password);
  }

  adminModel.update(dataAdmin, { where: { admin_id: adminID } })
    .then(result => {
      return res.json({
        success: true,
        data: result,
        message: `data admin berhasil diupdate`
      })
    })
    .catch(error => {
      console.log(error.message)
      return res.status(400).json({
        success: false,
        message: `data admin gagal diupdate`
      })
    })
}


exports.deleteAdmin = async (req, res) => {
  let adminID = req.params.id

  adminModel.destroy({ where: { admin_id: adminID } })
    .then(result => {
      return res.status(200).json({
        success: true,
        message: `Data admin telah di hapus`
      })
    })
    .catch(error => {
      console.log(error.message)
      return res.status(400).json({
        success: false,
        message: `Data admin gagal di hapus`
      })
    })
}

exports.resetPass = async (req, res) => {
  let adminID = req.params.id

  let dataAdmin = {
    password: md5("Moklet")
  }

  adminModel.update(dataAdmin, { where: { admin_id: adminID } })
    .then(result => {
      return res.json({
        success: true,
        message: `password admin telah di reset: Moklet`
      })
    })
    .catch(error => {
      console.log(error.message)
      return res.status(400).json({
        success: false,
        message: `password admin gagal di reset`
      })
    })
}