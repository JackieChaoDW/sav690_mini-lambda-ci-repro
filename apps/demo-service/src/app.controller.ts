import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return '[2nd] demo-service is a normal app, not a lambda — editing this file should NOT trigger lambda-pr-check. (scenario ① bootstrap PR)';
  }
}
