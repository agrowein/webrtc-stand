import { Module } from '@nestjs/common';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from 'path';
import {RouterModule} from "nest-router";
import { UserModule } from './domain/user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { CallGateway } from './domain/call/call.gateway';
import ormConfig from "./config/orm.config";
import {CallModule} from './domain/call/call.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public', 'build'),
      serveRoot: '/',
      exclude: ['api'],
    }),
    RouterModule.forRoutes([{ path: '/api', module: AppModule }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ormConfig,
    }),
    UserModule,
    AuthModule,
    CallModule
  ],
  providers: [],
})
export class AppModule {}
