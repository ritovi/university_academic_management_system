import "reflect-metadata";
import { PostgresDatabase } from "../infrastructure/postgres/config/database.config.js";
import { UserEntity, UserRole } from "../infrastructure/postgres/entities/UserEntity.js";
import { PasswordHasher } from "../infrastructure/other/PasswordHasher.js";
import { envsObject } from "../config/env.js";

async function seedAdmin() {
    console.log("🌱 Seeding admin user...");

    //=======================================
    const postgres = new PostgresDatabase({
        host: envsObject.db_host,
        port: envsObject.db_port,
        username: envsObject.db_username,
        password: envsObject.db_password,
        database: envsObject.db_name
    });

    await postgres.connect();

    const userRepository = postgres.dataSource.getRepository(UserEntity);
    const passwordHasher = new PasswordHasher();

    //=========================================================

    const existingAdmin = await userRepository.findOne({
        where: { email: "admin@unsa.edu.pe" }
    });

    if (existingAdmin) {
        console.log("⚠️  Admin user already exists!");
        process.exit(0);
    }

    //=================================================
    const hashedPassword = await passwordHasher.hash("admin123");

    const admin = userRepository.create({
        email: "admin@unsa.edu.pe",
        password: hashedPassword,
        role: UserRole.ADMIN,
        name: "System",
        surname: "Administrator",
        birthdate: new Date("1990-01-01"),
        status: true
    });

    await userRepository.save(admin);

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@university.edu");
    console.log("🔑 Password: admin123");
    console.log("⚠️  Please change the password after first login!");

    await postgres.dataSource.destroy();
    process.exit(0);
}

seedAdmin().catch((error) => {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
});