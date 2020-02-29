import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
@Controller('posts')
@ApiTags('帖子')
export class PostsController {
  @Get() 
  @ApiOperation({summary: "显示博客列表"})
  index(){
    return [{ id:1 }]
  }

  @Post() 
  create(){
    return {
      success: true
    }
  }

  @Get(':id')
  detail () {
    return {
      id: 1,
      title: ''
    }
  }
}
