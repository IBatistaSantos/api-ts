interface IParamsSendMail {
  to: string;
  subject: string;
  body: string;
}
interface IMailProvider {
  sendMail({ to, subject, body }: IParamsSendMail): Promise<void>;
}

export { IMailProvider, IParamsSendMail };
