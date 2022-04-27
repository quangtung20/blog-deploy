import { Body, ClassSerializerInterceptor, Controller, Get, Param, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetUser } from 'src/decorators/get-user.decorator';
import RoleGuard from 'src/guards/role.guard';
import { UserService } from './user.service';




@Controller('')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,

  ) { }

  @Get('user/:id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Patch('reset_password')
  @UseGuards(RoleGuard('user'))
  resetPassword(
    @GetUser() user: any,
    @Body('password') password: string
  ) {
    return this.userService.resetPassword(user, password);
  }

  @Patch('user')
  @UseGuards(RoleGuard('user'))
  updateUser(
    @GetUser() user: any,
    @Body('avatar') avatar: string,
    @Body('name') name: string
  ) {
    return this.userService.updateUser(user, avatar, name);
  }

}
