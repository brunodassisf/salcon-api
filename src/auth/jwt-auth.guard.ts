import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Linter } from 'eslint';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
