const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const MongoClient = require("mongodb").MongoClient;
// const url = ""; 

io.on("connection", function(socket) {
  console.log("User connected");

  socket.on("test", function(data) {
    socket.emit("render", data);
  });

  // MongoClient.connect(url, function(err, db) {
  //   if (err) throw err;
  //   let dbo = db.db("helloDB");
  //   dbo.collection("duumy").findOne({}, function(err, data) {
  //     if (err) throw err;
  //     socket.emit("helloWorld", data.name)
  //     db.close();
  //   });
  // });  Just Test
 

});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
