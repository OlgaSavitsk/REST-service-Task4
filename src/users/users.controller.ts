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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user-dto';
import { UpdateStatusDto } from './dto/update-user-dto';
import { UserResponse } from './models/users.interface';
import { UsersService } from './users.service';
import { UserSchema } from 'src/schemes/user.scheme';
import { AuthGuard } from 'src/core/guards/auth.guard';

@ApiTags('User')
@ApiBearerAuth('token')
@Controller('user')
@UseGuards(AuthGuard)
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
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public create(@Body() userDto: CreateUserDto): Promise<UserResponse> {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateStatusDto,
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() { status }: UpdateStatusDto
  ) {
    return await this.userService.update(id, status);
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
