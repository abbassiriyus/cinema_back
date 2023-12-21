const express = require('express')
const app = express()
const connectDB = require('./config/database.js')
const userRouter = require('./routes/CostomerSchemaRouter.js')
const aloqaRouter=require("./routes/aloqaRouter.js")
const CinemaRouter=require("./routes/CinemaRouter.js")
const commentRouter=require("./routes/commentRouter.js")
const comment_markRouter=require("./routes/comment_markRouter.js")
const image_cinemaRouter=require("./routes/image_cinemaRouter.js")
const janrRouter=require("./routes/janrRouter.js")
const markRouter=require("./routes/markRouter.js")
const sharxRouter=require("./routes/sharxRouter.js")
const tarjimaRouter=require("./routes/tarjimaRouter.js")
const tarjima_cinemaRouter=require("./routes/tarjima_cinemaRouter.js")
const janr_cinemaRouter=require("./routes/janr_cinemaRouter.js")

const serialarRouter=require("./routes/serialarRouter.js")
const carousel=require("./routes/carousel.js")
const payKino=require("./routes/payKino.js")





const cors = require('cors')
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const fs=require('fs')


app.use(fileUpload())
// Body parser middleware
app.use(bodyParser.json());
app.use(express.static('./uploads'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(cors({origin: '*'}))
// Главная
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'ping',
  })
})
app.get('/doc', (_req, res) => {
  const data = fs.readFileSync('./uploads/index.html',
  { encoding: 'utf8', flag: 'r' });
res.status(200).send(data)
})

app.use('/api/pay',payKino)
app.use('/api/lookme', require('./routes/lookMeRouter'));
app.use('/',userRouter)
app.use('/',aloqaRouter)
app.use('/',CinemaRouter)
app.use('/',commentRouter)
app.use('/',comment_markRouter)
app.use('/',image_cinemaRouter)
app.use('/',janrRouter)
app.use('/',markRouter)
app.use('/',sharxRouter)
app.use('/',carousel)
app.use('/',tarjimaRouter)
app.use('/',tarjima_cinemaRouter)
app.use('/',janr_cinemaRouter)

app.use('/',serialarRouter)





app.listen(4003, () => {
    console.log('Сервер запущен')
    console.log('server started')
  })
  




