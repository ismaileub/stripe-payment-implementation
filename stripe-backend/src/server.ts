import dotenv from "dotenv";
import app from "./app";
import { Server } from "http";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT || 5000;
const db_url = process.env.DB_URL as string;

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(db_url);

    console.log("Connected to DB!!");

    server = app.listen(PORT, () => {
      console.log(`Server is listening to port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// app.listen(PORT, () => {
//   console.log(`Server ins running on port ${PORT}`);
// });
