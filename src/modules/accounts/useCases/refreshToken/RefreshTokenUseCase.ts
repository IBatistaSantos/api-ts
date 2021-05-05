import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokens } from "@modules/accounts/repositories/IUsersTokens";
import { IDateProvider } from "@shared/container/providers/DateProvider/models/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UserTokensRepository")
    private usersTokensRepository: IUsersTokens,

    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}
  async execute(token: string): Promise<string> {
    const { sub, email } = verify(token, auth.secret_refresh_token) as IPayload;

    const user_id = sub;

    const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(
      user_id,
      token
    );

    if (!userToken) {
      throw new AppError("Refresh Token does not exists");
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: user_id,
      expiresIn: auth.expires_in_refresh_token,
    });

    const refresh_token_expires_date = this.dateProvider.addDay(
      auth.expires_in_refresh_token_day
    );
    await this.usersTokensRepository.create({
      user_id,
      refresh_token,
      expires_date: refresh_token_expires_date,
    });

    return refresh_token;
  }
}

export { RefreshTokenUseCase };
