import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureMiddleware } from './config/intializedMiddleware.config';
import { SwaggerConfig } from './swagger/swagger.config';
import { AuthGuard } from './guard/auth.guard';
import { ChecktokenMiddleware } from './middleware /checkToken.middleware';
import { AllExceptionsFilter } from './filter/allExceptions.filter';
import { ErrorHandlingInterceptor } from './interceptor/errorHandling.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ErrorHandlingInterceptor());
  configureMiddleware(app);

  app.useGlobalGuards(new AuthGuard(app.get(ChecktokenMiddleware)));

  // Resolve SwaggerConfig instance
  const swaggerConfig = app.get(SwaggerConfig);
  swaggerConfig.setupSwagger(app);
  const port = process.env.PORT || 5003;
  await app.listen(port, () => {
    console.log(`Application is running at port ${port}.`);
  });
}
bootstrap();
