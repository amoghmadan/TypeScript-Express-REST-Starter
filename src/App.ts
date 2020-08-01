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
    public BASE_DIR: string = path.dirname(__dirname);
    public ENV: string = process.env.ENV || 'development';
    private config: any;
    private connectionOptions: ConnectionOptions;
    private app: Application;
    private serverOptions: ServerOptions;
    private server: Server;

    private constructor() {
        this.config = JSON.parse(fs.readFileSync(path.join(this.BASE_DIR, 'resources', `${this.ENV}.json`), 'utf-8'));
        this.connectionOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        };
        this.app = express();
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
                console.log(`Environment: ${this.ENV}`);
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
