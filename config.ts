import * as dotenv from 'dotenv';

dotenv.config();

export default process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
