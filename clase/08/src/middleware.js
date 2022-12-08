import express from 'express'

const app = express()

//error
app.use(function (err, req, res, next){
    console.error(err.stack);
    res.status(500).send('roto')
})

app.use(function(req, res, next){
    console.log(req.query);
    if (req.query == 'hola') {
        return res.send('no info')
    }
    console.log('Time: ', new Date().toLocaleDateString());
    next()
})

function midl(req, res, next){
    req.dato1 = 'mis dato'
    next()
}

router.get('/info', (req, res) => {
    res.status(200).send('More info')
})

router.get('/', (req, res) => {
    res.status(200).send('ok')
})

app.listen(8080)