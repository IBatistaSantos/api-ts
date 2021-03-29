import { Router } from "express";
import multer from "multer";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import { CreateCategoryController } from "../modules/cars/useCases/createCategory/CreateCategoryController";
import { ImportCategoryController } from "../modules/cars/useCases/importCategory/ImportCategoryController";
import { ListCategoriesController } from "../modules/cars/useCases/listCategories/ListCategoriesControler";

const categoriesRoutes = Router();
const upload = multer({
  dest: "/tmp",
});
const createCategoriesController = new CreateCategoryController();
const listCategoriesController = new ListCategoriesController();
const importCategoryController = new ImportCategoryController();

categoriesRoutes.post("/", createCategoriesController.handle);
categoriesRoutes.get("/", listCategoriesController.handle);

categoriesRoutes.post(
  "/import",
  ensureAuthenticated,
  upload.single("file"),
  importCategoryController.handle
);

export { categoriesRoutes };
