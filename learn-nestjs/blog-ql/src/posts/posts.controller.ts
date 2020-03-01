import { PostModel } from '../posts/post.module';
import { Controller, Get, Post, Body, Query, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

class CreatePostDto {
  @ApiProperty({description: '帖子标题',example: '帖子标题1'})
  @IsNotEmpty({message: '请填写标题'})
  title: string
  @ApiProperty({description: '帖子内容',example: '帖子内容1'})
  content: string
}

@Controller('posts')
@ApiTags('帖子')
export class PostsController {
  @Get() 
  @ApiOperation({summary: "显示博客列表"})
  async index (){
    // PostModel.find().then(res => {
    //   return '222'
    // }).catch(error => {
    //   // console.log("TCL: PostsController -> index -> error", error)
    //   return error
    // })
    return await PostModel.find()
    // return [{ id:1, title: '博客11' }]
  }

  @Post() 
  @ApiOperation({summary: "创建帖子"})
  async create(@Body() createPostDto: CreatePostDto, @Query() query){
    await PostModel.create(createPostDto)
    return {
      success: true
    }
  }

  @Get(':id')
  @ApiOperation({summary: "帖子详情"})
  async detail (@Param('id') id: string ) {
    return await PostModel.findById(id)
  }
  @Put(':id')
  @ApiOperation({summary: "编辑帖子"})
  async update (@Param('id') id: string, @Body() updatePostDto: CreatePostDto) {
    await PostModel.findByIdAndUpdate(id, updatePostDto)
    return {
      success: true
    }
  }

  @Delete(':id')
  @ApiOperation({summary: "删除帖子"})
  async remove (@Param('id') id: string) {
    await PostModel.findByIdAndDelete(id)
    return {
      success: true
    }
  }
}
