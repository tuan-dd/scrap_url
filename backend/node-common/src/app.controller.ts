import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { IsDefined, IsString } from 'class-validator';
import { AppService } from './app.service';
import { ERR } from './enums';
import { BusinessException } from './exceptions';

export class TestPayload {
  @IsString()
  @IsDefined()
  name: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
  }
  @Get('hi')
  hi() {
    throw new BusinessException({
      errorCode: ERR.BAD_USER_INPUT,
      status: HttpStatus.FORBIDDEN,
      data: '',
      err: '',
    });
  }
  @Post()
  test(@Body() payload: TestPayload) {
    return payload;
  }
}
