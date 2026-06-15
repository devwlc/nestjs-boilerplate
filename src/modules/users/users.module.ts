import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from '@/src/database/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    PrismaService,
  ],
  exports: [UsersService, 'IUserRepository'],
})
export class UsersModule {}
