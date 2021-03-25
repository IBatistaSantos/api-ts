import { CategoriesRepository } from "../../repositories/implementations/CategoriesRepository";
import { CreateCategoryController } from "./CreateCategoryController";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

export default (): CreateCategoryController => {
  const categoriesRepository = new CategoriesRepository();

  const createCategoriesUseCase = new CreateCategoryUseCase(
    categoriesRepository
  );

  const createCategoriesController = new CreateCategoryController(
    createCategoriesUseCase
  );

  return createCategoriesController;
};
