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
 *
 *
 */


import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsBoolean, IsDate, IsOptional,IsObject, ValidateNested } from "class-validator";
import { InputType, Field } from '@nestjs/graphql'; 
import { Type } from 'class-transformer';

@InputType()
export class DeleteCodetraceDto {
 // Propiedades específicas de la clase DeleteCodetraceDto en cuestión
  
 
  @ApiProperty({
    description: "Identificador de instancia a eliminar",
    example: "Se proporciona un identificador de DeleteCodetrace a eliminar",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String,{ nullable: false })
  id: string='';
  

  @ApiProperty({
    description: "Lista de identificadores de instancias a eliminar",
    example:"Se proporciona una lista de identificadores de DeleteCodetrace a eliminar",
  })
  @IsString()
  @IsOptional()
  @Field(() => String,{ nullable: true })
  ids?: string[];  
  

}
