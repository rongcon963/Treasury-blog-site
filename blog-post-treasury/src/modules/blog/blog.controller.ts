import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = './public/images';
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().replace(/[:.]/g, "-");
        const ext = extname(file.originalname);
        const fileOriginalName = file.originalname.split('.')[0].split(' ').join('_');
        const filename = `${formattedDate}_${fileOriginalName}${ext}`;
        cb(null, filename);
      },
    }),
  }))
  async create(@Body() createBlogDto: CreateBlogDto, @UploadedFile() image: Express.Multer.File) {
    try {
      await this.blogService.create(createBlogDto, image);

      return {
        success: true,
        message: 'Blog Created Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get()
  async findAll() {
    try {
      const data = await this.blogService.findAll();
      return {
        success: true,
        data,
        message: 'Blog Fetched Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.blogService.findOne(id);
      return {
        success: true,
        data,
        message: 'Blog Fetched Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = './public/images';
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().replace(/[:.]/g, "-");
        const ext = extname(file.originalname);
        const fileOriginalName = file.originalname.split('.')[0].split(' ').join('_');
        const filename = `${formattedDate}_${fileOriginalName}${ext}`;
        cb(null, filename);
      },
    }),
  }))
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto, @UploadedFile() image: Express.Multer.File) {
    try {
      await this.blogService.update(id, updateBlogDto, image);
      return {
        success: true,
        message: 'Blog Updated Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      await this.blogService.remove(id);
      return {
        success: true,
        message: 'Book Deleted Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
