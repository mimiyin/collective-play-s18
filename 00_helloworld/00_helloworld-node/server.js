const http = require('http');
const PORT = 9000;

http.createServer(function (req, res) {
  // server code
  console.log(req);
  res.writeHead(200);
  res.end('Hello world!', req);
}).listen(PORT);

console.log('Server listening on port: ', PORT);
