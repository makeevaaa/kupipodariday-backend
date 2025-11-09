import { IsBoolean, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  itemId: number;

  @IsBoolean()
  hidden?: boolean;
}
