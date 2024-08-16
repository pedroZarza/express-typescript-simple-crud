import express, { Application, urlencoded } from "express";
require('dotenv').config();
import morgan from "morgan";
import cookieParser from "cookie-parser";
//rutas
import indexRouter from "./routes/index.routes"; //index de todas las rutas



//middlewares
import notFound from "./middlewares/notFound404";
export class App {
    app: Application;
    private port: number | undefined

    constructor(port?: number) {
        this.port = port;
        this.app = express();
        this.GlobalMiddlewares(); 
        this.Routing();
    }
    GlobalMiddlewares(){
        this.app.use(urlencoded({extended: true}));
        this.app.use(express.json());   
        this.app.use(morgan("tiny"));     
        this.app.use(cookieParser(process.env.SECRETKEY_COOKIE));
    }
    Routing() {
        this.app.use(indexRouter);
        this.app.use(notFound);
    }
    async listen() {
        this.app.listen(this.port || process.env.PORT, () => console.log(`Server Running on ${this.port || process.env.PORT}`));
    }
}