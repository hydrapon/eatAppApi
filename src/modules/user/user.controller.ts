import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../utils/guards/auth.guard';
import { FilterUserDto } from './dto/filter.user.dto';
import { PasswordResetUserDto } from './dto/password-reset.user.dto';
import { UpdateInfoUserDto } from './dto/update-info.user.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    // @Get()
    // @ApiOperation({ summary: 'Получение пользователя' })
    // @ApiBearerAuth()
    // @ApiOkResponse({ type: UserDto })
    // @UseGuards(JwtAuthGuard)
    // getUser(
    //     @Req() req
    // ): UserDto {
    //     return new UserDto(req.user)
    // }

    /*--------------------------------------------------------------------------------------*/

    @Get(':id')
    @ApiOperation({ summary: 'Получение пользователя по id' })
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserDto })
    @ApiParam({ name: 'id', required: true, type: 'string' })
    @UseGuards(JwtAuthGuard)
    getUserById(
        @Param('id', ParseIntPipe) id: number,
        @Req() req
    ) {
        return this.userService.getUserById(id, req.user)
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Редактирование пользователя' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', required: true, type: 'string' })
    @UseGuards(JwtAuthGuard)
    updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateInfoUser: UpdateInfoUserDto,
        @Req() req
    ) {
        return this.userService.updateUser(id, updateInfoUser, req.user.id)
    }

    @Patch(':id/passwordReset')
    @ApiOperation({ summary: 'Изменение пароля' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', required: true, type: 'string' })
    @UseGuards(JwtAuthGuard)
    passwordReset(
        @Param('id', ParseIntPipe) id: number,
        @Body() passwordResetDto: PasswordResetUserDto,
        @Req() req
    ){
        return this.userService.passwordReset(id, passwordResetDto, req.user.id)
    }

    /*--------------------------------------------------------------------------------------*/

    @Get(':id/friends')
    @ApiOperation({ summary: 'Получение друзей пользователя' })
    @ApiBearerAuth()
    getUserFriends(
        @Param('id', ParseIntPipe) id: number,
        @Query() filterUserDto: FilterUserDto,
        @Req() req
    ) {
        return 'friends'
    }

    /*--------------------------------------------------------------------------------------*/

    @Get(':id/posts')
    @ApiOperation({ summary: 'Получение постов пользователя' })
    @ApiBearerAuth()
    getUserPosts(
        @Param('id', ParseIntPipe) id: number,
        @Query() filterUserDto: FilterUserDto,
        @Req() req
    ) {
        return 'posts'
    }

    /*--------------------------------------------------------------------------------------*/

    @Get(':id/recipes')
    @ApiOperation({ summary: 'Получение рецептов пользователя' })
    @ApiBearerAuth()
    getUserRecipes(
        @Param('id', ParseIntPipe) id: number,
        @Query() filterUserDto: FilterUserDto,
        @Req() req
    ) {
        return 'posts'
    }

}
