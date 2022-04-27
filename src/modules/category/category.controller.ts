import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IUser } from 'src/config/interface';
import { GetUser } from 'src/decorators/get-user.decorator';
import RoleGuard from 'src/guards/role.guard';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  @Post()
  @UseGuards(RoleGuard('admin'))
  createCategory(
    @GetUser() user: IUser,
    @Body('name') name: string
  ) {
    return this.categoryService.createCategory(user, name);
  }

  @Patch(':id')
  @UseGuards(RoleGuard('admin'))
  updateCategory(
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    return this.categoryService.updateCategory(id, name);
  }

  @Delete(':id')
  @UseGuards(RoleGuard('admin'))
  deleteCategory(
    @Param('id') id: string,
  ) {
    return this.categoryService.deleteCategory(id);
  }

}
