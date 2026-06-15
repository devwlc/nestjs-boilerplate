import { UserRole, Status } from '@prisma/client';

export class UserEntity {
  id: number;
  uuid: string;
  forceResetpwd: boolean;
  username: string;
  passwordHash: string;
  passwordRecoveryToken: string | null;
  email: string;
  emailVerified: boolean;
  fullName: string;
  role: UserRole;
  status: Status;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
