process.loadEnvFile();
import env from "env-var";

export const envsObject = {
    app_port: env.get("APP_PORT").default(3000).asPortNumber(),
    db_host: env.get("DB_HOST").default("localhost").asString(),
    db_port: env.get("DB_PORT").default(5432).asPortNumber(),
    db_username: env.get("DB_USERNAME").required().asString(),
    db_password: env.get("DB_PASSWORD").required().asString(),
    db_name: env.get("DB_NAME").required().asString(),
    jwt_secret: env.get("JWT_SECRET").required().asString()
};