import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
// TODO: add version
// import { version } from "../package.json";
// import log from "./logger.ts";
import 'reflect-metadata';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Docs",
      version: '1.0.0',
      description: "Documentation for REST API",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        // basicAuth: {
        //   type: "http",
        //   scheme: "basic",
        // }
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./controllers/*.ts", "./models/*.ts", "index.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app: Express, port: number) => {
  // log.info(`Version: ${version}`);
  // log.info(`Documentation available at http://localhost:${port}/docs`);
  // console.info(`Version: ${version}`);


  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.info(`Documentation available at http://localhost:${port}/docs`);
};
