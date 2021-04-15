import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";

import { Rental } from "../infra/typeorm/entities/Rental";

interface IRentalsRepository {
  create({
    user_id,
    car_id,
    expect_return_date,
  }: ICreateRentalDTO): Promise<Rental>;
  findOpenRentalByCar(car_id: string): Promise<Rental | undefined>;
  findOpenRentalByUser(user_id: string): Promise<Rental | undefined>;
}

export { IRentalsRepository };
