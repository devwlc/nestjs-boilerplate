import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CredentialsDto {
  @ApiProperty({ example: 'user@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'peaceInApi@by@ultron ' })
  @IsNotEmpty()
  password!: string;
}