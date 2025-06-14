import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserOwnerGuard } from 'src/guards/user-owner-guard';
import { Reflector } from '@nestjs/core';

@Module({
  providers: [UsersService, PrismaService, UserOwnerGuard, Reflector],
  controllers: [UsersController],
  exports: [UsersService, UserOwnerGuard],
})
export class UsersModule {}
