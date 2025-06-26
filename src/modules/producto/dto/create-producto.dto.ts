import { IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, } from "class-validator";

export class CreateProductoDto {
    @IsString({message: 'El nombre debe ser texto'})
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre: string;

    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'El precio debe ser un número con hasta dos decimales' },
    )
    @IsNotEmpty({ message: 'El precio es obligatorio' })
    precio: number;

    @IsInt({ message: 'El stock debe ser un número entero' })
    @IsNotEmpty({ message: 'El stock es obligatorio' })
    stock: number;

    @IsOptional()
    @IsString({ message: 'La imagen debe ser una URL o cadena de texto' })
    imagen?: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser texto' })
    descripcion: string;

    @IsOptional()
    @IsBoolean({ message: 'El estado debe ser verdadero o falso' })
    estado?: boolean;

    @IsInt({ message: 'La categoríaId debe ser un número entero' })
    @IsNotEmpty({ message: 'La categoríaId es obligatoria' })
    categoriaId: number;
}
