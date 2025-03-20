import cors from 'cors';
import helmet from "helmet";
import bodyParser from "body-parser";
import express, { Express, Request } from "express";

const BASE_URLS: string[] = []

export const getApp = (): Express => {
    const app: Express = express();
    app.use(
        cors((
            req: Request,
            callback: (arg0: null, arg1: {origin: boolean}) => void
            ): void => {
                callback(null,{
                    origin: BASE_URLS.includes(<string>req.header("Origin"))
                });
            }
        ),
    );
    app.use(helmet());
    app.use(bodyParser.json({ strict: false }));
    return app;
}