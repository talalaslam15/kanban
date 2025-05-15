import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { plainToInstance } from 'class-transformer';
import { ColumnResponseDto } from './dto/column-response.dto';
import { mapCreateColumnDtoToPrisma } from './column.mapper';
import { ApiOkResponse, ApiNotFoundResponse, ApiBody } from '@nestjs/swagger';

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
  async findAll() {
    const columns = await this.columnService.findAll();
    return plainToInstance(ColumnResponseDto, columns, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Column found',
    type: ColumnResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Column not found',
  })
  async findOne(@Param('id') id: string) {
    const column = await this.columnService.findOne(id);
    if (!column) throw new NotFoundException(`Column ${id} not found`);
    return column;
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Column updated',
    type: ColumnResponseDto,
  })
  @ApiBody({ type: CreateColumnDto })
  async update(@Param('id') id: string, @Body() data: UpdateColumnDto) {
    const column = await this.columnService.findOne(id);
    if (!column) throw new NotFoundException(`Column ${id} not found`);
    return this.columnService.update(id, data);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Column deleted successfully' })
  @ApiNotFoundResponse({ description: 'Column not found' })
  async remove(@Param('id') id: string) {
    const column = await this.columnService.findOne(id);
    if (!column) throw new NotFoundException(`Column ${id} not found`);
    return this.columnService.remove(id);
  }
}
