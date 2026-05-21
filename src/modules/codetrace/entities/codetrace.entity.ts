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

import { Column, Entity, OneToOne, JoinColumn, ChildEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, Index, Check, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreateCodetraceDto, UpdateCodetraceDto, DeleteCodetraceDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';



@ChildEntity('codetrace')
@ObjectType()
export class Codetrace extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Codetrace",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Codetrace", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Codetrace' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Codetrace",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Codetrace", nullable: false })
  @Column({ type: 'text', nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Codetrace' })
  private description!: string;

  @ApiProperty({ type: String, nullable: true, description: 'Severidad canónica de la traza' })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true, default: 'INFO' })
  private severity?: string;

  @ApiProperty({ type: String, nullable: true, description: 'Capa técnica canónica de la traza' })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 40, nullable: true, default: 'SERVICE' })
  private layerType?: string;

  @ApiProperty({ type: String, nullable: true, description: 'Tipo funcional canónico de la traza' })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 24, nullable: true, default: 'TECHNICAL' })
  private functionalKind?: string;

  @ApiProperty({ type: String, nullable: true, description: 'Estado de ejecución reportado' })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  private executionStatus?: string;

  @ApiProperty({ type: String, nullable: true, description: 'Servicio que emitió la traza' })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  private sourceService?: string;

  @ApiProperty({ type: String, nullable: true, description: 'Clase que emitió la traza' })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 120, nullable: true })
  private className?: string;

  @ApiProperty({ type: String, nullable: true, description: 'Función que emitió la traza' })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 160, nullable: true })
  private functionName?: string;

  @ApiProperty({ type: String, nullable: true, description: 'UUID principal de la traza' })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  private traceUuid?: string;

  @ApiProperty({ type: String, nullable: true, description: 'UUID correlacionado o referencia funcional' })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  private refUuid?: string;

  @ApiProperty({ type: Date, nullable: true, description: 'Inicio de ejecución' })
  @IsOptional()
  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  private startedAt?: Date;

  @ApiProperty({ type: Date, nullable: true, description: 'Fin de ejecución' })
  @IsOptional()
  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  private endedAt?: Date;

  @ApiProperty({ type: Number, nullable: true, description: 'Duración en ms' })
  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  @Column({ type: 'double precision', nullable: true })
  private durationMs?: number;

  @ApiProperty({ type: String, nullable: true, description: 'Unidad original de duración' })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 16, nullable: true })
  private durationUnit?: string;

  @ApiProperty({ type: String, nullable: true, description: 'Canal por el que llegó la traza' })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 40, nullable: true })
  private deliveredVia?: string;

  @ApiProperty({ type: String, nullable: true, description: 'Mensaje de error resumido' })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  private errorMessage?: string;

  @ApiProperty({ type: () => GraphQLJSON, nullable: true, description: 'Contexto técnico ampliado' })
  @IsOptional()
  @IsObject()
  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  private metadata?: Record<string, unknown>;



  protected executeDslLifecycle(): void {

  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'codetrace';
  }

  // Getters y Setters
  get getName(): string {
    return this.name;
  }
  set setName(value: string) {
    this.name = value;
  }
  get getDescription(): string {
    return this.description;
  }

  // Métodos abstractos implementados
  async create(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async update(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async delete(id: string): Promise<BaseEntity> {
    this.id = id;
    return this;
  }

  // Método estático para convertir DTOs a entidad con sobrecarga
  static fromDto(dto: CreateCodetraceDto): Codetrace;
  static fromDto(dto: UpdateCodetraceDto): Codetrace;
  static fromDto(dto: DeleteCodetraceDto): Codetrace;
  static fromDto(dto: any): Codetrace {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Codetrace, dto);
  }
}
