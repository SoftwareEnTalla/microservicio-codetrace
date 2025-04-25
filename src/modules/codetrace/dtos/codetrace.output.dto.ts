import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { Field, ObjectType } from "@nestjs/graphql";
import { BaseCodetraceDto } from "./basecodetrace.dto";

@ObjectType()
export class CodetraceOutPutDto extends BaseCodetraceDto {
  // Propiedades específicas de la clase CodetraceOutPutDto en cuestión

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
  constructor(partial: Partial<CodetraceOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CodetraceOutPutDto>): CodetraceOutPutDto {
    const instance = new CodetraceOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}
