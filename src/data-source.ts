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


import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Pool, PoolConfig } from "pg";
import path from "path";
import "reflect-metadata";
import { CustomPostgresOptions } from "./interfaces/typeorm.interface";
import { logger } from '@core/logs/logger';
import * as net from "net";

dotenv.config();

const REQUIRED_EXTENSIONS = ["pg_trgm", "uuid-ossp", "pg_stat_statements"];

export const AppDataSource = new DataSource({
  type: "postgres",
  name: "codetrace-service",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "codetrace-service",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  entities: [path.join(__dirname, "**/*.entity.{js,ts}")],
  migrations: [path.join(__dirname, "migrations/**/*.{ts,js}")],
  migrationsTableName: "migrations_history",
  extra: {
    max: 20,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    application_name: "nestjs-application",
  },
} as CustomPostgresOptions);
// Espera a que Postgres esté aceptando conexiones TCP
export async function waitForPostgres(
  host: string,
  port: number,
  timeoutMs: number = 60000,
  intervalMs: number = 1000
) {
  const start = Date.now();
  return new Promise<void>((resolve, reject) => {
    const tryConnect = () => {
      const socket = new net.Socket();
      socket.setTimeout(3000);
      socket.once('connect', () => {
        socket.destroy();
        resolve();
      });
      socket.once('error', () => {
        socket.destroy();
        if (Date.now() - start >= timeoutMs) {
          reject(new Error(`Timeout esperando Postgres en ${host}:${port}`));
        } else {
          setTimeout(tryConnect, intervalMs);
        }
      });
      socket.once('timeout', () => {
        socket.destroy();
        if (Date.now() - start >= timeoutMs) {
          reject(new Error(`Timeout esperando Postgres en ${host}:${port}`));
        } else {
          setTimeout(tryConnect, intervalMs);
        }
      });
      socket.connect(port, host);
    };
    tryConnect();
  });
}



// Añade esta función después de initializeDatabase()
export async function createDatabaseIfNotExists(
  dbName: string,
  owner: string = "postgres"
) {
  const adminPoolConfig: PoolConfig = {
    user: process.env.DB_USERNAME || "postgres",
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASSWORD || "postgres",
    port: Number(process.env.DB_PORT) || 5432,
    database: "postgres", // Conectamos a la BD por defecto
  };

  const adminPool = new Pool(adminPoolConfig);
  const client = await adminPool.connect();

  try {
    // Verificar si la BD existe
    const checkDbQuery = `
      SELECT 1 FROM pg_database 
      WHERE datname = $1
    `;
    const dbExists = await client.query(checkDbQuery, [dbName]);

    if (dbExists.rows.length === 0) {
      logger.notify(`Creando base de datos ${dbName}...`,'🛠');

        const createDbQuery = `
            CREATE DATABASE "${dbName}"
            WITH OWNER = "${owner}"
            ENCODING = 'UTF8'
            LC_COLLATE = 'en_US.UTF-8'
            LC_CTYPE = 'en_US.UTF-8'
            TEMPLATE = template0
            CONNECTION LIMIT = -1;
        `;

          // Crear la BD con el owner especificado
          await client.query(createDbQuery);

      logger.success(`Base de datos ${dbName} creada con éxito`);

      // Otorgar todos los privilegios al owner
      await client.query(`GRANT ALL PRIVILEGES ON DATABASE "${dbName}" TO "${owner}";`);
    } else {
      logger.info(`ℹLa base de datos ${dbName} ya existe`);
    }
  } catch (error) {
    logger.error(
      `Error al verificar/crear la base de datos ${dbName}:`,
      error
    );
    throw error;
  } finally {
    client.release();
    adminPool.end();
  }
}


async function checkPostgreSQLExtensions() {
  const poolConfig: PoolConfig = {
    user: process.env.DB_USERNAME || "entalla",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "entalla",
    password: process.env.DB_PASSWORD || "entalla",
    port: Number(process.env.DB_PORT) || 5432,
  };

  const pool = new Pool(poolConfig);
  const codetrace = await pool.connect();

  try {
    for (const ext of REQUIRED_EXTENSIONS) {
      const res = await codetrace.query(
        `SELECT * FROM pg_available_extensions WHERE name = $1`,
        [ext]
      );
      if (res.rows.length === 0) {
        logger.warn(`⚠️ Extensión '' no disponible`);
      } else {
        logger.log(`✅ Extensión '' instalada`);
        await codetrace.query(`CREATE EXTENSION IF NOT EXISTS ""`);
      }
    }
  } finally {
    await codetrace.release();
    await pool.end();
  }
}

export async function initializeDatabase() {
  try {
    logger.info("Data Source Object: ",AppDataSource);
    if (!AppDataSource.isInitialized) {
      // Esperar a que Postgres esté disponible
      await waitForPostgres(
        process.env.DB_HOST || "localhost",
        Number(process.env.DB_PORT) || 5432
      );
      // Primero verificar/crear la BD
      await createDatabaseIfNotExists(
        process.env.DB_NAME || "entalla",
        process.env.DB_USERNAME || "entalla"
      );
      // Luego el resto de la inicialización
      await checkPostgreSQLExtensions();
      await AppDataSource.initialize();
      logger.log("📦 DataSource inicializado correctamente");
    }
    return AppDataSource;
  } catch (error) {
    logger.error("❌ Error durante la inicialización:", error);
    throw error;
  }
}


