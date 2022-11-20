import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user-dto';
import { UpdatePasswordDto } from './dto/update-user-dto';
import { TransformInterceptor } from './transform.interceptor';
import { UserResponse } from './models/users.interface';
import { UsersService } from './users.service';
import { UserSchema } from 'src/schemes/user.scheme';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [UserSchema],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  public findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserSchema,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserSchema,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public create(@Body() userDto: CreateUserDto): Promise<UserResponse> {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserSchema,
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new TransformInterceptor())
  public async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe()) userDto: UpdatePasswordDto
  ) {
    return await this.userService.update(id, userDto);
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<void> {
    return await this.userService.delete(id);
  }
}
