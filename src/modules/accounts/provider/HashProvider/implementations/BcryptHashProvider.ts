import { hash, compare } from "bcrypt";

import { IHashProvider } from "../IHashProvider";

class BcryptHashProvider implements IHashProvider {
  public async generateHash(password: string): Promise<string> {
    const hashPassword = await hash(password, 8);
    return hashPassword;
  }

  public async compareHash(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}

export { BcryptHashProvider };
