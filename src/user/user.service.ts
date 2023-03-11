import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { cryptHash } from 'src/util/bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, email, ...result } = createUserDto;

    const existUser = await this.prisma.user.findFirst({ where: { email } });

    if (existUser) {
      throw new ConflictException('E-mail ja está sendo usado.');
    }

    const hash = await cryptHash(password);

    try {
      await this.prisma.user.create({
        data: { hash, email, ...result },
      });
      return { msg: 'Usuário cadastro com sucesso' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Erro');
    }
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    return user;
  }

  async findOneById(id: string) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    const { hash, ...result } = user;
    return result;
  }

  async findOneAndUpdate(id: string, { refresh_token }: any) {
    await this.prisma.user.update({
      where: { id },
      data: { refresh_token },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
