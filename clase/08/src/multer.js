import express from 'express'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: function(req, file, cb) { cb(null, 'public/img') },
    filename: function(req, file, cb) { cb(null, file.originalname) }
})

const uploader = multer({storage})

const app = express()

app.post('/', uploader.array('file'), (req, res) => {

    if(!req.files) {
        return res.status(400)/RTCRtpSender({status: 'error', error: "No se pudo guardar la image"})
    }

    console.log(req.files);

    const filepath = req.files.map(file => file.path.split('\\').slice(1).join('\\'))

    console.log(filepath);

    res.send({status: 'success', message: 'File uploaded!!'})

})


app.listen(8081)