import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          uri: `${configService.get('DB_URL')}`,
          dbName: `${configService.get('MDB_NAME')}`,
        }
      }
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'client/build'),
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    BlogModule,
    CommentModule,
  ],
})
export class AppModule { }
