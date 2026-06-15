import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/database/prisma.service';
import { IUserRepository } from './user-repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateUserDto & { passwordHash: string },
  ): Promise<UserEntity> {
    const user = await this.prisma.user.create({ data });
    return user;
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByIdWithPassword(
    id: number,
  ): Promise<{ id: number; passwordHash: string } | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, passwordHash: true },
    });
  }

  async update(
    id: number,
    data: UpdateUserDto & { passwordHash?: string },
  ): Promise<UserEntity> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async softDelete(id: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
