import { ICreateUsersTokensDTO } from "@modules/accounts/dtos/ICreateUsersTokensDTO";
import { UserToken } from "@modules/accounts/infra/typeorm/entities/UserTokens";

import { IUsersTokens } from "../IUsersTokens";

class UserTokensRepositoryInMemory implements IUsersTokens {
  usersTokens: UserToken[] = [];

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUsersTokensDTO): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(userToken, { user_id, expires_date, refresh_token });

    this.usersTokens.push(userToken);

    return userToken;
  }
  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserToken | undefined> {
    const userToken = this.usersTokens.find(
      (ut) => ut.user_id === user_id && ut.refresh_token === refresh_token
    );

    return userToken;
  }

  async findByRefreshToken(
    refresh_token: string
  ): Promise<UserToken | undefined> {
    const userToken = this.usersTokens.find(
      (ut) => ut.refresh_token === refresh_token
    );

    return userToken;
  }
  async deleteById(id: string): Promise<void> {
    const userToken = this.usersTokens.find((ut) => ut.id === id);
    if (!userToken) return;
    this.usersTokens.splice(this.usersTokens.indexOf(userToken));
  }
}

export { UserTokensRepositoryInMemory };
