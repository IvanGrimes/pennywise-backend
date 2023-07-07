import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AllResponseDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty({ nullable: true })
  @Expose()
  browserName!: string;

  @ApiProperty({ nullable: true })
  @Expose()
  browserVersion!: string;

  @ApiProperty({ nullable: true })
  @Expose()
  deviceType!: string;

  @ApiProperty({ nullable: true })
  @Expose()
  deviceBrand!: string;

  @ApiProperty({ nullable: true })
  @Expose()
  deviceOs!: string;

  @ApiProperty({ nullable: true })
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
