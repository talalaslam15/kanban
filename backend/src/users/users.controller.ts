import { CreateUserDto } from './dto/create-user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersResponseDto } from './dto/users-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserOwnerGuard } from 'src/guards/user-owner-guard';
import { IGetUserAuthInfoRequest } from 'src/auth/user.decorator';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(UserOwnerGuard)
  @Post()
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Get()
  @ApiOkResponse({
    description: 'List of Users',
    type: UsersResponseDto,
    isArray: true, // because this returns an array
  })
  findAll(@Req() req: IGetUserAuthInfoRequest) {
    // Admin users can see all users, regular users just see themselves
    const user = req.user;
    return this.usersService.findAll(user.userId);
  }

  @UseGuards(UserOwnerGuard)
  @Get(':id')
  @ApiOkResponse({
    description: 'User found',
    type: UsersResponseDto,
  })
  @ApiNotFoundResponse()
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @UseGuards(UserOwnerGuard)
  @Patch(':id')
  @ApiOkResponse({
    description: 'User updated',
    type: UsersResponseDto,
  })
  @ApiNotFoundResponse()
  @ApiBody({ type: UpdateUserDto, description: 'User data to update' })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) data: UpdateUserDto,
  ) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.usersService.update(id, data);
  }

  @UseGuards(UserOwnerGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse()
  async remove(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.usersService.remove(id);
  }
}
