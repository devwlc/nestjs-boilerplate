import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CredentialsDto } from './dto/credentials.dto';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(credentialsDto: CredentialsDto) {
    const user = await this.usersService.findByEmail(credentialsDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== 'ACTIVE')
      throw new UnauthorizedException('User is not active');

    const passwordHash = await this.usersService.getPasswordHash(user.id);
    const isValid = await bcrypt.compare(credentialsDto.password, passwordHash);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    await this.usersService.updateLastLogin(user.id);

    return {
      accessToken: this.getToken(user.id, user.email, user.role),
      refreshToken: this.getRefreshToken(user.id, user.email, user.role),
      tokenType: 'bearer',
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
    };
  }

  getToken(id: number, email: string, role: string) {
    const jwtPayload = {
      id: id,
      email: email,
      role: role,
    };
    return this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
    });
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    if (!refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const payload = this.jwtService.verify<{ sub: number }>(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    const user = await this.usersService.findById(payload.sub);

    if (!user || user.deletedAt)
      throw new UnauthorizedException('User not found');

    try {
      this.jwtService.verify(refreshToken);

      const newToken = this.jwtService.sign({ sub: user.id });

      const newRefreshToken = this.jwtService.sign(
        { sub: user.id },
        {
          expiresIn: process.env.JWT_REFRESH_TOKEN_TIMEOUT,
        },
      );

      return {
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
      };
    } catch (exception: unknown) {
      if (
        exception instanceof Error &&
        exception.name === 'JsonWebTokenError'
      ) {
        throw new UnauthorizedException('Token has error');
      }
      if (
        exception instanceof Error &&
        exception.name === 'TokenExpiredError'
      ) {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException(
        exception instanceof Error ? exception.name : 'Unknown error',
      );
    }
  }

  getRefreshToken(id: number, email: string, role: string) {
    const jwtPayload = {
      id: id,
      email: email,
      role: role,
    };

    return this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
    });
  }
}
