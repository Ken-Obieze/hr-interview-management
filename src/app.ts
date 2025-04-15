import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { config } from './config/env';
import interviewRoutes from './routes/interviewRoutes';
import attendeeRoutes from './routes/attendeeRoutes';
import reportRoutes from './routes/reportRoutes';
import contractRoutes from './routes/contractRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { AppError } from './middlewares/errorHandler';

const app: Application = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Interview Management API',
            version: '1.0.0',
            description: 'API for managing interviews and hiring processes',
        },
        servers: [
            {
                url: `http://localhost:${config.PORT}`,
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/v1/interviews', interviewRoutes);
app.use('/api/v1/interviews/attendees', attendeeRoutes);
app.use('/api/v1/interviews/reports', reportRoutes);
app.use('/api/v1/interviews/contracts', contractRoutes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Interview Management Service is up and running',
    });
});

// Global error handler
// app.use(errorHandler);
app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});


export default app;
