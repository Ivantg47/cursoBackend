import express from 'express'
import mongoose, {mongo} from 'mongoose'
import router from './routes/views.router.js'

const app = express()
app.use(express.json())
app.listen(8080, () => console.log('Listening...'))

mongoose.connect('mongodb+srv://admin:admin@cluster0.gaqvdp2.mongodb.net/ecommerce?retryWrites=true&w=majority', error => {
    if (error) {
        console.error('No conect', error);
        process.exit()
    }
})

app.use('/api/product', router)
app.get('/', (req, res) => {
    res.send('ok')
})