import { Dialect } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
    database: {
        dialect: <Dialect>'postgres',
        host: process.env.DATABASE_HOST_PROD,
        port: Number(process.env.DATABASE_PORT_PROD),
        username: process.env.DATABASE_USER_PROD,
        password: process.env.DATABASE_PASSWORD_PROD,
        database: process.env.DATABASE_DATABASE_PROD,
        logging: console.log,
    },
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
};