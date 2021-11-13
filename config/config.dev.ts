import { Dialect } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
    database: {
        dialect: <Dialect>'postgres',
        host: process.env.DATABASE_HOST_DEV,
        port: Number(process.env.DATABASE_PORT_DEV),
        username: process.env.DATABASE_USER_DEV,
        password: process.env.DATABASE_PASSWORD_DEV,
        database: process.env.DATABASE_DATABASE_DEV,
        logging: console.log,
    },
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
};