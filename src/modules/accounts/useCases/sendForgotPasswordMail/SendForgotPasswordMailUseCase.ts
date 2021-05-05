import { resolve } from "path";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { IUserRepository } from "@modules/accounts/repositories/IUserRepository";
import { IUsersTokens } from "@modules/accounts/repositories/IUsersTokens";
import { IDateProvider } from "@shared/container/providers/DateProvider/models/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/models/IMailProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class SendForgotPasswordMailUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,

    @inject("UserTokensRepository")
    private usersTokensRepository: IUsersTokens,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("MailProvider")
    private mailProvider: IMailProvider
  ) {}
  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "forgotPassword.hbs"
    );
    if (!user) {
      throw new AppError("User does not exists");
    }
    const token = uuidV4();
    const expires_date = this.dateProvider.adddHour(3);
    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token: token,
      expires_date,
    });
    const variables = {
      name: user.name,
      link: `${process.env.FORGOT_MAIL_URL}${token}`,
    };
    await this.mailProvider.sendMail({
      to: email,
      subject: "Recuperação da senha",
      variables,
      path: templatePath,
    });
  }
}

export { SendForgotPasswordMailUseCase };
