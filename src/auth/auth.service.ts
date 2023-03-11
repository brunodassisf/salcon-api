import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { compareHash } from 'src/util/bcrypt';

interface IPayload {
  email: string;
  sub: string;
  name: string;
}

interface IRefreshToken {
  refresh_token: string;
}

interface IRefresh {
  sub: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(private user: UserService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.user.findOneByEmail(email);

    if (user && compareHash(pass, user.hash)) {
      const { hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, name: user.name };
    return {
      refresh_token: await this.setRefreshToken(payload),
      access_token: this.jwtService.sign(payload),
    };
  }

  async setRefreshToken(payload: IPayload) {
    const { sub } = payload;
    const refresh_token = this.jwtService.sign(
      { sub },
      { expiresIn: process.env.REFRESHTOKEN_EXPIRE },
    );

    try {
      await this.user.findOneAndUpdate(payload.sub, {
        refresh_token,
      });

      return refresh_token;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao gerar as credenciais de token',
      );
    }
  }

  async validateToken({ refresh_token }: IRefreshToken) {
    try {
      const { sub }: IRefresh = await this.jwtService.verifyAsync(
        refresh_token,
      );
      const user = await this.user.findOneById(sub);
      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Favor realizar seu login novamente.');
    }
  }
}
