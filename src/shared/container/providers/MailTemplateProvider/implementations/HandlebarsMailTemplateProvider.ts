import fs from "fs";
import handlebars from "handlebars";

import IParseMailTemplateDTO, {
  IMailTemplateProvider,
} from "../models/IMailTemplateProvider";

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  async parse({ file, variables }: IParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: "utf-8",
    });
    const parsedTemplate = handlebars.compile(templateFileContent);
    return parsedTemplate(variables);
  }
}

export { HandlebarsMailTemplateProvider };
