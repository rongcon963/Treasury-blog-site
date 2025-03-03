import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from "class-validator";

export class SignUpDto {
  @IsString()
  @IsOptional()
  full_name: string;

  @ValidateIf(o => o.email !== undefined && o.email !== '')
  @IsEmail({}, { message: 'Must be a valid email address' })
  email?: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
