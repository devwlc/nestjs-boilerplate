import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { IUserRepository } from './repositories/user-repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.userRepository.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    const passwordHash = await bcrypt.hash(createUserDto.password, 12);
    return this.userRepository.create({
      ...createUserDto,
      passwordHash,
    });
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user || user.deletedAt) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async getPasswordHash(id: number): Promise<string> {
    const user = await this.userRepository.findByIdWithPassword(id);
    if (!user) throw new NotFoundException('User not found');
    return user.passwordHash;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    await this.findById(id);
    const data: UpdateUserDto & { passwordHash?: string } = {
      ...updateUserDto,
    };
    if (updateUserDto.password) {
      data.passwordHash = await bcrypt.hash(updateUserDto.password, 12);
      delete data.password;
    }
    return this.userRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.findById(id);
    await this.userRepository.softDelete(id);
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.userRepository.updateLastLogin(id);
  }
}
