import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Socket io",
      version: "1.0.0",
      description: "A simple API application with Swagger documentation",
    },
    servers: [
      {
        url: "http://localhost:3000/v1",
      },
    ],
    components: {
      securitySchemes: {
        adminBearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Specify the user token",
        },
      },
    },
    security: [
      {
        adminBearerAuth: [],
      },
    ],
  },
  apis: ["./src/router/**/*.ts", "./src/models/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);
const filePath = path.join(process.cwd(), "public/swagger/main.js");

fs.writeFile(
  filePath,
  `(async () => {
      const docs = document.getElementById('docs');
      const apiDescriptionDocument = ${JSON.stringify(swaggerSpec)};
      docs.apiDescriptionDocument = apiDescriptionDocument;
    })();
`,
  (err) => {
    if (err) {
      console.log("Error writing to file:", err);
      return;
    }
    console.log("File has been written successfully.");
  }
);
export { swaggerUi, swaggerSpec };
