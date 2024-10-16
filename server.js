import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let io;

app.prepare().then(() => {
    const httpServer = createServer(handler);

     io = new Server(httpServer, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"]
        }
      });

    io.on("connection", (socket) => {
      console.log("Connecting...", socket.id);
        socket.on('deleted', (data) => {
            socket.broadcast.emit('deleted', data);
        })    
      });

    httpServer
    .once("error", (err) => {
        console.error(err);
        process.exit(1);
    })
    .listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
    
});

export {io}