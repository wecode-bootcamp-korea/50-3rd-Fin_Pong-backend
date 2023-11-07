// const jwt = require("jsonwebtoken")
// const secretKey = process.env.SECRET_KEY
// const error = require("../utils/auth")
// const tokenValidation = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;
//     const accessToken = jwt.verify(token, secretKey) // token 검증
//     const userId = accessToken["userId"];
//     const foundUser = await existingUser({ id })
//     if (!foundUser) {// 이 토큰을 가진 유저가 데이터베이스에 없으면 404 에러를 냅니다.
//       error.throwErr({ statusCode: 404, message: 'USER NOT FOUND' });
//     }
//     req.foundUser = userId; //
//     next()
//   } catch (err) {
//     next(err)
// }
//
// module.exports = { tokenValidation }