import { CategoriesRepository } from "../../repositories/implementations/CategoriesRepository";
import { CreateCategoryController } from "./CreateCategoryController";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

const categoriesRepository = CategoriesRepository.getInstance();

const createCategoriesUseCase = new CreateCategoryUseCase(categoriesRepository);

const createCategoriesController = new CreateCategoryController(
  createCategoriesUseCase
);

export { createCategoriesController };
