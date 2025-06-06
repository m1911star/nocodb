import nodemailer from 'nodemailer';
import type { IEmailAdapter } from '~/types/nc-plugin';
import type Mail from 'nodemailer/lib/mailer';
import type { XcEmail } from '~/interface/IEmailAdapter';

export default class SMTP implements IEmailAdapter {
  private transporter: Mail;
  private input: any;

  constructor(input: any) {
    this.input = input;
  }

  public async init(): Promise<any> {
    const config = {
      name: this.input?.name,
      host: this.input?.host,
      port: parseInt(this.input?.port, 10),
      secure:
        typeof this.input?.secure === 'boolean'
          ? this.input?.secure
          : this.input?.secure === 'true',
      ignoreTLS:
        typeof this.input?.ignoreTLS === 'boolean'
          ? this.input?.ignoreTLS
          : this.input?.ignoreTLS === 'true',
      tls: {
        rejectUnauthorized: typeof this.input?.rejectUnauthorized === 'boolean'
          ? this.input?.rejectUnauthorized
          : this.input?.rejectUnauthorized === 'true'
      },
      ...(this.input?.username || this.input?.password
        ? {
            auth: {
              ...(this.input?.username ? { user: this.input?.username } : {}),
              ...(this.input?.password ? { pass: this.input?.password } : {}),
            },
          }
        : {}),
    };

    this.transporter = nodemailer.createTransport(config);
  }

  public async mailSend(mail: XcEmail): Promise<any> {
    if (this.transporter) {
      await this.transporter.sendMail({ ...mail, from: this.input.from });
    }
  }

  public async test(): Promise<boolean> {
    try {
      await this.mailSend({
        to: this.input.from,
        subject: 'Test email',
        html: 'Test email',
      } as any);
      return true;
    } catch (e) {
      console.log('SMTP test error :: ', e);
      throw new Error(
        'SMTP test failed, please check server log for more details.',
      );
    }
  }
}
