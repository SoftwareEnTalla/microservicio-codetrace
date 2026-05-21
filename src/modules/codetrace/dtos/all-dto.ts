/*
 * Copyright (c) 2026 SoftwarEnTalla
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

import { InputType, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsUUID,
  ValidateNested,
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

  @ApiProperty({
    type: () => String,
    description: 'Severidad canónica de la traza.',
    example: 'INFO',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  severity?: string;

  @ApiProperty({
    type: () => String,
    description: 'Capa técnica canónica de la traza.',
    example: 'SERVICE',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  layerType?: string;

  @ApiProperty({
    type: () => String,
    description: 'Tipo funcional canónico de la traza.',
    example: 'BUSINESS',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  functionalKind?: string;

  @ApiProperty({
    type: () => String,
    description: 'Estado de ejecución de la traza.',
    example: 'success',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  executionStatus?: string;

  @ApiProperty({
    type: () => String,
    description: 'Servicio origen de la traza.',
    example: 'orders-service',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  sourceService?: string;

  @ApiProperty({
    type: () => String,
    description: 'Clase que emitió la traza.',
    example: 'OrdersLifecycleService',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  className?: string;

  @ApiProperty({
    type: () => String,
    description: 'Función que emitió la traza.',
    example: 'OrdersLifecycleService.createOrder',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  functionName?: string;

  @ApiProperty({
    type: () => String,
    description: 'UUID propio de la traza.',
    example: '5db5cb80-64f2-4a1f-8446-d270e4d16a2b',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  traceUuid?: string;

  @ApiProperty({
    type: () => String,
    description: 'UUID correlacionado con el agregado o flujo.',
    example: 'e048f355-72f8-40d1-b4dd-58f2df0a65b2',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  refUuid?: string;

  @ApiProperty({
    type: () => Date,
    description: 'Instante de inicio de la ejecución trazada.',
    nullable: true,
  })
  @IsOptional()
  @Field(() => Date, { nullable: true })
  startedAt?: Date;

  @ApiProperty({
    type: () => Date,
    description: 'Instante de fin de la ejecución trazada.',
    nullable: true,
  })
  @IsOptional()
  @Field(() => Date, { nullable: true })
  endedAt?: Date;

  @ApiProperty({
    type: () => Number,
    description: 'Duración medida de la ejecución.',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { nullable: true })
  durationMs?: number;

  @ApiProperty({
    type: () => String,
    description: 'Unidad original reportada para la duración.',
    example: 'ms',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  durationUnit?: string;

  @ApiProperty({
    type: () => String,
    description: 'Canal de entrega de la traza.',
    example: 'kafka',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  deliveredVia?: string;

  @ApiProperty({
    type: () => String,
    description: 'Mensaje de error resumido, si aplica.',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  errorMessage?: string;

  @ApiProperty({
    type: () => GraphQLJSON,
    description: 'Contexto técnico expandido de la traza.',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, unknown>;



  // Constructor
  constructor(partial: Partial<BaseCodetraceDto>) {
    Object.assign(this, partial);
  }
}




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



