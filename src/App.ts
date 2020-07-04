import fs from 'fs';
import path from 'path';
import http, { Server, ServerOptions } from 'http';
import express, { Application, Router } from 'express';
import mongoose, { ConnectionOptions } from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';

export default class App {
    private static INSTANCE: App;
    private static BASE_DIR: string = path.dirname(__dirname);
    private config: any = JSON.parse(
        fs.readFileSync(path.join(App.BASE_DIR, 'resources', `${process.argv[2]}.json`), 'utf-8')
    );
    private connectionOptions: ConnectionOptions;
    private app: Application = express();
    private serverOptions: ServerOptions;
    private server: Server;

    private constructor() {
        this.connectionOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        };
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(morgan('combined'));

        routes.forEach((router: Router, prefix: string): void => {
            this.app.use(prefix, router);
        });

        this.serverOptions = {};
        this.server = http.createServer(this.serverOptions, this.app);
    }

    public async run(): Promise<void> {
        try {
            await mongoose.connect(this.config.mongoUri, this.connectionOptions);
            this.server.listen(this.config.port, '::', (): void => {
                console.log(`Server running at http://0.0.0.0:${this.config.port}`);
            });
        } catch (err) {
            throw err;
        }
    }

    public static getInstance(): App {
        if (!App.INSTANCE) {
            App.INSTANCE = new App();
        }
        return App.INSTANCE;
    }
}
