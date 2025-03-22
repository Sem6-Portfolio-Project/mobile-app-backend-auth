
//TODO: add base urls
export const BASE_URLS : string[] = [];

//TODO: add cognito client & pool ids
export const CLIENT_ID: string = '';
export const POOL_ID: string = '';

export const ERROR_MESSAGES = {
    UNEXPECTED_PROCESSING_ERROR: 'Unexpected processing error'
}

export const USER_POOL_ATTRIBUTES = Object.freeze({
    COGNITO_USER_NAME: "cognito:username",
    EMAIL: "email",
    USER_ROLE: "custom:role",
    USER_GROUP: "cognito:groups",
})
