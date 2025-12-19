"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_service_1 = __importDefault(require("./services/socket.service"));
// Import routes (assuming they exist or will be imported)
const task_routes_1 = __importDefault(require("./routes/task.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/api/tasks', task_routes_1.default);
// Initialize Socket.io
socket_service_1.default.initialize(httpServer);
// Error Handling Middleware
const error_middleware_1 = require("./middleware/error.middleware");
app.use(error_middleware_1.errorMiddleware);
// Start server
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
