interface ITemplateVariables {
  [key: string]: string | number;
}

interface IParamsSendMail {
  to: string;
  subject: string;
  variables: ITemplateVariables;
  path: string;
}
interface IMailProvider {
  sendMail({ to, subject, variables, path }: IParamsSendMail): Promise<void>;
}

export { IMailProvider, IParamsSendMail };
