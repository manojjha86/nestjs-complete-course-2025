import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TweetModule } from './tweet/tweet.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaginationModule } from './common/pagination/pagination.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import envValidator from './config/env.validation';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizeGurad } from './auth/guards/authorize.guard';
import authConfig from './auth/config/auth.config';
import { JwtModule } from '@nestjs/jwt';


const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    UsersModule,
    TweetModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}`,
      load: [appConfig, databaseConfig],
      validationSchema: envValidator
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        synchronize: configService.get('database.syncronize'),
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name')
      })
    }), ProfileModule, HashtagModule, PaginationModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider())
  ],
  controllers: [AppController],
  providers: [AppService, {
          provide: APP_GUARD,
          useClass: AuthorizeGurad
      }],
})
export class AppModule { }
