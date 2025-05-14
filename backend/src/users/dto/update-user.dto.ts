import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'John Smith',
    description: 'Updated name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'new.email@example.com',
    description: 'Updated email of the user',
    required: false,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'Updated password of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Password should be at least 8 characters long' })
  password?: string;
}
