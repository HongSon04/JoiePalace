import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('EMAIL_HOST') || 'smtp.mailtrap.io',
            port: configService.get<number>('EMAIL_PORT') || 2525,
            secure: false,
            auth: {
              user: configService.get<string>('EMAIL_USER') || '33ec92d452689c',
              pass:
                configService.get<string>('EMAIL_PASSWORD') || '7e75a82da2a21d',
            },
          },
          defaults: {
            from: `"No Reply" <noreply@joiepalace.live>`,
          },
          template: {
            dir: __dirname + '../../../templates',
            adapter: new EjsAdapter(),
            options: {
              strict: false,
            },
          },
        };
      },
      inject: [ConfigService], // Inject ConfigService vào useFactory
    }),
  ],
  controllers: [MailController],
  providers: [MailService, PrismaService],
})
export class MailModule {}
