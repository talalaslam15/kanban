import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TaskModule } from './tasks/task.module';
import { UsersModule } from './users/users.module';
import { ColumnModule } from './column/column.module';

@Module({
  imports: [PrismaModule, TaskModule, UsersModule, ColumnModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
