const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const models = require('../models');
const crypto = require('crypto')
const bCrypt = require('bcrypt-nodejs')
const smtpTransport = require('nodemailer-smtp-transport');
const multer = require('multer');
const lodash = require('lodash')

const multerConf = {
  storage : multer.diskStorage({ 
    destination : async (req, file ,next)=>{
      next(null,'./server/images');
    },
    filename: async (req, file, next)=>{
      const ext = file.mimetype.split('/')[1];
      console.log(file+'ASGAGSGS')
      next(null, file.fieldname + '-' + Date.now() + '.' + ext);
    }
  }),
  fileFilter: async(req, file, next)=>{
    if(!file){
      next();
    }
    const image = file.mimetype.startsWith('image/');
    if(image){
      next(null,true);
    }else{
      next({message:"File type not supported"},false);
    }
  }
};



const {
  SESSION_KEY
} = process.env;
const EMAIL_SECRET = '111';
const transporter = nodemailer.createTransport(smtpTransport({
  service: 'SMTP',
  //host: 'email-smtp.eu-west-1.amazonaws.com',
  secure: true,
  auth: {
     
      user: 'USERNAME',
      pass: 'PASSWORD'
  },
  debug: true
}));

module.exports = (app, passport,User) => {
  const db = require('../helpers/db').up();
  app.use(bodyParser.urlencoded({ extended: true }));

 
  /*app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
      res.redirect('/');
    });
    app.get('/', function (req, res) {
      res.json({ Welcome: 'This is welcome page' })
    })
  });*/

  app.post('/signin', function (req, res, next) {
    // generate the authenticate method and pass the req/res
    
    
   
    passport.authenticate('local-signin', { session: false }, (err, user, info) => {
      if (info && info.message) {
        return res.status(403).json({
          message: info.message,
          user: user
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        // generate a signed son web token with the contents of user object and return it in the response
        const token = jwt.sign(user, SESSION_KEY);
        user.last_login_date = Date().toString();
        return res.json({ user, token });
      });
    })(req, res, next);
  });

  app.post('/signup', function (req, res, next) {
    // generate the authenticate method and pass the req/res
    passport.authenticate('local-signup', function (err, user, info) {
      if (info && info.message) {
        return res.status(403).json({
          message: info.message,
          user: user
        });
      }
      return res.send(user);
    })(req, res, next);
  });

   app.get('/confirmation/:tokenz', async (req, res) => {
    try {
      const { user: { email } } = jwt.verify(req.params.tokenz, EMAIL_SECRET);

      
      await models.User.update({ confirmed: true }, { where: { email} })
      
    } catch (e) {
     console.log(e)
     return res.send('error:'+e);
    }
  
    return res.send('Your e-mail is confirmed');
  });
 app.post('/resend',  async (req,res) =>{
  /*var generateHash = function (password) {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
  };*/
  const user = await models.User.findOne({
      where: {
          email: req.body.email
      }
  });
  if (!user) {
    res.send('no user found')
  } else {
      //var password = generateHash(password); already been hashed in the model
      var data =
      {
          email: req.body.email
      };
          if (user.confirmed==false) {
              jwt.sign(
                  {user: lodash.pick(data, 'email'),   },

                  EMAIL_SECRET,

                  {expiresIn: '1d', },
                  
                  (err, emailToken) => {
                    const url = `http://localhost:8000/confirmation/${emailToken}`;
          
                    transporter.sendMail({
                      from: 'youremail',
                      to: data.email,
                      subject: 'Confirm Email',
                      html: `Please click this email asf to confirm your email: <a href="${url}">${url}</a>`,
                    });
                  },
                );
              res.send('successful')
          }else{
            res.send('your mail is already confirmed')
          }
          
      }
 
});

  

  app.post('/forgot', async (req, res, next) => {
    try {
    const buf = crypto.randomBytes(32);
    var tokenfg = buf.toString('hex');
    console.log(tokenfg);
    const user = await models.User.findOne({where: {email: req.body.email} });
    
    user.resetPassToken = tokenfg;
    user.resetPassExpires = Date.now() + 3600000; // 1 hour
    user.save().then(() => { });

    console.log(user.id)
    const url = `http://localhost:8000/reset/${tokenfg}`;
    transporter.sendMail({
      from: 'youremail',
      to: user.email,
      subject: 'Password Reset Request ',
      html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        `<a href="${url}">${url}</a>` + '\n'+
        
        'If you did not request this, please ignore this email and your password will remain unchanged.\n' 
        
    });
  }catch(e) {
    console.log(e)
    return res.send('FAILED:'+e);
  }
  return res.send('SUCCESS');
  });

  app.get('/reset/:tokenfg', async (req, res) =>{
    try{
    const user = await models.User.findOne({ where:{
      resetPassToken: req.params.tokenfg,
      resetPassExpires: { $gt: Date.now() } }
    })
      if (!user) {
        console.log('error', 'Password reset token is invalid or has expired.');
        return res.send('error', 'Password reset token is invalid or has expired.')
      }
    
    }catch(e){
      console.log(e)
    return res.send('FAILED');
    }
    return res.send('SUCCEEDED AGAIN')
  
  });

  app.post('/reset/:tokenfg', async(req, res)=> {
    try{
        const user = await models.User.findOne({ where: {
          resetPassToken: req.params.tokenfg,
          resetPassExpires: { $gt: Date.now() } }
        });
          if (!user) {
            return res.send('Password reset token is invalid or has expired.');
          }
  
          user.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10));
          user.resetPassToken = null;
          user.resetPassExpires = null;
          user.save().then(() => { });
    
    
        transporter.sendMail({  
          to: user.email,
          subject: 'Your password has been changed',
          html: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        });
      }catch(e){
        console.log(e)
      return res.send('FAILED');
      }
      return res.send('SUCCEEDED AGAIN')
    });
      
app.post('/upload', multer(multerConf).single('photo'), async(req,res) =>{
  // if(req.file){
  //   console.log(req.file);
  //   // req.body.photo = req.file.filename;
  // }
 
          console.log(req.body.photo)
          var authorization = req.headers.authorization;

          authorization=authorization.split('Bearer ')[1];
          //console.log(authorization)

          userInfo = jwt.verify(authorization, SESSION_KEY);
          
          var userId = userInfo.id;
          //console.log(userId)
          // Fetch the user by id 
         const user = await models.User.findOne({ where: {
          id: userId
           }
           });

          user.imagePath=req.file.path;
          user.save();

          console.log(user.imagePath)
          //console.log(req.file)

          return res.send('DONE')
          
      
    //user.imagePath=req.body.photo
  })
    



}