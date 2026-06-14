import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from '@/src/database/prisma.service';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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