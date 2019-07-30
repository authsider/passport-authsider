export class ConfigurationError extends Error {

    constructor(option: string) {
        super(`You must provide the ${option} configuration.`)
    }

}

export class UserProfileFetchError extends Error {

    readonly statusCode: number;
    readonly data?: any;


    constructor(statusCode: number, data?: any) {
        super(`Failed to fetch the user profile. HTTP ${statusCode}`);
        this.statusCode = statusCode;
        this.data = data;
    }

}
