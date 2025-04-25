import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

@InputType()
export class BaseCodetraceDto {
  @ApiProperty({
    type: () => String,
    description: "Nombre de instancia CreateCodetrace",
    example: "Nombre de instancia CreateCodetrace",
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = "";

  // Propiedades predeterminadas de la clase CreateCodetraceDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: "Fecha de creación de la instancia (CreateCodetrace).",
    example: "Fecha de creación de la instancia (CreateCodetrace).",
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: "Fecha de actualización de la instancia (CreateCodetrace).",
    example: "Fecha de actualización de la instancia (CreateCodetrace).",
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      "Usuario que realiza la creación de la instancia (CreateCodetrace).",
    example:
      "Usuario que realiza la creación de la instancia (CreateCodetrace).",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: "Estado de activación de la instancia (CreateCodetrace).",
    example: "Estado de activación de la instancia (CreateCodetrace).",
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  // Constructor
  constructor(partial: Partial<BaseCodetraceDto>) {
    Object.assign(this, partial);
  }
}
