import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;
describe("Create Category Controller ", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();

    const password = await hash("admin", 8);
    await connection.query(`
    INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
    VALUES('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXXXX')
  `);
  });

  afterAll(async () => {
    try {
      await connection.dropDatabase();
      await connection.close();
    } catch (error) {
      console.log(error);
    }
  });

  it("should be able to create a new category", async () => {
    try {
      const responseToken = await request(app).post("/sessions").send({
        email: "admin@rentx.com.br",
        password: "admin",
      });

      const { refresh_token } = responseToken.body;
      const response = await request(app)
        .post("/categories")
        .send({
          name: "Category 2",
          description: "Category 2",
        })
        .set({
          Authorization: `Bearer ${refresh_token}`,
        });

      expect(response.status).toBe(201);
    } catch (error) {
      Error(error.message);
    }
  });

  it("should not be able to create a new category with  name exists", async () => {
    try {
      const responseToken = await request(app).post("/sessions").send({
        email: "admin@rentx.com.br",
        password: "admin",
      });

      const { refresh_token } = responseToken.body;
      const response = await request(app)
        .post("/categories")
        .send({
          name: "Category 2",
          description: "Category 2",
        })
        .set({
          Authorization: `Bearer ${refresh_token}`,
        });

      expect(response.status).toBe(400);
    } catch (error) {
      Error(error.message);
    }
  });
});
