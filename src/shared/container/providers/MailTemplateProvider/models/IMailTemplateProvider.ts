interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}

interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}

export { IMailTemplateProvider };
