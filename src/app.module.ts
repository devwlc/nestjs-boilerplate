import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from '@/src/database/prisma.service';
import { envValidationSchema } from '@/src/config/env.validation';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level:
            config.get<string>('NODE_ENV') === 'production' ? 'info' : 'debug',
          transport:
            config.get<string>('NODE_ENV') !== 'production'
              ? { target: 'pino-pretty' }
              : undefined,
        },
      }),
    }),
    AuthModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
    },
  ],
})
export class AppModule {}
