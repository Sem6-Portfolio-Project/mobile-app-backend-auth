
export interface IUser {
    name: string;
    email: string;
    role: string;
    disabled: boolean;
    bucketName: string;
}

export interface IUserInfo {
    email: string;
    // password: string;
    // role: string;
    // userGroup?: string;
}
