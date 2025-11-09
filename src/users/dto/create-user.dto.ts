import { IsEmail, IsNotEmpty, IsOptional, Length, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 64)
  username: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  about?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(2)
  password: string;
}
