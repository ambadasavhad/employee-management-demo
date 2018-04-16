var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var User = mongoose.model('User'); 
//var User = require("../models/User");
var Employee = require("../models/Employee");


getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Express RESTful API');
});

router.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      designation: req.body.designation
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        res.status(500);
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

router.post('/signin', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token, user:user});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.post('/employee', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var newEmployee = new Employee({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      designation: req.body.designation,
      salary:req.body.salary
    });

    newEmployee.save(function(err,emploee) {
      if (err) {
        return res.json({success: false, msg: 'Save employee failed.'});
      }
      res.json({success: true, data:emploee});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.put('/employee/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if(!req.params.id){
    return res.status(500).send({success:false,msg:'Unable to find record'});
  }
  if (token) {
   
    Employee.findOneAndUpdate({_id:req.params.id}, req.body, function (err, emp) {
      if (err) {
        return res.json({success: false, msg: 'Update employee failed.'});
      }
      res.status(200).send({success:true,data:emp});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/employee', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Employee.find(function (err, books) {
      if (err) return next(err);
      res.json(books);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.delete('/employee/:id',passport.authenticate('jwt', { session: false}),function(req,res){
  var token = getToken(req.headers);
  if (token) {
    Employee.findByIdAndRemove(req.params.id, (err, emp) => {  
      if (err) return res.status(500).send(err);
      const response = {
          message: "Employee successfully deleted",
          id: emp._id
      };
      return res.status(200).send(response);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }  
});

module.exports = router;