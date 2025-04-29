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


import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class BaseCodetraceDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateCodetrace',
    example: 'Nombre de instancia CreateCodetrace',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateCodetraceDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateCodetrace).',
    example: 'Fecha de creación de la instancia (CreateCodetrace).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateCodetrace).',
    example: 'Fecha de actualización de la instancia (CreateCodetrace).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateCodetrace).',
    example:
      'Usuario que realiza la creación de la instancia (CreateCodetrace).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateCodetrace).',
    example: 'Estado de activación de la instancia (CreateCodetrace).',
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


import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { BaseCodetraceDto } from './basecodetrace.dto';

@InputType()
export class CodetraceDto extends BaseCodetraceDto {
  // Propiedades específicas de la clase CodetraceDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
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


import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';
import { CodetraceDto } from './codetrace.dto';

@InputType()
export class CodetraceValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => CodetraceDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => CodetraceDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 


import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseCodetraceDto } from './basecodetrace.dto';

@ObjectType()
export class CodetraceOutPutDto extends BaseCodetraceDto {
  // Propiedades específicas de la clase CodetraceOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
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



import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsDate,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { BaseCodetraceDto } from './basecodetrace.dto';

@InputType()
export class CreateCodetraceDto extends BaseCodetraceDto {
  // Propiedades específicas de la clase CreateCodetraceDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateCodetrace a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateCodetraceDto>) {
    super(partial);
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



import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { CreateCodetraceDto } from './createcodetrace.dto';
import { UpdateCodetraceDto } from './updatecodetrace.dto'; // Asegúrate de importar esto

@InputType()
export class CreateOrUpdateCodetraceDto {
  @ApiProperty({
    type: () => String,
    description: 'Identificador',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateCodetraceDto,
    description: 'Instancia CreateCodetrace o UpdateCodetrace',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateCodetraceDto, { nullable: true })
  input?: CreateCodetraceDto | UpdateCodetraceDto; // Asegúrate de que esto esté correcto
}



import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsDate,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@InputType()
export class DeleteCodetraceDto {
  // Propiedades específicas de la clase DeleteCodetraceDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteCodetrace a eliminar',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = '';

  @ApiProperty({
    type: () => String,
    description: 'Lista de identificadores de instancias a eliminar',
    example:
      'Se proporciona una lista de identificadores de DeleteCodetrace a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

import { BaseCodetraceDto } from './basecodetrace.dto';

@InputType()
export class UpdateCodetraceDto extends BaseCodetraceDto {
  // Propiedades específicas de la clase UpdateCodetraceDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateCodetrace a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateCodetraceDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateCodetraceDto>): UpdateCodetraceDto {
    const instance = new UpdateCodetraceDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

