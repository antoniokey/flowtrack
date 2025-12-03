import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;
}

export class BadRequestDto {
  @ApiProperty({ type: ErrorDto })
  error!: ErrorDto;
}
