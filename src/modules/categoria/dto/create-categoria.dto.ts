import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCategoriaDto {
  
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El detalle es obligatorio' })
  detalle: string;
}
