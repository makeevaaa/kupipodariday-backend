import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  itemsId?: number[];
}
