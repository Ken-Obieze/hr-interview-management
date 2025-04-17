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
import dotenv from 'dotenv';
import { successResponse } from './utils/responseHandler'; // Adjust the path as needed

dotenv.config();

const PORT = process.env.PORT || 5000;
const app: Application = express();


app.use(cors());

// Define the list of allowed origins
const allowedOrigins = [
    'http://localhost:5173',
];

// Configure CORS
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if the origin is in the allowed list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Include cookies or authentication headers
}));

// Middleware
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

// Define a basic route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Interview Management Service is up and running',
    });
})

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

// Set the port, ensuring it’s a number or string
const port: string | number = process.env.APP_PORT || 3022;

// Start the server
app.listen(port, () => {
    console.log(`HCM Interview Management Service is up and running on PORT ${port}`);
})
