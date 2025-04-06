import { Body, Controller, Get, Param, Post, Query, ParseIntPipe, DefaultValuePipe, ValidationPipe, ParseBoolPipe, Patch, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";


//http://localhost:3000/users/101

@Controller('users')
export class UsersController{
    constructor(private usersService: UsersService){
        
    }

   @Get() 
   getUsers()
   {
     return this.usersService.getAllUsers();
   }
   @Get(':id') 
   getUserbyId(@Param('id', ParseIntPipe) id: number)
   {
     return this.usersService.FindUserById(id);
   }

   @Post()
   createUser(@Body() user: CreateUserDto){
    return this.usersService.createUser(user);
   }

   @Delete(':id')
   public deleteUser(@Param('id', ParseIntPipe) id: number){
    this.usersService.deleteUser(id);
   }
}