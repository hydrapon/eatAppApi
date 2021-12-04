import { FormatSqlLogger } from "src/common/utils/format-sql-logger";
import { ConnectionOptions } from "typeorm";
import * as dotenv from 'dotenv'
dotenv.config()

const db_logging = process.env["DATABASE_LOGGING"] === "true";

const config: ConnectionOptions = {
  name: "default",
  type: "postgres",
  host: process.env["DATABASE_HOST"],
  port: Number(process.env["DATABASE_PORT"]),
  username: process.env["DATABASE_USER"],
  password: process.env["DATABASE_PASSWORD"],
  database: process.env["DATABASE_NAME"],
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/database/migrations/*{.ts,.js}"],
  migrationsTableName: "migrations",
  migrationsRun: false,
  synchronize: false,
  logging: db_logging,
  logger: db_logging ? new FormatSqlLogger() : undefined,
  cli: {
    migrationsDir: "src/database/migrations",
  },
};

export = config;
