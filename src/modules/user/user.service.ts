import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from "mongoose";
import { User, UserDocument } from 'src/database/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }


  async getUser(id) {
    try {
      const user:any = await this.userModel.findOne({_id:id});
      return {
        ...user._doc,
        _id:id
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async resetPassword(user, password: string) {
    if (!user) {
      throw new BadRequestException({ msg: "Invalid Authentication." });
    }

    if (user.type !== 'register') {
      throw new BadRequestException({
        msg: `Quick login account with ${user.type} can't use this function.`
      });
    }
    try {
      const passwordHash = await bcrypt.hash(password, 12);
      await this.userModel.findOneAndUpdate({ _id: user._id }, { password: passwordHash });

    } catch (error) {
      throw new InternalServerErrorException({ msg: error.message })
    }
  }

  async updateUser(user, avatar: string, name: string) {
    if (!user) {
      throw new BadRequestException({ msg: "Invalid Authentication." });
    }
    try {
      await this.userModel.findByIdAndUpdate({ _id: user._id }, {
        avatar, name
      })

      return { msg: "Update Success!" }
    } catch (error) {
      throw new InternalServerErrorException({ msg: error.message })
    }
  }
}
