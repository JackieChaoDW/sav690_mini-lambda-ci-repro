import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return '[4th] final-design reverify: editing this file DOES trigger lambda-pr-check now (no paths: restriction), but coverage-guard should still pass since no lambda dir changed. (scenario ① reverify)';
  }
}
