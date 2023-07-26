import { AccountsModule } from '@modules/accounts';
import { AnalyticsModule } from '@modules/analytics';
import { CategoriesModule } from '@modules/categories';
import { ExchangeRatesModule } from '@modules/exchange-rates';
import { TransactionsModule } from '@modules/transactions';
import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { Environment } from '@src/const/Environment';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@modules/user';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import {
  ContextInterceptor,
  ExceptionInterceptor,
} from '@lib/app/interceptors';
import { RequestContextModule } from 'nestjs-request-context';
import { AuthModule } from '@modules/auth';
import { AccessTokenGuard } from '@lib/app/guards';
import { EmailVerificationModule } from '@modules/email-verification';
import { ClsModule } from 'nestjs-cls';
import { ResetPasswordModule } from '@modules/reset-password';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ExceptionInterceptor,
  },
];

@Module({
  imports: [
    ClsModule.forRoot({ global: true, middleware: { mount: true } }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        NODE_ENV: Joi.string()
          .required()
          .valid(Environment.development, Environment.production),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        VERIFICATION_TOKEN_SECRET: Joi.string().required(),
        RESET_PASSWORD_TOKEN_SECRET: Joi.string().required(),
        COOKIE_SECRET: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        EMAIL_HOST: Joi.string().required(),
        EMAIL_PORT: Joi.string().required(),
        EMAIL_CONFIRMATION_URL: Joi.string().required(),
        SET_PASSWORD_URL: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        RESET_PASSWORD_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    RequestContextModule,
    UserModule,
    AuthModule,
    EmailVerificationModule,
    ResetPasswordModule,
    AccountsModule,
    TransactionsModule,
    CategoriesModule,
    ExchangeRatesModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [
    ...interceptors,
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class AppModule {}
