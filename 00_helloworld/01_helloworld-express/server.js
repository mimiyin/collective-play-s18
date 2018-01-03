let port = process.env.PORT || 3000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

// Routing
app.use(express.static('public'));

