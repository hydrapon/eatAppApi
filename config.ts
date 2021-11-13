import { config as configDev } from './config/config.dev';
import { config as configProd } from './config/config.prod';
import * as dotenv from 'dotenv';

dotenv.config();

export default process.env.NODE_ENV === 'production' ? configProd : configDev;
