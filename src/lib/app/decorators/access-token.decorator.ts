import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';

export const AccessToken = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return ExtractJwt.fromAuthHeaderAsBearerToken()(request) ?? '';
  },
);
