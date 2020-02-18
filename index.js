require('dotenv').config();

const server = require('./api/server');

const port = process.env.PORT || 5050;
server.listen(port, () => {
  console.log(`Running on port ${port}...`);
});