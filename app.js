// app.js

const express = require("express");
const mongoose = require("mongoose");

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/middleware_prac", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

const User = require('./models/user');
router.post('/users', async (req, res) => {
  const { nickname, email, password, confirmPassword } = req.body;

  // 1. 패스워드 패스워드 검증 값이 일치하는가 - 완료
  // 2. email에 해당하는 사용자가 있는가 - 완료
  // 3. nickname에 해당하는 사용자가 있는가 - 완료
  // 4. DB에 데이터를 삽입

  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: "password와 confirmPassword가 일치하지 않습니다."
    });
    return;
  }

  const existUser = await User.findOne({
    $or: [{email: email}, {nickname: nickname}]  // $or: 둘 중 하나라도 일치하면
  })

  if (existUser) {
    res.status(400).json({
      errorMessage: "Email이나 Nickname이 이미 사용중입니다."
    });
    return;
  }

  const user = new User({nickname, email, password});
  await user.save();

  res.status(201).json({});
})

app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));

app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});