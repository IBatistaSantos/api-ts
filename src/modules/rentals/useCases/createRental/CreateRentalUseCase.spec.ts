import dayjs from "dayjs";

import { RentalRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCae: CreateRentalUseCase;
let rentalRepositoryInMemory: RentalRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();
  beforeEach(() => {
    rentalRepositoryInMemory = new RentalRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCae = new CreateRentalUseCase(
      rentalRepositoryInMemory,
      dayjsDateProvider
    );
  });
  it("should be able to create a new rental ", async () => {
    const rental = await createRentalUseCae.execute({
      user_id: "1212",
      car_id: "1212156",
      expect_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should  not be able to create a new rental if there is another open to the same user ", async () => {
    expect(async () => {
      await createRentalUseCae.execute({
        user_id: "1212",
        car_id: "1212156",
        expect_return_date: dayAdd24Hours,
      });

      await createRentalUseCae.execute({
        user_id: "1212",
        car_id: "1212156",
        expect_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should  not be able to create a new rental if there is another open to the same car ", async () => {
    expect(async () => {
      await createRentalUseCae.execute({
        user_id: "2121",
        car_id: "1212156",
        expect_return_date: dayAdd24Hours,
      });

      await createRentalUseCae.execute({
        user_id: "1212",
        car_id: "1212156",
        expect_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should  not be able to create a new rental with invalid return time ", async () => {
    expect(async () => {
      await createRentalUseCae.execute({
        user_id: "2121",
        car_id: "1212156",
        expect_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
