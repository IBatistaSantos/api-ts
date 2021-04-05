import { AppError } from "../../../../errors/AppError";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { FakeHashProvider } from "../../provider/HashProvider/fakes/FakeHashProvider";
import { UserRepositoryInMemory } from "../../repositories/in-memory/UserRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepositoryInMemory: UserRepositoryInMemory;
let createUser: CreateUserUseCase;
let hashPorvider: FakeHashProvider;
describe("AuthenticateUse", () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    hashPorvider = new FakeHashProvider();
    createUser = new CreateUserUseCase(userRepositoryInMemory, hashPorvider);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoryInMemory,
      hashPorvider
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

  it("should not be able to authenticate an non exist user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@gmail.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with invalid  password", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        driver_license: "99999",
        email: "test3@example.com",
        password: "test",
        name: "User incorrect password",
      };

      await createUser.execute(user);
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "1234",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with invalid  email", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        driver_license: "99999",
        email: "test3@example.com",
        password: "test",
        name: "User incorrect password",
      };

      await createUser.execute(user);
      await authenticateUserUseCase.execute({
        email: "emailIncorrect@gmail.com",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
