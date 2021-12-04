import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { UsersEntity } from 'src/database/models/users.entity';
import { Repository } from "typeorm";
import { ApprovedDataDto } from '../auth/dto/approved-data.auth.dto';
import { RegistrationUserDto } from '../auth/dto/registration.auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>
  ) { }

  public async findByOneEmail(email: string): Promise<UsersEntity | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  public async findOneById(id: number): Promise<UsersEntity | undefined> {
    return await this.userRepository.findOne(id)
  }

  public async addUser(regUserDto: RegistrationUserDto, approvedData: ApprovedDataDto = null) {
    const user = new UsersEntity();

    user.email = regUserDto.email;
    user.password = regUserDto.password;
    user.name = regUserDto.name;
    user.surname = regUserDto.surname;
    user.birthday = regUserDto.birthday;

    if (approvedData) {
      user.approvedCode = approvedData.approvedCode;
      user.approvedHash = approvedData.approvedHash;
    }

    await this.userRepository.save(user);
  }

}
