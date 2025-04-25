import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { BaseCodetraceDto } from "./basecodetrace.dto";

@InputType()
export class CodetraceDto extends BaseCodetraceDto {
  // Propiedades específicas de la clase CodetraceDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Identificador único de la instancia",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CodetraceDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CodetraceDto>): CodetraceDto {
    const instance = new CodetraceDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}
