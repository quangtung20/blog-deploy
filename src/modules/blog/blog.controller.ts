import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { INewBlog, IUser } from 'src/config/interface';
import { GetUser } from 'src/decorators/get-user.decorator';
import RoleGuard from 'src/guards/role.guard';
import { BlogService } from './blog.service';

@Controller('')
export class BlogController {
    constructor(
        private blogService: BlogService
    ) { }

    @Post('blog')
    @UseGuards(RoleGuard('user'))
    createBlog(
        @GetUser() user: IUser,
        @Body() newBlogDto: INewBlog
    ) {
        return this.blogService.createBlog(user, newBlogDto);
    }

    @Get('home/blogs')
    getHomeBlog() {
        return this.blogService.getHomeBlogs();
    }

    @Get('blogs/category/:id')
    getBlogByCategory(
        @Param('id') id: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        return this.blogService.getBlogsByCategory(page, limit, id);
    }

    @Get('/blogs/user/:id')
    GetBlogByUser(
        @Param('id') id: string,
        @Query('page') page: number,
        @Query('limit') limit: number
    ) {
        return this.blogService.getBlogByUser(page, limit, id);
    }

    @Get('/blog/:id')
    GetBlog(@Param('id') id: string) {
        return this.blogService.getBlog(id);
    }

    @Put('/blog/:id')
    @UseGuards(RoleGuard('user'))
    UpdateBlog(
        @Param('id') id: string,
        @GetUser() user: IUser,
        @Body() updateBlogDto: INewBlog
    ) {
        return this.blogService.updateBlog(user, updateBlogDto, id);
    }

    @Delete('/blog/:id')
    @UseGuards(RoleGuard('user'))
    deleteBlog(
        @GetUser() user: IUser,
        @Param('id') id: string,
    ) {
        return this.blogService.deleteBlog(user, id);
    }

    @Get('/search/blogs')
    searchBlog(
        @Query('title') title:string
    ){
        return this.blogService.searchBlogs(title);
    }
}
