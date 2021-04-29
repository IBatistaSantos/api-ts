import { ICreateUsersTokensDTO } from "../dtos/ICreateUsersTokensDTO";
import { UserToken } from "../infra/typeorm/entities/UserTokens";

interface IUsersTokens {
  create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUsersTokensDTO): Promise<UserToken>;
}

export { IUsersTokens };
