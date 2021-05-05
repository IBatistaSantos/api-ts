import nodemail, { Transporter } from "nodemailer";
import { inject, injectable } from "tsyringe";

import { IMailTemplateProvider } from "../../MailTemplateProvider/models/IMailTemplateProvider";
import { IMailProvider, IParamsSendMail } from "../models/IMailProvider";

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;
  constructor(
    @inject("MailTemplateProvider")
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    nodemail
      .createTestAccount()
      .then((account) => {
        const transporter = nodemail.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transporter;
      })
      .catch((error) => console.error(error));
  }
  async sendMail({
    to,
    subject,
    variables,
    path,
  }: IParamsSendMail): Promise<void> {
    const message = await this.client.sendMail({
      to,
      from: "Rentx <noreplay@rentx.com.br>",
      subject,
      html: await this.mailTemplateProvider.parse({ file: path, variables }),
    });

    console.log("Message sent: %s", message.messageId);
    console.log("Previous URL: %s", nodemail.getTestMessageUrl(message));
  }
}

export { EtherealMailProvider };
