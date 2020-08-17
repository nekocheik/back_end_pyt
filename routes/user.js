var express = require('express');
var router = express.Router();

const models = require('../models');
const User = models.User

/* GET home page. */
router.get('/', function(req, res, next) {
  let {id} = req.query
  if (id) {
    User.findOne({ where : { 
      id,
    }}).then((user)=> { 
      res.status(200).json({
        message : 'user find',
        users : {
          id : user.id,
          name: user.name
        }
      })
    })
  }

});

router.post('/', function(req, res, next) {
  let userName = req.query.name
  if ( userName ) {
    userName = userName.toLocaleLowerCase()
    User.create({
      name: userName,
    }).then((user)=>{
      res.status(200).json({
        message : "new user " + userName + " is add",
        user: user,
      })
    }).catch( error  => {
      res.status(400).json({
        message : error,
      })
    })
  } else {
    res.status(400).json({
      message : 'the value is incorrect',
    })
  }
});

module.exports = router;