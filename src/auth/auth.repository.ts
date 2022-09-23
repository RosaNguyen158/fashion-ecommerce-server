import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Session } from './entities/session.entity';
import { UserRepository } from 'src/users/users.repository';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async setRefreshToken(
    refreshToken: string,
    accessToken: string,
    user: User,
  ): Promise<Session> {
    const session = this.sessionRepository.create({
      accessToken: accessToken,
      refreshToken: refreshToken,
      userId: user.id,
      user: user,
    });
    try {
      await this.sessionRepository.save(session);
      return session;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async resetRefreshToken(
    refreshToken: string,
    accessToken: string,
    id: string,
  ): Promise<void> {
    try {
      await this.sessionRepository.update(id, {
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getRefreshToken(id: string): Promise<string> {
    const session = await this.sessionRepository.findOneBy({ id: id });

    const token = session.refreshToken;

    return token;
  }

  async removeToken(id: string) {
    try {
      await this.sessionRepository.update(id, {
        accessToken: null,
        refreshToken: null,
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  verifyRefreshToken(refreshToken: string) {
    const decodedId = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    return decodedId;
  }

  verifyAccessToken(accessToken: string) {
    const decodedId = this.jwtService.verify(accessToken, {
      secret: process.env.JWT_ACCESS_SECRET,
    });

    return decodedId;
  }

  async generateTokens(user: User) {
    const id = user.id;
    const payload = { id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '30m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }

  async createSession(user: User): Promise<Session> {
    const { refreshToken, accessToken } = await this.generateTokens(user);
    const session = this.setRefreshToken(accessToken, refreshToken, user);
    return session;
  }

  async updateSession(id: string, user: User): Promise<string> {
    const { refreshToken, accessToken } = await this.generateTokens(user);
    await this.resetRefreshToken(accessToken, refreshToken, id);
    return accessToken;
  }

  async isRefreshTokenValid(refreshToken: string) {
    try {
      const { id } = await this.verifyRefreshToken(refreshToken);
      const storedToken = await this.getRefreshToken(id);

      if (refreshToken === storedToken) {
        return id;
      }
    } catch (e) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async findOneByToken(
    authHeaders: string,
  ): Promise<{ user: User; session: Session }> {
    const token = authHeaders.split(' ')[1];
    const session = await this.sessionRepository.findOneBy({
      accessToken: token,
    });
    if (!session) throw new Error('Not found user session');
    const user = await this.userRepository.findOne(session.userId);

    return { user, session };
  }

  async deleteSessionById(id: string): Promise<void> {
    const result = await this.sessionRepository.delete({ id: id });

    if (result.affected === 0) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
  }
}
