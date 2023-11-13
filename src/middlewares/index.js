const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const makeToken = async( userId ) => {
    return jwt.sign({id:userId},process.env.TYPEORM_SECRETKEY,{expiresIn:60*60})
}

const verifyToken = async( token ) => {
    try{
        return jwt.verify(token, process.env.TYPEORM_SECRETKEY)
    }catch(err){
      err.statusCode = 400
      res.status(err.statusCode ).json({message : 'TOKEN_BROKEN'})
    }
}

module.exports = { makeToken, verifyToken }