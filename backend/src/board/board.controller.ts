import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBody,
} from '@nestjs/swagger';
import { BoardResponseDto } from './dto/board-response.dto';
import { Prisma } from '@prisma/client';

@ApiTags('boards')
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @ApiBody({ type: CreateBoardDto })
  async create(@Body() dto: CreateBoardDto) {
    try {
      return await this.boardService.create({
        title: dto.title,
        description: dto.description,
        owner: { connect: { id: dto.ownerId } },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new BadRequestException(
          `User with id ${dto.ownerId} does not exist`,
        );
      }

      throw error; // rethrow if it's not a known Prisma error
    }
  }

  @Get()
  @ApiOkResponse({ type: BoardResponseDto, isArray: true })
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: BoardResponseDto })
  @ApiNotFoundResponse({ description: 'Board not found' })
  async findOne(@Param('id') id: string) {
    const board = await this.boardService.findOne(id);
    if (!board) {
      throw new NotFoundException(`Board with id ${id} not found`);
    }
    return board;
  }

  @Patch(':id')
  @ApiOkResponse({ type: BoardResponseDto })
  @ApiBody({ type: UpdateBoardDto })
  async update(@Param('id') id: string, @Body() dto: UpdateBoardDto) {
    const board = await this.boardService.findOne(id);
    if (!board) {
      throw new NotFoundException(`Board with id ${id} not found`);
    }
    return this.boardService.update(id, {
      title: dto.title,
      description: dto.description,
    });
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Board deleted successfully' })
  async remove(@Param('id') id: string) {
    const board = await this.boardService.findOne(id);
    if (!board) {
      throw new NotFoundException(`Board with id ${id} not found`);
    }
    return this.boardService.remove(id);
  }
}
