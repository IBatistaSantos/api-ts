import { inject, injectable } from "tsyringe";

import { IHashProvider } from "@modules/accounts/provider/HashProvider/IHashProvider";
import { IUserRepository } from "@modules/accounts/repositories/IUserRepository";
import { IUsersTokens } from "@modules/accounts/repositories/IUsersTokens";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordUserUseCase {
  constructor(
    @inject("UserTokensRepository")
    private userTokenRepository: IUsersTokens,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("UserRepository")
    private userRepository: IUserRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}
  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByRefreshToken(token);

    if (!userToken) {
      throw new AppError("Token invalid");
    }

    if (
      this.dateProvider.compareIfBefore(
        userToken.expires_date,
        this.dateProvider.dateNow()
      )
    ) {
      throw new AppError("Token expired");
    }

    const user = await this.userRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError("User not found");
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.create(user);
    await this.userTokenRepository.deleteById(userToken.id);
  }
}

export { ResetPasswordUserUseCase };
