import { ApiProperty } from "@nestjs/swagger";
import { Field, InputType } from "@nestjs/graphql";
import { CodetraceDto } from "./codetrace.dto";

@InputType()
export class CodetraceValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: "Campo de filtro",
  })
  @Field({ nullable: false })
  fieldName: string = "id";

  @ApiProperty({
    type: () => CodetraceDto,
    nullable: false,
    description: "Valor del filtro",
  })
  @Field(() => CodetraceDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
}
