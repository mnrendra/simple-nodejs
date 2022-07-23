const express = require('express')
const mongoose = require('mongoose')

const DB_URL = 'mongodb://localhost:27017/coba'
const APP_PORT = 8080

const PenggunaSchema = new mongoose.Schema({
  name: { type: String }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

const Pengguna = mongoose.model('Pengguna', PenggunaSchema)

mongoose.connect(DB_URL)
  .then(() => {
    const app = express()

    app.use(express.json())
  
    app.get('/', async (req, res) => {
      const penggunas = await Pengguna.find()

      res.json({
        penggunas
      })
    })
  
    app.get('/:id', async (req, res) => {
      const id = req.params.id

      const satuPengguna = await Pengguna.find({ _id: id })

      res.json({
        satuPengguna
      })
    })
  
    app.post('/', async (req, res) => {
      const nama = req.body.nama

      const newPengguna = new Pengguna({
        name: nama
      })

      const savedPengguna = await newPengguna.save()

      res.json({
        savedPengguna
      })
    })
  
    app.put('/:id', async (req, res) => {
      const id = req.params.id
      const nama = req.body.nama

      const found = await Pengguna.findOne({ _id: id })
      if (found === null) {
        res.json({
          gagal: 'tidak ditemukan'
        })
      } else {
        found.name = nama
        const newPengguna = new Pengguna(found)
        const updatedPengguna = await newPengguna.save()

        res.json({
          updatedPengguna
        })
      }
    })
  
    app.delete('/:id', async (req, res) => {
      const id = req.params.id

      const found = await Pengguna.findOne({ _id: id })
      if (found === null) {
        res.json({
          gagal: 'tidak ditemukan'
        })
      } else {
        const deltedPengguna = await Pengguna.deleteOne({ _id: id })

        res.json({
          deltedPengguna
        })
      }
    })
  
    app.listen(APP_PORT, () => {
      console.log(`db connecting on port ${APP_PORT}`)
      console.log(`running on port ${APP_PORT}`)
    })
  })
  .catch((e) => {
    console.log('rusak', e)
  })
