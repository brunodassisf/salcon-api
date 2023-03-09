import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import cryptHash from 'src/util/bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    const existUser = await this.prisma.user.findFirst({ where: { email } });

    if (existUser) {
      throw new ConflictException('E-mail ja está sendo usado.');
    }

    const hash = await cryptHash(password);

    try {
      await this.prisma.user.create({
        data: { hash, ...createUserDto },
      });
      return { msg: 'Usuário cadastro com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException('Erro');
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
