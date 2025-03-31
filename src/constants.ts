
//TODO: add base urls
export const BASE_URLS : string[] = ['http://localhost:8081','http://*'];

//TODO: add cognito client & pool ids
export const CLIENT_ID: string = 'vu9mnne94bjq2aeg2448s7486';
export const POOL_ID: string = 'us-east-1_sNqa2KpJp';

export const ERROR_MESSAGES = {
    UNEXPECTED_PROCESSING_ERROR: 'Unexpected processing error'
}

export const USER_POOL_ATTRIBUTES = Object.freeze({
    COGNITO_USER_NAME: "cognito:username",
    EMAIL: "email",
    USER_ROLE: "custom:role",
    USER_GROUP: "cognito:groups",
})


