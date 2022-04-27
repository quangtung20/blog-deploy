import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { INewComment, IUser } from 'src/config/interface';
import { GetUser } from 'src/decorators/get-user.decorator';
import RoleGuard from 'src/guards/role.guard';
import { CommentService } from './comment.service';

@Controller()
export class CommentController {
    constructor(private commentService: CommentService) { }

    @Post('comment')
    @UseGuards(RoleGuard('user'))
    createComment(
        @GetUser() user: IUser,
        @Body() newCommentDto: INewComment
    ) {
        return this.commentService.createComment(newCommentDto, user);
    }

    @Get('comments/blog/:id')
    getComment(
        @Param('id') id: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        return this.commentService.getComments(page, limit, id);
    }

    @Post('reply_comment')
    @UseGuards(RoleGuard('user'))
    replyComment(
        @GetUser() user: IUser,
        @Body() replyCommentDto:INewComment 
    ) {
        return this.commentService.replyComment(user, replyCommentDto);
    }

    @Patch('comment/:id')
    @UseGuards(RoleGuard('user'))
    updateComment(
        @Param('id') id: string,
        @GetUser() user: IUser,
        @Body('content') content: string
    ) {
        return this.commentService.updateComment(user, id, content);
    }

    @Delete('comment/:id')
    @UseGuards(RoleGuard('user'))
    deleteComment(
        @Param('id') id: string,
        @GetUser() user: IUser,
    ) {
        return this.commentService.deleteComment(user, id);
    }


}
