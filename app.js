const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./src/routes');
const app = express()

dotenv.config()

app.use(cors())
app.use(express.json())
app.use(routes)

app.get('/ping',(req,res) => {
    res.status(200).json({
        message: 'pong'
    })
})
app.get("/signup", (req, res) => {
  res.send(`
  <a href="https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REST_API_KEY}&redirect_uri=${process.env.SIGN_UP_REDIRECT_URI}&response_type=code">
  <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" />
</a>
  `);
});

app.get("/signin", (req, res) => {
  res.send(`
  <a href="https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REST_API_KEY}&redirect_uri=${process.env.SIGN_IN_REDIRECT_URI}&response_type=code">
  <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" />
</a>
  `);
});

const server = http.createServer(app)

const start = async () => {
    try {
      server.listen(process.env.TYPEORM_SERVER_PORT, () => console.log(
        `Server is listening on ${process.env.TYPEORM_SERVER_PORT}`))
    } catch (err) { 
      console.error(err)
    }
  }

start()

