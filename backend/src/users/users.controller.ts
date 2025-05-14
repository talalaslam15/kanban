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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOkResponse, ApiNotFoundResponse, ApiBody } from '@nestjs/swagger';
import { UsersResponseDto } from './dto/users-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'User found',
    type: UsersResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'User updated',
    type: UsersResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
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

  @Delete(':id')
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async remove(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.usersService.remove(id);
  }
}
