import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
// import { plainToInstance } from 'class-transformer';
import { ColumnResponseDto } from './dto/column-response.dto';
import { mapCreateColumnDtoToPrisma } from './column.mapper';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OwnerGuard, ResourceType } from 'src/guards/owner-guard';
import { IGetUserAuthInfoRequest } from 'src/auth/user.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('columns')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  @ApiBody({
    type: CreateColumnDto,
  })
  create(@Body() dto: CreateColumnDto) {
    return this.columnService.create(mapCreateColumnDtoToPrisma(dto));
  }

  @Get()
  @ApiOkResponse({
    description: 'List of Columns',
    type: ColumnResponseDto,
    isArray: true, // because this returns an array
  })
  async findAll(@Req() req: IGetUserAuthInfoRequest) {
    return await this.columnService.findAll(req.user.userId);
  }

  @UseGuards(OwnerGuard)
  @ResourceType('column')
  @Get(':id')
  @ApiOkResponse({
    description: 'Column found',
    type: ColumnResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Column not found',
  })
  async findOne(@Param('id') id: string) {
    return await this.columnService.findOne(id);
  }

  @UseGuards(OwnerGuard)
  @ResourceType('column')
  @Patch(':id')
  @ApiOkResponse({
    description: 'Column updated',
    type: ColumnResponseDto,
  })
  @ApiBody({ type: CreateColumnDto })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateColumnDto,
    @Req() req: IGetUserAuthInfoRequest,
  ) {
    return this.columnService.update(id, data, req.user.userId);
  }

  @UseGuards(OwnerGuard)
  @ResourceType('column')
  @Delete(':id')
  @ApiOkResponse({ description: 'Column deleted successfully' })
  @ApiNotFoundResponse({ description: 'Column not found' })
  async remove(@Param('id') id: string) {
    await this.columnService.remove(id);
    return { message: 'Column deleted successfully' };
  }
}
