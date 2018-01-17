let port = process.env.PORT || 8000;

// Get the express web application framework
let express = require('express');
// Create an express app
let app = express();
// Make a web application server!
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

// Tell server where to look for files
app.use(express.static('public'));

