import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class TicketDto {
  @IsUUID()
  film: string;

  @IsUUID()
  session: string;

  @IsString()
  @IsNotEmpty()
  daytime: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  row: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  seat: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class OrderedTicketDto extends TicketDto {
  @IsUUID()
  id: string;
}

export class OrderResponseDto {
  @IsInt()
  @Min(0)
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderedTicketDto)
  items: OrderedTicketDto[];
}
