import { Express } from "express";
import { container } from "tsyringe";
import serverless from "serverless-http";
import { getApp } from "../../helpers/lib/auth";
import { AuthRouter } from "../../routes/auth-router";


const app = getApp();

app.use('/auth', container.resolve(AuthRouter).getRoutes());