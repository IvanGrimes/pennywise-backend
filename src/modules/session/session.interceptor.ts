import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Request } from 'express';
import * as DeviceDetector from 'device-detector-js';

export type SessionInformation = {
  ip: string;
  device: DeviceDetector.DeviceDetectorResult;
  location?: string;
};

const deviceDetector = new DeviceDetector();

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor(private readonly clsService: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request: Request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const location = request.headers.location;
    const ua = request.get('user-agent');

    this.clsService.set('sessionInformation', {
      ip,
      device: ua ? deviceDetector.parse(ua) : undefined,
      location,
    });

    return next.handle();
  }
}
