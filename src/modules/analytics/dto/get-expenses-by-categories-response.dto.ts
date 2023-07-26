import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class Category {
  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  color!: string;
}

export class GetExpensesByCategoriesResponseDto {
  @ApiProperty({ type: () => Category })
  @Expose()
  category!: Category;

  @ApiProperty()
  @Expose()
  amount!: number;

  @ApiProperty()
  @Expose()
  percentage!: number;
}
