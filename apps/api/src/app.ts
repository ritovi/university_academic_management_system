import "reflect-metadata";
import { envsObject } from "./config/env.js";
import { PostgresDatabase } from "./infrastructure/postgres/config/database.config.js";
import { DependencyContainer } from "./infrastructure/DependencyContainer.js";
import { AppRoutes } from "./presentation/routes.js";
import { Server } from "./presentation/server.js";

async function main() {
    // Initialize database
    const postgres = new PostgresDatabase({
        host: envsObject.db_host,
        port: envsObject.db_port,
        username: envsObject.db_username,
        password: envsObject.db_password,
        database: envsObject.db_name
    });
    await postgres.connect();

    // Initialize dependency container
    DependencyContainer.initialize(postgres.dataSource);

    // Start server
    const server = new Server({
        port: envsObject.app_port,
        routes: AppRoutes.getRoutes()
    });
    await server.start();
}

main().catch((error) => {
    console.error("Failed to start application:", error);
    process.exit(1);
});