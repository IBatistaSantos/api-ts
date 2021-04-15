import { RentalRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCae: CreateRentalUseCase;
let rentalRepositoryInMemory: RentalRepositoryInMemory;
describe("Create Rental", () => {
  beforeEach(() => {
    rentalRepositoryInMemory = new RentalRepositoryInMemory();
    createRentalUseCae = new CreateRentalUseCase(rentalRepositoryInMemory);
  });
  it("should be able to create a new rental ", async () => {
    const rental = await createRentalUseCae.execute({
      user_id: "1212",
      car_id: "1212156",
      expect_return_date: new Date(),
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should  not be able to create a new rental if there is another open to the same user ", async () => {
    expect(async () => {
      await createRentalUseCae.execute({
        user_id: "1212",
        car_id: "1212156",
        expect_return_date: new Date(),
      });

      await createRentalUseCae.execute({
        user_id: "1212",
        car_id: "1212156",
        expect_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should  not be able to create a new rental if there is another open to the same car ", async () => {
    expect(async () => {
      await createRentalUseCae.execute({
        user_id: "1212",
        car_id: "1212156",
        expect_return_date: new Date(),
      });

      await createRentalUseCae.execute({
        user_id: "1212",
        car_id: "1212156",
        expect_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
