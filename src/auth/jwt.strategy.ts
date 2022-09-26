import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './user-payload.interface';
import { User } from '../users/entities/user.entity';
import { UserRepository } from 'src/users/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userReppository: UserRepository) {
    super({
      secretOrKey: 'topSecret51',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id, email } = payload;
    const user: User = await this.userReppository.findOne(id);
    // const user: User = await this.userReppository.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
