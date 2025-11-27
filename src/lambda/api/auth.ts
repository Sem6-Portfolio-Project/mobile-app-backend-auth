import "reflect-metadata";
import { Express } from "express";
import { container } from "tsyringe";
import serverless from "serverless-http";
import { getApp } from "../../helpers/lib/auth.js";
import { AuthRouter } from "../../routes/auth-router.js";
import {
    APIGatewayProxyEvent,
    APIGatewayProxyHandler,
    APIGatewayProxyResult,
    Context
} from 'aws-lambda';


const app: Express = getApp();

app.use('/auth', container.resolve(AuthRouter).getRoutes());

const _handler: serverless.Handler = serverless(app);

export const handler: APIGatewayProxyHandler = async (
        event: APIGatewayProxyEvent,
        context: Context
): Promise<APIGatewayProxyResult> =>{
    return (await _handler(event,context)) as APIGatewayProxyResult;
}