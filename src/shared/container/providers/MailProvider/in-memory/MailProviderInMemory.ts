import { IMailProvider, IParamsSendMail } from "../models/IMailProvider";

class MailProviderInMemory implements IMailProvider {
  private messages: any[] = [];
  async sendMail({
    to,
    subject,
    variables,
    path,
  }: IParamsSendMail): Promise<void> {
    this.messages.push({
      to,
      subject,
      variables,
      path,
    });
  }
}

export { MailProviderInMemory };
