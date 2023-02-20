const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const http = require("http");

connectDB();

app.use(cors({origin: "*"}));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   return next();
// })
app.use(bodyParser.json());
app.use("/api/history", require("./routes/api/history"));
app.use("/api/item", require("./routes/api/item"));
app.use("/api/play", require("./routes/api/play"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/admin", require("./routes/api/admin"));

const server = http.createServer(app);
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Socket Connected");
//   socket.on("history", (msg) => {
//     io.emit("historyChanged", msg);
//   });
// });

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});