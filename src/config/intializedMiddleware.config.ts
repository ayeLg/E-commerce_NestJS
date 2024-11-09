import { INestApplication } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import * as compression from 'compression';
import * as morgan from 'morgan';
import helmet from 'helmet';

export function configureMiddleware(app: INestApplication) {
  const { NODE_ENV } = process.env;

  // Convert request body to JSON and limit 50 MB
  app.use(express.json({ limit: '50mb' }));

  // Encode URL
  app.use(express.urlencoded({ extended: false }));

  // Serve static files based on environment
  app.use(
    express.static(
      NODE_ENV === 'development'
        ? path.join(process.cwd(), 'src/public')
        : path.join(__dirname, 'public'),
    ),
  );

  // CORS for cross-site errors
  app.use(cors());

  // Helmet for security
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false,
      xFrameOptions: false,
    }),
  );

  // Compression to reduce response size
  app.use(
    compression({
      filter: function () {
        return true;
      },
    }),
  );

  // Morgan for request logging
  app.use(morgan('dev'));
}
