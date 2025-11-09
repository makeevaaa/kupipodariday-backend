import { IsOptional, IsString, IsEmail, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 64)
  username?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  about?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(2)
  password?: string;
}
