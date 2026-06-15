import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  create(data: CreateUserDto & { passwordHash: string }): Promise<UserEntity>;
  findById(id: number): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByIdWithPassword(
    id: number,
  ): Promise<{ id: number; passwordHash: string } | null>;
  update(
    id: number,
    data: UpdateUserDto & { passwordHash?: string },
  ): Promise<UserEntity>;
  softDelete(id: number): Promise<void>;
  updateLastLogin(id: number): Promise<void>;
}
