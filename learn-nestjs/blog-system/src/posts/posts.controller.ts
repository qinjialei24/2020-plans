import { PostModel } from './post.model';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

class CreatePostDto {
  @ApiProperty({ description: '帖子详情' })
  title: string
  @ApiProperty({ description: '帖子内容' })
  content: string
}

@Controller('posts')
@ApiTags('默认')

export class PostsController {

  @Get()
  @ApiOperation({
    summary: '显示博客列表'
  })
  index() {
    PostModel.find().then(res => {
      return '222'
    }).catch(error => {
      console.log("TCL: PostsController -> index -> error", error)
      return error
    })
  }

  @Post()
  @ApiOperation({
    summary: '创建帖子'
  })

  @Post()
  @ApiOperation({ summary: '创建帖子' })
  create(@Body() body: CreatePostDto) {
    return body
  }

  @Put(':id')
  @ApiOperation({ summary: '帖子详情' })
  detail(@Param('id') id: string, @Body() body: CreatePostDto) {
    return {
      success: true
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除帖子' })
  remove(@Param('id') id: string) {
    return {
      success: true
    }
  }


}
