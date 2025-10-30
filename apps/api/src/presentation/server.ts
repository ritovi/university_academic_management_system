import express, { Router } from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";

interface Options {
    port: number;
    routes: Router;
}

export class Server {
    private app = express();
    private port: number;
    private routes: Router;

    constructor(options: Options) {
        this.port = options.port;
        this.routes = options.routes;
    }

    async start() {
        this.app.use(cors())
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use(this.routes);

        this.app.use(errorHandler);

        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port} 🫩  🫩`);
        });
    }
}
