import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CredentialsDto {
  @ApiProperty({ example: 'ultron@system.local' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin@123' })
  @IsNotEmpty()
  password: string;
}
