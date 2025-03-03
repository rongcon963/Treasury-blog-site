import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities';
import { Repository } from 'typeorm';
import { BlogDto, CreateBlogDto, UpdateBlogDto } from './dto';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import * as fs from 'fs';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private configService: ConfigService,
  ) {}
  
  async create(createBlogDto: CreateBlogDto, file: Express.Multer.File): Promise<CreateBlogDto> {
    let fileUrl = '';
    if (file) {
      fileUrl = `${this.configService.get<string>('API_URL')}/public/images/${file.filename}`;
    }
    const blogData = this.blogRepository.create({...createBlogDto, image: fileUrl});
    return await this.blogRepository.save(blogData);
  }

  async findAll(): Promise<CreateBlogDto[]> {
    return await this.blogRepository.find();
  }

  async findOne(id: string): Promise<BlogDto> {
    const blogData = await this.blogRepository.findOneBy({ id });
    if (!blogData) {
      throw new HttpException('Blog Not Found', 404);
    }
    return blogData;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto, file: Express.Multer.File) {
    const blog = await this.findOne(id);
    let fileUrl = '';
    if (file?.fieldname && file?.fieldname !== blog.image) {
      fileUrl = `${this.configService.get<string>('API_URL')}/public/images/${file.filename}`;
      // Delete old image
      if (blog.image !== fileUrl) {
        const oldImagePath = blog.image;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    Object.assign(blog, {...updateBlogDto, image: fileUrl || null});
    return await this.blogRepository.save(blog);
  }

  async remove(id: string) {
    const blog = await this.findOne(id);

    await this.blogRepository.delete({ id: blog.id });
    
    return {
      status: HttpStatus.OK,
      message: 'The blog has been successfully deleted.'
    }
  }
}
