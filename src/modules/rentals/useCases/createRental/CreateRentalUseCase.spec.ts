import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCae: CreateRentalUseCase;
let rentalRepositoryInMemory: RentalRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let carsRepository: CarsRepositoryInMemory;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();
  beforeEach(() => {
    rentalRepositoryInMemory = new RentalRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepository = new CarsRepositoryInMemory();
    createRentalUseCae = new CreateRentalUseCase(
      rentalRepositoryInMemory,
      dayjsDateProvider,
      carsRepository
    );
  });
  it("should be able to create a new rental ", async () => {
    const car = await carsRepository.create({
      name: "Name car",
      description: "Description car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    const rental = await createRentalUseCae.execute({
      user_id: "1212",
      car_id: car.id,
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
