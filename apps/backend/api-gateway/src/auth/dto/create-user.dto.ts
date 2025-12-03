import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
