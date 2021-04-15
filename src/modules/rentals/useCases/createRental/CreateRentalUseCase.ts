import { inject, injectable } from "tsyringe";

import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

import { IRentalsRepository } from "../../repositories/IRentalsRepository";

interface IRequest {
  user_id: string;
  car_id: string;
  expect_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject("RentalRepository")
    private rentalRepository: IRentalsRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}
  async execute({
    user_id,
    car_id,
    expect_return_date,
  }: IRequest): Promise<Rental> {
    const minimumHourRental = 24;

    const carUnavailable = await this.rentalRepository.findOpenRentalByCar(
      car_id
    );

    if (carUnavailable) {
      throw new AppError("Car is unavailable");
    }

    const rentalOpenToUser = await this.rentalRepository.findOpenRentalByUser(
      user_id
    );

    if (rentalOpenToUser) {
      throw new AppError("There's a rental in progress in this user!");
    }

    const dateNow = this.dateProvider.dateNow();
    const compare = this.dateProvider.compareInHours(
      dateNow,
      expect_return_date
    );

    if (compare > minimumHourRental) {
      throw new AppError("Invalid return time!");
    }
    const rental = await this.rentalRepository.create({
      user_id,
      car_id,
      expect_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };
