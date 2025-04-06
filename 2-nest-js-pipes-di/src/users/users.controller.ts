import { Body, Controller, Get, Param, Post, Query, ParseIntPipe, DefaultValuePipe, ValidationPipe, ParseBoolPipe, Patch } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { GetUserParamDto } from "./dtos/get-user-param.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";


//http://localhost:3000/users/101

@Controller('users')
export class UsersController{
    constructor(private usersService: UsersService){
        
    }

   @Get(':isMarried?') 
   getUsers()
   {
     return this.usersService.getAllUsers();
   }

   @Post()
   createUser(@Body() user: CreateUserDto){
    this.usersService.createUser(user);
   }
}