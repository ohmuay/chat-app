const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const socketio = require("socket.io");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, "./../public");
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicDirectory));

app.get("", async (req, res) => {
  // res.send()
});

io.on("connection", (socket) => {
  console.log("New socketIO connected!");

  socket.on("join", ({ username, room },callback) => {
    const {error,user} = addUser({ id: socket.id, username, room });
    if(error){
      return callback(error)
    }

    socket.join(user.room);
    socket.emit("message", generateMessage("System",`Welcome ${user.username}`));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage("System",`${user.username} has joined!`));


    io.to(user.room).emit("roomData",({room:user.room,users:getUsersInRoom(user.room)}))
    callback()
  });

  // socket.broadcast.emit("message", "New user has joined.");
  socket.on("submission", (msg, callback) => {
  const user = getUser(socket.id)

    io.to(user.room).emit("message",generateMessage(user.username,msg));
    callback();
  });
  socket.on("sendLocation", ({ latitude, longtitude }, callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit(
      "sendLocationMessage",
      generateLocationMessage(user.username,
        `https://google.com/maps?q=${latitude},${longtitude}`
      )
    );
    callback("Location Shared!");
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id)
    if(user){
      io.to(user.room).emit("message", generateMessage("System",`${user.username} has left.`));
      io.to(user.room).emit("roomData",({room:user.room,users:getUsersInRoom(user.room)}))
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});
