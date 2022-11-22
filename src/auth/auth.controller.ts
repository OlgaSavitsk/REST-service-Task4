import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-dto';
import { Token } from './models/token.model';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Create token' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SignInDto,
  })
  @Post('signin')
  public signin(@Body() user: CreateUserDto): Promise<Token> {
    return this.authService.login(user);
  }

  @Public()
  @ApiOperation({ summary: 'Sign up to create' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserDto,
  })
  @Post('signup')
  public signup(@Body() user: CreateUserDto): Promise<Token> {
    return this.authService.register(user);
  }
}
