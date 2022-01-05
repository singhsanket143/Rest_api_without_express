import express from "express";
import morgan from "morgan";
import { json, urlencoded } from "body-parser";
import postRouter from "./post/post-router";
import userRouter from "./user/user-router";
import { connect } from "./util/database";
import cors from "cors";
import { register, protect, login } from "./util/authentication";

const app = express();
const router = express.Router();

app.use(cors());
app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({extended: true}));

const customLogger = (req, res, next) => {
    console.log("Logger incoming");
    console.log(req.body);
    next();
}

app.use('/api', protect);


app.use('/api/post',postRouter);
app.use('/api/user',userRouter);


app.post('/signup', register);
app.post('/signin', login);

app.get('/', (req, res) => {
    console.log("Request received");
    res.send({message: "OK GET"});
});

app.post('/', customLogger, (req, res) => {
    console.log(req.body);
    res.send({message: "OK POST"});
});

export const start = async () => {
    await connect();
    app.listen(3000, () => {
        console.log("Server started at 3000");
    });
}