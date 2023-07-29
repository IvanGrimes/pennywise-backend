import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AllResponseDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty({ required: false })
  @Expose()
  browserName!: string;

  @ApiProperty({ required: false })
  @Expose()
  browserVersion!: string;

  @ApiProperty({ required: false })
  @Expose()
  deviceType!: string;

  @ApiProperty({ required: false })
  @Expose()
  deviceBrand!: string;

  @ApiProperty({ required: false })
  @Expose()
  deviceOs!: string;

  @ApiProperty({ required: false })
  @Expose()
  location!: string;

  @ApiProperty()
  @Expose()
  ip!: string;

  @ApiProperty()
  @Expose()
  isRevoked!: boolean;

  @ApiProperty()
  @Expose()
  isCurrent!: boolean;

  @ApiProperty({ type: () => Date })
  @Expose()
  updatedAt!: Date;
}
