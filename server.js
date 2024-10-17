import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";


import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017/filipizen-vc?retryWrites=true";
const client = new MongoClient(uri) ;


const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let io;


async function watchRqueueCollection() {
  try {
      await client.connect();
      const db = client.db('filipizen-vc');
      const rqueueCollection = db.collection('rqueue');

      const pipeline = [];
      const changeStream = rqueueCollection.watch(pipeline);

      changeStream.on('change', (change) => {
          console.log(change);
      });
      
  } catch (err) {
      console.error('Error watching collection:', err);
  } finally {
    
  }
}

 await watchRqueueCollection().catch(console.error);



//Helper funtion to close the stream
async function closeChangeStream(timeInMs = 60000, changeStream) {
  return new Promise((resolve) => {
      setTimeout(() => {
          console.log("Closing the change stream");
          changeStream.close();
          resolve();
      }, timeInMs)
  })
};




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
        socket.on('documentDeleted', (data) => {
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