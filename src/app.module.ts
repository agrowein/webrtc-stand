import { Module } from '@nestjs/common';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from 'path';
import {RouterModule} from "nest-router";
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public', 'build'),
      serveRoot: '/',
      exclude: ['api'],
    }),
    RouterModule.forRoutes([{ path: '/api', module: AppModule }]),
    UserModule,
  ],
})
export class AppModule {}
