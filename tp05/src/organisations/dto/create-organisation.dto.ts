import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateOrganisationDto {
  @IsString()
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, { message: 'slug must be a lowercase slug, e.g. "mistralai"' })
  slug!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'country must be an ISO 3166-1 alpha-2 code, e.g. "FR"' })
  country?: string;
}
