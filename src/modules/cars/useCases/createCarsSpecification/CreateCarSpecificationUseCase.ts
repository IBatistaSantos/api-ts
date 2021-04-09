import { inject, injectable } from "tsyringe";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarRepository } from "@modules/cars/repositories/ICarRepository";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  car_id: string;
  specification_id: string[];
}

@injectable()
class CreateCarSpecificationUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarRepository,

    @inject("SpecificationRepository")
    private specificationRepository: ISpecificationsRepository
  ) {}
  async execute({ car_id, specification_id }: IRequest): Promise<Car> {
    const carAlreadyExists = await this.carsRepository.findById(car_id);

    if (!carAlreadyExists) {
      throw new AppError("Car not found");
    }

    const specifications = await this.specificationRepository.findByIds(
      specification_id
    );

    carAlreadyExists.specifications = specifications;

    await this.carsRepository.create(carAlreadyExists);

    return carAlreadyExists;
  }
}

export { CreateCarSpecificationUseCase };
