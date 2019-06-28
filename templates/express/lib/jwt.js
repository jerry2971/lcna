const jwt = require('jsonwebtoken');

const SECRET = 'SECRET';
const option = {
  expiresIn: '1h' // '60ms', '2 days', '10h', '7d'
};

const jwtSign = ( body) =>{
  return jwt.sign(body, SECRET, option);
};

const jwtVerify = ( token, callback ) =>{
  jwt.verify(token, SECRET, callback);
  /***************************
  (err, decoded) => {
    if(err){
      console.log(err.name + ':' + err.message);
      winston.log('info', {title: TITLE, msg: err.name + ':' + err.message});
      res.status(400).json({msg: err.message});
    }
    console.log(decoded);
    winston.log('debug', {title: TITLE, msg: decoded});
  }
  ****************************/
};

module.exports ={
  jwtSign,
  jwtVerify
};