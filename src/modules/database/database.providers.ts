import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '../shared/config/config.service';
import { User } from '../user/user.entity';
import { SEQUELIZE } from '../../utils/keys';


export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory: async (configService: ConfigService) => {
            // tslint:disable-next-line:no-console
            console.log('Settings connect to DB: %j', configService.sequelizeOrmConfig);
            const sequelize = new Sequelize(configService.sequelizeOrmConfig);
            sequelize.addModels([User]);
            await sequelize.sync();
            return sequelize;
        },
        inject: [ConfigService],
    },
];