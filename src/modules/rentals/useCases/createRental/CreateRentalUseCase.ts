import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { AppError } from "@shared/errors/AppError";

import { IRentalsRepository } from "../../repositories/IRentalsRepository";

interface IRequest {
  user_id: string;
  car_id: string;
  expect_return_date: Date;
}

class CreateRentalUseCase {
  constructor(private rentalRepository: IRentalsRepository) {}
  async execute({
    user_id,
    car_id,
    expect_return_date,
  }: IRequest): Promise<Rental> {
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

    const rental = await this.rentalRepository.create({
      user_id,
      car_id,
      expect_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };
