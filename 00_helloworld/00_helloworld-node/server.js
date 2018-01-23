// Get node's HTTP functionality: https://nodejs.org/api/http.html
let http = require('http');
let port = process.env.PORT || 8000;

// Make a web server
http.createServer(function (req, res) {
  // Send a request to your server from your browser here: http://localhost:3000/
  // Print out the request
  console.log(req);
  // Send an A-OK status
  // Go to the Network tab of your browser console
  // Reload the page to see the status message
  res.writeHead(200);
  // Send a message back to the client
  // No html required!
  res.end('Hello world!', req);
}).listen(port);

console.log('Server listening on port: ', port);
