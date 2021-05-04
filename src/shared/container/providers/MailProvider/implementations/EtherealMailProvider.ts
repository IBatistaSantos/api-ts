import nodemail, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";

import { IMailProvider, IParamsSendMail } from "../IMailProvider";

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;
  constructor() {
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
  async sendMail({ to, subject, body }: IParamsSendMail): Promise<void> {
    const message = await this.client.sendMail({
      to,
      from: "Rentx <noreplay@rentx.com.br>",
      subject,
      html: body,
    });

    console.log("Message sent: %s", message.messageId);
    console.log("Previous URL: %s", nodemail.getTestMessageUrl(message));
  }
}

export { EtherealMailProvider };
