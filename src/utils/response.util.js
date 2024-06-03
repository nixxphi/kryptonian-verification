class Response {
    constructor(res, status, success, message, data, pagination) {
        this.res = res;
        this.status = status;
        this.success = success;
        this.message = message;
        this.data = data;
        this.pagination = pagination;
    }
}

class CreatedSuccessfully extends Response {
    constructor(res, message, data){
        super(res, 200, true, message, data)
    }
}

export function sendResponse(
    res,
    status,
    success,
    message,
    data,
    pagination
) {
   
    const response = {
        status,
        success,
        message,
        pagination,
        data
    };

    return res.status(status).json(response);
}