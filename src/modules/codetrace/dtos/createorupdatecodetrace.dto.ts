/*
 * Copyright (c) 2025 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */

import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
} from "class-validator";
import { InputType, Field } from "@nestjs/graphql";
import { CreatecodetraceDto } from "./createcodetrace.dto";
import { UpdatecodetraceDto } from "./updatecodetrace.dto"; // Asegúrate de importar esto

@InputType()
export class CreateOrUpdatecodetraceDto {
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
    type: () => CreatecodetraceDto,
    description: "Instancia Createcodetrace o Updatecodetrace",
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreatecodetraceDto, { nullable: true })
  input?: CreatecodetraceDto | UpdatecodetraceDto; // Asegúrate de que esto esté correcto
}

