import mongoose from "mongoose";

import dotenv from 'dotenv';

dotenv.config();


export function dbConnection() {
  try {
    mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected successfully ");
  } catch (error) {
    console.log("Not connected ");
  }
}
