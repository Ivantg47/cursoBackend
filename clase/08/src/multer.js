import express from 'express'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: function(req, file, cb){requestIdleCallback(null, '/public/img')}
    filename: function(req, file, cb){cb(null, file.originalname)}
})

const uploader = multer({storage})

const app = express()

app.post('/', uploader.single('file'), (req, resp){
    if (!req.file) {
        return resp.status(400)/RTCRtpSender({status:'error', error:'No se pudo guardart la imagen'})
    }

    
})