import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // NotFoundException,
  // BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BoardResponseDto } from './dto/board-response.dto';
// import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IGetUserAuthInfoRequest } from 'src/auth/user.decorator';
import { OwnerGuard, ResourceType } from 'src/guards/owner-guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('boards')
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @ApiBody({ type: CreateBoardDto })
  async create(@Body() dto: CreateBoardDto) {
    return await this.boardService.create({
      title: dto.title,
      description: dto.description,
      owner: { connect: { id: dto.ownerId } },
    });
  }

  @Get()
  @ApiOkResponse({ type: BoardResponseDto, isArray: true })
  findAll(@Req() req: IGetUserAuthInfoRequest) {
    const user = req.user as { userId: string }; // Adjust based on your JWT payload
    return this.boardService.findAll(user.userId);
  }

  @UseGuards(OwnerGuard)
  @ResourceType('board')
  @Get(':id')
  @ApiOkResponse({ type: BoardResponseDto })
  @ApiNotFoundResponse({ description: 'Board not found' })
  async findOne(@Param('id') id: string) {
    return await this.boardService.findOne(id);
  }

  @UseGuards(OwnerGuard)
  @ResourceType('board')
  @Patch(':id')
  @ApiOkResponse({ type: BoardResponseDto })
  @ApiBody({ type: UpdateBoardDto })
  async update(@Param('id') id: string, @Body() dto: UpdateBoardDto) {
    return this.boardService.update(id, {
      title: dto.title,
      description: dto.description,
    });
  }

  @UseGuards(OwnerGuard)
  @ResourceType('board')
  @Delete(':id')
  @ApiOkResponse({ description: 'Board deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.boardService.remove(id);
  }
}
