import { PartialType } from "@nestjs/mapped-types";
import { LoginAuthDto } from "./login-auth.dto";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class RegisterAuthDto extends PartialType(LoginAuthDto){   
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(25)
    password: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(50)
    name: string;
}