// import dari dependensi pihak ke-3
const express = require('express')
const mongoose = require('mongoose')

// deklarasi variable umum (common)
const DB_URL = 'mongodb://localhost:27017/coba'
const APP_PORT = 8080

// DEKLARASI SKEMA DB
const PenggunaSchema = new mongoose.Schema({
  name: { type: String }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})
const Pengguna = mongoose.model('Pengguna', PenggunaSchema)

// CONNECT ke DB
mongoose.connect(DB_URL)
  .then(() => {
    // Inisialisasi expressJs (framework yg sering dipake nodejs), kita kasih nama 'app'
    const app = express()
    // app menggunakan fitur json (agar bisa menerima json dari luar)
    app.use(express.json())

    /*
     * Fitur GET Banyak
     */
    app.get('/', async (req, res) => {
      const penggunas = await Pengguna.find() // ini (.find) adalah metode mongodb mengambil data (row) dari db
      res.json({ penggunas }) // untuk mengirim ke client
    })
  
    /*
     * Fitur GET hanya 1 row aja
     */
    app.get('/:id', async (req, res) => {
      const id = req.params.id // mengambil paramater id yg diisi di url
      const satuPengguna = await Pengguna.findOne({ _id: id }) // ini (.findOne) adalah metode mongodb mengambil SATU data (row) dari db
      res.json({ satuPengguna }) // untuk mengirim ke client
    })
  
    /*
     * Fitur POST (menambahkan row baru ke db)
     */
    app.post('/', async (req, res) => {
      const nama = req.body.nama // mengambil nilai body yg dikirim dari client
      const newPengguna = new Pengguna({ name: nama })
      const savedPengguna = await newPengguna.save() // ini (.save) adalah metode mongodb menyimpan SATU data (row) dari db
      res.json({ savedPengguna }) // untuk mengirim ke client
    })
  
    /*
     * Fitur PUT (me-update row existing ke db)
     */
    app.put('/:id', async (req, res) => {
      const id = req.params.id // mengambil paramater id yg diisi di url
      const nama = req.body.nama // mengambil nilai body yg dikirim dari client
      const found = await Pengguna.findOne({ _id: id }) // ini (.findOne) adalah metode mongodb mengambil SATU data (row) dari db
      if (found === null) {
        res.json({ gagal: 'tidak ditemukan' }) // untuk mengirim ke client
      } else {
        found.name = nama // me-rename salah satu value data (name) dg value baru yg dikirim dari client
        const newPengguna = new Pengguna(found)
        const updatedPengguna = await newPengguna.save() // ini (.save) adalah metode mongodb menyimpan SATU data (row) dari db
        res.json({ updatedPengguna }) // untuk mengirim ke client
      }
    })

    /*
     * Fitur DELETE (hapus salah satu row)
     */
    app.delete('/:id', async (req, res) => {
      const id = req.params.id // mengambil paramater id yg diisi di url
      const found = await Pengguna.findOne({ _id: id }) // ini (.findOne) adalah metode mongodb mengambil SATU data (row) dari db
      if (found === null) {
        res.json({ gagal: 'tidak ditemukan' }) // untuk mengirim ke client
      } else {
        const deltedPengguna = await Pengguna.deleteOne({ _id: id }) // ini (.deleteOne) adalah metode mongodb hapus SATU data (row) dari db
        res.json({ deltedPengguna }) // untuk mengirim ke client
      }
    })
  
    // menjalankan aplikasi setelah semua dideklarasi kan di atas
    app.listen(APP_PORT, () => {
      console.log(`db connecting on port ${APP_PORT}`) // console hanya untuk menampilkan info aja di terminal
      console.log(`running on port ${APP_PORT}`) // console hanya untuk menampilkan info aja di terminal
    })
  })
  .catch((e) => {
    // untuk mengahndle error, ketika ada error
    console.log('rusak', e) // console hanya untuk menampilkan info aja di terminal
  })
