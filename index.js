const express = require('express');
const cors = require('cors');
const cluster = require("cluster");
const os = require("os");
const numCpus = os.cpus().length;
const createError = require('http-errors');
const http = require('http');
const PORT =3001;
const app = express();
const {socketConnections} = require("./socket")

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (cluster.isMaster) {
  for (let i = 0; i < numCpus; i++) {
    cluster.fork();
  }
  
  cluster.on("exit", (worker, code, signal) => {
    cluster.fork();
  });
} else {
  const server = http.createServer(app);
  const io = require("socket.io")(server, {
    cors: {
      origin: "*"
    }
  });

  socketConnections(io)

  
  server.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT} on pid ${process.pid}`));
}