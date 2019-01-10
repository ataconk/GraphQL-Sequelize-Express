var bCrypt = require('bcrypt-nodejs');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken')
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const lodash = require('lodash');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const ses = require('nodemailer-ses-transport');
// accessKeyId: 'accessKeyId',
//     secretAccessKey: 'secretAccessKey',
//     region: 

const {
    SESSION_KEY
} = process.env;
const EMAIL_SECRET = '111';
const SECRET = '111';
const SECRET_2 = '111';
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
module.exports = (passport, User) => {


    var LocalStrategy = require('passport-local').Strategy;
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id).then(function (user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: SESSION_KEY
    }, function (jwtPayload, cb) {
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        User.findOne({ where: { id: jwtPayload.id } }).then(user => {
            return cb(null, user);
        }).catch(err => {
            return cb(err);
        });
    }));

    passport.use('local-signin', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            // var user = User;
            var isValidPassword = function (userpass, password) {
                let result = bCrypt.compareSync(password, userpass);
                console.log(result);
                return result;
            }
            User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {
                if (!user) {
                    return done(null, false, {
                        message: 'Email does not exist'
                    });
                }
                if(!user.confirmed){
                    throw new Error('Please confirm your mail first')
                }
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                var userinfo = user.get();
                return done(null, userinfo);
            }).catch(function (err) {
                console.log("Error:", err);
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            });
        }
    ));
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            /*var generateHash = function (password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };*/
            User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {
                if (user) {
                    return done(null, false, {
                        
                        message: 'That email is already taken'
                    });
                } else {
                    //var password = generateHash(password); already been hashed in the model
                    var data =
                    {
                        email: email,
                        name: req.body.name,
                        surname: req.body.surname,
                        password: password
                    };
                    User.create(data).then(function (newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
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
                                    html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
                                  });
                                },
                              );
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));
}