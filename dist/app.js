"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const yamljs_1 = __importDefault(require("yamljs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const secret_1 = require("./secret");
const defaultError_1 = __importDefault(require("./utils/errors/defaultError"));
const index_1 = __importDefault(require("./routes/index"));
// Load Swagger documentation
const swaggerDoc = yamljs_1.default.load(path_1.default.join(__dirname, './docs/swagger.yaml'));
const app = (0, express_1.default)();
// Middleware setup
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDoc));
if (secret_1.nodeEnv !== 'production') {
    app.use((0, morgan_1.default)('dev'));
}
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173' // local environment
    ],
    credentials: true
}));
app.use(index_1.default);
app.get('/', (_req, res) => {
    res.status(200).json({ message: 'welcome, server is running' });
});
// Error handling middleware
app.use(defaultError_1.default);
exports.default = app;
