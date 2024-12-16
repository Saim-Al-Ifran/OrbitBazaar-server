import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import YAML from 'yamljs';
import swaggerUI from 'swagger-ui-express';

import { nodeEnv } from './secret';
import errorHandler from './utils/errors/defaultError';
import router from './routes/index';

// Load Swagger documentation
const swaggerDoc = YAML.load(path.join(__dirname, './docs/swagger.yaml'));

const app = express();

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

if (nodeEnv !== 'production') {
    app.use(morgan('dev')); // Use morgan in non-production environments
}

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(router);

// Error handling middleware
app.use(errorHandler);

export default app;
