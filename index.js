import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import { registerValidator, loginValidator, postCreateValidator } from './validations.js'
import { PostControler, UserControler } from './controlers/index.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'
import cors from 'cors'

mongoose.connect('mongodb+srv://Windy:www@cluster0.5a2c3xu.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => console.log('DB ok'))
.catch((err) => console.log('DB error', err))

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))
app.post('/auth/login', loginValidator, handleValidationErrors, UserControler.login)
app.post('/auth/register', registerValidator, handleValidationErrors, UserControler.register) 
app.get('/auth/me', checkAuth, UserControler.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.get('/tags', PostControler.getLastTags)

app.get('/posts', PostControler.getAll)
app.get('/posts/tags', PostControler.getLastTags)
app.get('/posts/:id', PostControler.getOne)
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, PostControler.create)
app.delete('/posts/:id', checkAuth, PostControler.remove)
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors, PostControler.update)

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(3333, (err) => {
  if (err) {
    return console.log(err)
  }

  console.log('Server Ok')
})