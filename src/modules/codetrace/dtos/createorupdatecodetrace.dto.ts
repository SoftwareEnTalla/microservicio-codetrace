import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
} from "class-validator";
import { InputType, Field } from "@nestjs/graphql";
import { CreateCodetraceDto } from "./createcodetrace.dto";
import { UpdateCodetraceDto } from "./updatecodetrace.dto"; // Asegúrate de importar esto

@InputType()
export class CreateOrUpdateCodetraceDto {
  @ApiProperty({
    type: () => String,
    description: "Identificador",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateCodetraceDto,
    description: "Instancia CreateCodetrace o UpdateCodetrace",
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateCodetraceDto, { nullable: true })
  input?: CreateCodetraceDto | UpdateCodetraceDto; // Asegúrate de que esto esté correcto
}
