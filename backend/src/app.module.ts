import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TaskModule } from './tasks/task.module';
import { UsersModule } from './users/users.module';
import { ColumnModule } from './column/column.module';
import { BoardModule } from './board/board.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    TaskModule,
    UsersModule,
    ColumnModule,
    BoardModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
