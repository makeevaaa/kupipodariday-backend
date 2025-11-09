import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 64)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(2)
  password: string;
}
