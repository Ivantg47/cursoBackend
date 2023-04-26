import multer from 'multer'

const storage = multer.diskStorage({
    destination: function(req, file, cb) { 
        
        if (file.fieldname == 'thumbnail') {
            cb(null, '/upload/img/products')
        } else if (file.fieldname == 'profiles') {
            cb(null, '/upload/img/profiles')
        } else if (file.fieldname == 'domicilio') {
            cb(null, '/upload/docs/domicilio')
        } else if (file.fieldname == 'estadoCuenta') {
            cb(null, '/upload/docs/estadoCuenta')
        }
    },
    filename: function(req, file, cb) { cb(null, file.originalname) }
})

const uploader = multer({storage})

export default uploader