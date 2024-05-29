import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/db_connections.js";
dotenv.config({ path: ".env" });

connectDB()
  .then(() => {
    //check for error app.on
    app.on("error", (err) => {
      console.log("error while connecting to server", err);
    });
    //listen the server app.listen
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Something went wrong while connecting to database", error);
  });
