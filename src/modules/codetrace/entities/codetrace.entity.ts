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

import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";
import {
  CreateCodetraceDto,
  UpdateCodetraceDto,
  DeleteCodetraceDto,
} from "../dtos/all-dto";

import {
  IsNotEmpty,
  IsString,
  validate,
  IsEnum,
  IsOptional,
  IsNumber,
} from "class-validator";
import { plainToClass, plainToInstance } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity("codetrace")
export class Codetrace extends BaseEntity {
  // Propiedades de Codetrace
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Codetrace",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: "Nombre de la instancia de Codetrace",
    nullable: false,
  })
  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    comment: "Este es un campo para nombrar la instancia Codetrace",
  })
  private name?: string;

  @ApiProperty({
    type: () => String,
    description: "Referencia UUID de la instancia",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    comment:
      "Este es un campo para referenciar a la instancia de la traza anterior",
  })
  refuuid?: string;

  @ApiProperty({
    type: () => String,
    description: "Nombre de la clase relacionada",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    comment: "Este es un campo para definir la clase relacionada",
  })
  className?: string;

  @ApiProperty({
    type: () => String,
    description: "Nombre de la función relacionada",
  })
  @IsString()
  @Field(() => String)
  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    comment:
      "Este es un campo para definir el nombre de la función relacionada",
  })
  functionName?: string;

  @ApiProperty({
    type: () => String,
    description: "Hora de inicio de la traza",
  })
  @IsString()
  @Field(() => String)
  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    comment: "Este es un campo para definir tiempo de inicio de la traza",
  })
  startTime?: string;

  @ApiProperty({
    type: () => String,
    description: "Hora de finalización de la traza",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    comment: "Este es un campo para definir tiempo de finalización de la traza",
  })
  endTime?: string;

  @ApiProperty({
    type: () => Number,
    description: "Duración de la traza",
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Number, { nullable: true })
  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    comment: "Este es un campo para definir duración de la traza",
  })
  duration?: number;

  @ApiProperty({
    type: () => String,
    description: "Unidad de duración",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    comment: "Este es un campo para definir unidad de duración",
  })
  durationUnit?: string;

  @ApiProperty({
    enum: ["success", "error"],
    description: "Estado de la traza",
  })
  @IsEnum(["success", "error"])
  @Field(() => String)
  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    comment: "Este es un campo para definir estado de la traza",
  })
  status: "success" | "error" = "success";

  @ApiProperty({
    type: () => String,
    description: "Información del error, si aplica",
    nullable: true,
  })
  @IsOptional()
  @Field(() => String, { nullable: true })
  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    comment: "Este es un campo para definir información del error, si aplica",
  })
  error?: string;

  // Constructor de Codetrace
  constructor() {
    super();
  }

  // Getters y Setters

  get getName(): string {
    return this.name || "";
  }

  set setName(value: string) {
    this.name = value;
  }

  //Métodos o funciones de Codetrace

  static fromDto(
    dto: CreateCodetraceDto | UpdateCodetraceDto | DeleteCodetraceDto
  ): Codetrace {
    return plainToClass(Codetrace, dto);
  }

  //Implementación de Métodos abstractos de la clase padre
  async create(data: any): Promise<Codetrace> {
    // Verifica si data es un array y toma el primer objeto si es necesario
    const singleData = Array.isArray(data) ? data[0] : data; // Si es un array, tomamos el primer objeto

    // Convertir el objeto data a una instancia del DTO
    const codetraceDto = plainToInstance(
      CreateCodetraceDto,
      data as CreateCodetraceDto
    );

    // Validar el DTO
    const errors = await validate(codetraceDto);
    if (errors.length > 0) {
      throw new Error("Validation failed creating codetrace!"); // Manejo de errores de validación
    }
    // Asignar la fecha de modificación
    codetraceDto.modificationDate = new Date();
    return { ...this, ...codetraceDto };
  }
  async update(data: any): Promise<Codetrace> {
    // Verifica si data es un array y toma el primer objeto si es necesario
    const singleData = Array.isArray(data) ? data[0] : data; // Si es un array, tomamos el primer objeto

    // Convertir el objeto data a una instancia del DTO
    const codetraceDto = plainToInstance(
      CreateCodetraceDto,
      singleData as CreateCodetraceDto
    );

    // Validar el DTO
    const errors = await validate(codetraceDto);
    if (errors.length > 0) {
      throw new Error("Validation failed creating codetrace!"); // Manejo de errores de validación
    }
    // Asignar la fecha de modificación
    codetraceDto.modificationDate = new Date();
    return { ...this, ...codetraceDto };
  }
  async delete(): Promise<Codetrace> {
    return { ...this };
  }
}
