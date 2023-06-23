import {
  INestApplication,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

export const setup = (app: INestApplication) => {
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('My Wallet API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  app.use(
    cookieSession({
      keys: [configService.get('SESSION_KEY')],
    }),
  );

  const frontEndUrl: string = configService.get('FRONTEND_URL');

  app.enableCors({
    origin: [...frontEndUrl.split(' ')],
    credentials: true,
  });

  return (configService.get('PORT') || 3000) as number;
};
