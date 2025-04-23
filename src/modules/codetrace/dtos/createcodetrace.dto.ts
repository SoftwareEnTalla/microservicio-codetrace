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


import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsDate, IsOptional,IsObject, ValidateNested } from 'class-validator';
import { InputType, Field, ObjectType} from '@nestjs/graphql';  
import { UpdateCodetraceDto } from './updatecodetrace.dto';
import { isCreateOrUpdateCodetraceDtoType } from '../decorators/codetrace.decorators';


@InputType()
export class CreateCodetraceDto {

  // Propiedades específicas de la clase CreateCodetraceDto en cuestión
  
   
  @ApiProperty({
    description: "Identificador de instancia a crear",
    example: "Se proporciona un identificador de CreateCodetrace a crear \(opcional\) ",
  })
  @IsString()
  @IsOptional()
  @Field(() => String,{ nullable: true })
  id?: string;

  @ApiProperty({
    type: String,
    description: "Nombre de instancia CreateCodetrace",
    example: "Nombre de instancia CreateCodetrace",
    nullable: false
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateCodetraceDto según especificación del sistema

  @ApiProperty({
    type: Date,
    description: "Fecha de creación de la instancia (CreateCodetrace).",
    example: "Fecha de creación de la instancia (CreateCodetrace).",
    nullable: false
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: Date,
    description: "Fecha de actualización de la instancia (CreateCodetrace).",
    example: "Fecha de actualización de la instancia (CreateCodetrace).",
    nullable: false
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: String,
    description:
      "Usuario que realiza la creación de la instancia (CreateCodetrace).",
    example: "Usuario que realiza la creación de la instancia (CreateCodetrace).",
    nullable: true
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: Boolean,
    description: "Estado de activación de la instancia (CreateCodetrace).",
    example: "Estado de activación de la instancia (CreateCodetrace).",
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  // Constructor
  constructor(partial: Partial<CreateCodetraceDto>) {
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateCodetraceDto>): CreateCodetraceDto {
    const instance = new CreateCodetraceDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }

}


        
        @InputType()
        export class CodetraceDto {
          // Propiedades específicas de la clase CodetraceDto en cuestión

          @ApiProperty({ type: String ,nullable: true, description: 'Identificador único de la instancia' })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          id?: string;

          @ApiProperty({ type: String ,nullable: false, description: 'Nombre de la instancia' })
          @IsString()
          @IsNotEmpty()
          @Field(() => String, { nullable: false })
          name: string = '';

          // Propiedades predeterminadas de la clase CodetraceDto según especificación del sistema

          @ApiProperty({ type: Date ,nullable: false, description: 'Fecha de creaciónde la instancia' })
          @IsDate()
          @IsNotEmpty()
          @Field(() => Date, { nullable: false })
          creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

          @ApiProperty({ type: Date ,nullable: false, description: 'Fecha de modificación de la instancia' })
          @IsDate()
          @IsNotEmpty()
          @Field(() => Date, { nullable: false })
          modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

          @ApiProperty({ type: String ,nullable: true, description: 'Creador de la instancia' })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          createdBy?: string; // Usuario que crea el objeto

          @ApiProperty({ type: Boolean ,nullable: false, description: 'Describe si la instancia está activa o no' })
          @IsBoolean()
          @IsNotEmpty()
          @Field(() => Boolean, { nullable: false })
          isActive: boolean = false; // Por defecto, el objeto no está activo

          // Constructor
          constructor(partial: Partial<CodetraceDto>) {
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

        @ObjectType()
        export class CodetraceOutPutDto {
          // Propiedades específicas de la clase CodetraceDto en cuestión

          @ApiProperty({ type: String ,nullable: true, description: 'Identificador único de la instancia' })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          id?: string;

          @ApiProperty({ type: String ,nullable: false, description: 'Nombre de la instancia' })
          @IsString()
          @IsNotEmpty()
          @Field(() => String, { nullable: false })
          name: string = '';

          // Propiedades predeterminadas de la clase CodetraceDto según especificación del sistema
          @ApiProperty({ type: Date ,nullable: false, description: 'Fecha de creaciónde la instancia' })
          @IsDate()
          @IsNotEmpty()
          @Field(() => Date, { nullable: false })
          creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

          @ApiProperty({ type: Date ,nullable: false, description: 'Fecha de modificación de la instancia' })
          @IsDate()
          @IsNotEmpty()
          @Field(() => Date, { nullable: false })
          modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

          @ApiProperty({ type: String ,nullable: true, description: 'Creador de la instancia' })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          createdBy?: string; // Usuario que crea el objeto

          @ApiProperty({ type: Boolean ,nullable: false, description: 'Describe si la instancia está activa o no' })
          @IsBoolean()
          @IsNotEmpty()
          @Field(() => Boolean, { nullable: false })
          isActive: boolean = false; // Por defecto, el objeto no está activo

          // Constructor
          constructor(partial: Partial<CodetraceDto>) {
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

        //Create or Update Dto

        @InputType()
        export class CreateOrUpdateCodetraceDto {
          @ApiProperty({
            type: String,
            description: "Identificador de la instancia CreateCodetrace",
            example: "Nombre de instancia CreateCodetrace",
            nullable: true,
          })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          id?: string; // Si tiene ID, es una actualización

          @ApiProperty({
            type: ()=>CreateCodetraceDto || UpdateCodetraceDto,
            description: "Nombre de instancia CreateCodetrace",
            example: "Nombre de instancia CreateCodetrace",
            nullable: true
          })
          @IsOptional()
          @IsObject()
          @ValidateNested() // Asegúrate de validar los objetos anidados
          @isCreateOrUpdateCodetraceDtoType({
            message:
              "input debe ser un objeto de tipo CreateCodetraceDto o UpdateCodetraceDto",
          }) // Usar class-transformer para la transformación de tipos
          @Field(() => CreateCodetraceDto, { nullable: true }) // Asegúrate de que el campo sea nullable si es opcional
          input?: CreateCodetraceDto | UpdateCodetraceDto;
        }

        @InputType()
        export class CodetraceValueInput {
          @ApiProperty({ type: String ,nullable: false, description: 'Campo de filtro' })
          @Field({ nullable: false })
          fieldName: string = 'id';

          @ApiProperty({ type: CodetraceDto ,nullable: false, description: 'Valor del filtro' })
          @Field(() => CodetraceDto, { nullable: false })
          fieldValue: any; // Permite cualquier tipo
        }

        


