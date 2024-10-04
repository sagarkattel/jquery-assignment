import  express  from "express";
import { dbConnection } from "./data/db.js";
import cors from 'cors'
import bodyParser from "body-parser";
import dotenv from 'dotenv';


import cookieParser from "cookie-parser";


import userRouter from './routes/userroute.js'


// import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


import swaggerDocument from './swagger.json' assert { type: 'json' };



const app = express();
app.use(express.json());


app.use(cookieParser());

app.use(bodyParser.json()); 

dbConnection();

dotenv.config();

const allowedHeaders = [
  'Accept',
  'Content-Type',
  'Authorization',
  'Origin',
  'X-Requested-With',
  'X-HTTP-Method-Override',
  'Access-Control-Allow-Origin',
];

const allowedOrigins = [
  'http://localhost:3000',
];

// app.use(cors({
//   origin: allowedOrigins,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders,
//   credentials: true,
// }));
app.use(cors());


  

app.use("/api/v1",userRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 

  




app.get("/",(req,res)=>{
    res.json("Hello");
})


app.listen(process.env.PORT,()=>{
    console.log("Running On Port "+process.env.PORT)
})


