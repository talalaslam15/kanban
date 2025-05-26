import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashed,
        // boards: {
        //   create: {
        //     title: 'My First Board',
        //     description: 'This is your first board!',
        //   },
        // },
      },
    });

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };

    const token = this.jwt.sign(payload);
    return {
      access_token: token,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    // const token = this.jwt.sign({ sub: user.id });
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };
    const token = this.jwt.sign(payload);
    return {
      access_token: token,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async getMe(userId: string) {
    console.log('Fetching user with ID:', userId);
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }
}
