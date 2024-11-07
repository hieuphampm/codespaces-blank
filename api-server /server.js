require('dotenv').config();
const restify = require('restify');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');

const server = restify.createServer();
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser({ mapParams: true }));
server.use(restify.plugins.queryParser());

employeeRoutes(server);

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});
