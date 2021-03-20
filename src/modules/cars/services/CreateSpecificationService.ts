import { ISpecificationsRepository } from "../repositories/ISpecificationRepository";

interface IRequest {
  name: string;
  description: string;
}

class CreateSpecificationService {
  constructor(private specificationRepository: ISpecificationsRepository) {}
  execute({ name, description }: IRequest): void {
    const specificationAlreadyExists = this.specificationRepository.findByName(
      name
    );

    if (specificationAlreadyExists) {
      throw new Error(`Specification with name ${name} already exists`);
    }

    this.specificationRepository.create({ name, description });
  }
}

export { CreateSpecificationService };
