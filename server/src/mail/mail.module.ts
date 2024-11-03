import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        return {
          transport: {
            host: 'smtp.mailtrap.io',
            port: 2525,
            secure: false,
            auth: {
              user: '33ec92d452689c',
              pass: '7e75a82da2a21d',
            },
          },
          defaults: {
            from: `"No Reply" <noreply@joiepalace.live'`,
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
    }),
  ],
  controllers: [MailController],
  providers: [MailService, PrismaService],
})
export class MailModule {}
