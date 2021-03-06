const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

//midlewares
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);
mongoose
  .connect(
    "mongodb+srv://agastech:agastech123@cluster0.w7kz4.mongodb.net/mernauth?retryWrites=true&w=majority",
    {}
  )
  .then(() => {
    app.listen(5000, () => {
      console.log("app  is runing on 5000 and DB is connected");
    });
  })
  .catch(console.error());
