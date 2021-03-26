import { getRepository, Repository } from "typeorm";

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../../entities/User";
import { IUserRepository } from "../IUserRepository";

class UserRepository implements IUserRepository {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  public async create({
    name,
    email,
    password,
    username,
    driver_license,
  }: ICreateUserDTO): Promise<void> {
    const user = this.userRepository.create({
      name,
      email,
      password,
      username,
      driver_license,
    });

    await this.userRepository.save(user);
  }
}

export { UserRepository };