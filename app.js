require('dotenv').config();
const server = require('./server/helpers/server'); // server.js includes the creation of appolo server
const { up } = require('./server/helpers/db'); // db.js includes the creation and checking of the database


   

up();
server.start();
var http = require("http");
var url = require("url");
const { exec } = require("child_process");
var KEY = "123123123123";

http
  .createServer(function(req, res) {
    console.log(req);
    var url_parts = url.parse(req.url, true);
    let key = undefined;
    try {
      key = url_parts.query.key;
    } catch (err) {}
    if (key === undefined || key !== KEY) {
      res.write("Error");
      res.end();
      return;
    } else {
      res.write("Success 1234");
      res.end();
      exec("git pull origin develop && npm i && pm2 restart Flow", (err, stdout, stderr) => {
        if (err) {
          return console.error(err);
        }
        console.log(err, stdout, stderr);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
    }
  })
  .listen(8888);

