import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { FakeHashProvider } from "@modules/accounts/provider/HashProvider/fakes/FakeHashProvider";
import { UserRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { UserTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserTokenRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepositoryInMemory: UserRepositoryInMemory;
let createUser: CreateUserUseCase;
let hashPorvider: FakeHashProvider;
let userTokenRepositoryInMemory: UserTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
describe("AuthenticateUse", () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    userTokenRepositoryInMemory = new UserTokensRepositoryInMemory();
    hashPorvider = new FakeHashProvider();
    dateProvider = new DayjsDateProvider();
    createUser = new CreateUserUseCase(userRepositoryInMemory, hashPorvider);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoryInMemory,
      hashPorvider,
      userTokenRepositoryInMemory,
      dateProvider
    );
  });
  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "0000123",
      email: "test@example.com",
      password: "test",
      name: "User test",
    };

    await createUser.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate an non exist user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "false@gmail.com",
        password: "1234",
      })
    ).rejects.toEqual(new AppError("Email or password incorrect"));
  });

  it("should not be able to authenticate with invalid  password", async () => {
    const user: ICreateUserDTO = {
      driver_license: "99999",
      email: "test3@example.com",
      password: "test",
      name: "User incorrect password",
    };

    await createUser.execute(user);
    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "1234",
      })
    ).rejects.toEqual(new AppError("Email or password incorrect"));
  });

  it("should not be able to authenticate with invalid  email", async () => {
    const user: ICreateUserDTO = {
      driver_license: "99999",
      email: "test3@example.com",
      password: "test",
      name: "User incorrect password",
    };

    await createUser.execute(user);
    await expect(
      authenticateUserUseCase.execute({
        email: "emailIncorrect@gmail.com",
        password: user.password,
      })
    ).rejects.toEqual(new AppError("Email or password incorrect"));
  });
});
