
//TODO: add base urls
export const BASE_URLS : string[] = [
  'http://localhost:8081', 'http://*'];

//TODO: add cognito client & pool ids
export const CLIENT_ID: string = process.env.COGNITO_APP_CLIENT_ID as string;
export const POOL_ID: string = process.env.COGNITO_USER_POOL_ID as string;

export const ERROR_MESSAGES = {
    UNEXPECTED_PROCESSING_ERROR: 'Unexpected processing error'
}

export const USER_POOL_ATTRIBUTES = Object.freeze({
    COGNITO_USER_NAME: "cognito:username",
    EMAIL: "email",
    USER_ROLE: "custom:role",
    USER_GROUP: "cognito:groups",
})
export const NOTIFICATION_QUEUE = process.env.NOTIFICATION_QUEUE;