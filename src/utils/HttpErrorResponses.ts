interface IError {
    statusCode: number,
    message: string
}


export abstract class HttpError extends Error implements IError {
    statusCode: number;
    constructor(code: number, message: string) {
        super(message)
        this.statusCode = code
    }
}

class BadRequestError extends HttpError {
    constructor(message: string = "Bad request") {
        super(400, message)
    }
}

class Unauthorized extends HttpError {
    constructor(message: string = "Unauthorized") {
        super(401, message)
    }
}

class Forbidden extends HttpError {
    constructor(message: string = "Forbidden") {
        super(403, message)
    }
}

class NotFound extends HttpError {
    constructor(message: string = "Resource not found") {
        super(404, message)
    }
}

class Conflict extends HttpError {
    constructor(message: string = "Conflict") {
        super(409, message)
    }
}



class InternalServerError extends HttpError {
    constructor(message: string = "Internal server error") {
        super(500, message)
    }
}


export class ErrorFactory {
    static createError(code: number, message?: string) {
        switch (code) {
            case 400:
                return new BadRequestError(message);
            case 401:
                return new Unauthorized(message);
            case 403:
                return new Forbidden(message);
            case 404:
                return new NotFound(message);
            case 409:
                return new Conflict(message);
            case 500:
                return new InternalServerError(message);
            default:
                return new InternalServerError();
        }
    }
}




