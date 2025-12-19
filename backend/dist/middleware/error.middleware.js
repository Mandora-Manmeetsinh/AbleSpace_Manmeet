"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const AppError_1 = require("../utils/AppError");
const zod_1 = require("zod");
const errorMiddleware = (err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            status: 'fail',
            message: 'Validation Error',
            errors: err.errors,
        });
    }
    // Handle generic errors
    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};
exports.errorMiddleware = errorMiddleware;
