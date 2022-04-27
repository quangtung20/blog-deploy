import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { IUser } from 'src/config/interface';
import { Category, CategoryDocument } from 'src/database/schemas/category.schema';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) { }


  async createCategory(user: IUser, name: string) {
    try {
      const check = await this.categoryModel.findOne({ name });
      if (check) {
        throw new BadRequestException({ msg: 'This category is already exists' });
      }
      const newCat = await this.categoryModel.create({ name })

      return { newCategory: newCat };

    } catch (error) {
      throw new InternalServerErrorException({ msg: error.message });
    }
  }

  async getCategories() {
    try {
      const categories = await this.categoryModel.find().sort('-createdAt');
      return { categories };
    } catch (error) {
      throw new InternalServerErrorException({ msg: error.message });
    }
  }

  async updateCategory(id: string, name: string) {
    try {
      const category = await this.categoryModel.findByIdAndUpdate({
        _id: id
      }, {
        name: name.toLowerCase()
      });

      return { msg: 'Update Success!' };
    } catch (error) {
      throw new InternalServerErrorException({ msg: error.message });
    }
  }

  async deleteCategory(id: string) {
    try {
      await this.categoryModel.findByIdAndDelete(id);
    } catch (error) {
      throw new InternalServerErrorException({ msg: error.message });
    }
  }
}
