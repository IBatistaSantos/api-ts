import fs from "fs";
import handlebars from "handlebars";
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
  async sendMail({
    to,
    subject,
    variables,
    path,
  }: IParamsSendMail): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString("utf-8");
    const templateParse = handlebars.compile(templateFileContent);
    const templateHTML = templateParse(variables);

    const message = await this.client.sendMail({
      to,
      from: "Rentx <noreplay@rentx.com.br>",
      subject,
      html: templateHTML,
    });

    console.log("Message sent: %s", message.messageId);
    console.log("Previous URL: %s", nodemail.getTestMessageUrl(message));
  }
}

export { EtherealMailProvider };
