import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureMiddleware } from './config/intializedMiddleware.config';
import { SwaggerConfig } from './swagger/swagger.config';
import { AuthGuard } from './guard/auth.guard';
import { ChecktokenMiddleware } from './middleware /checkToken.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
