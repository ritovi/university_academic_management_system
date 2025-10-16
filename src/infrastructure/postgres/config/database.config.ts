import { DataSource } from "typeorm";
import { UserEntity } from "../entities/UserEntity.js";
import { StudentEntity } from "../entities/student.model.js";
import { ProfessorEntity } from "../entities/professor.model.js";
import { SecretaryEntity } from "../entities/secretary.model.js";
import { AdminEntity } from "../entities/admin.model.js";

interface Options {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

export class PostgresDatabase {
    public dataSource: DataSource;

    constructor(options: Options) {
        this.dataSource = new DataSource({
            type: "postgres",
            host: options.host,
            port: options.port,
            username: options.username,
            password: options.password,
            database: options.database,
            entities: [
                UserEntity,
                StudentEntity,
                ProfessorEntity,
                SecretaryEntity,
                AdminEntity
            ],
            synchronize: true,
            logging: false,
            // ssl: {
            //     rejectUnauthorized: false
            // }
            ssl : false
        });
    }

    async connect() {
        try {
            await this.dataSource.initialize();
            console.log("Postgres Database connected successfully 🫩  🫩");
        } catch (error) {
            console.error("Database connection error:", error);
            throw error;
        }
    }
}