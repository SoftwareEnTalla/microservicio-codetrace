import { readFileSync } from "fs";
import { join } from "path";

export function loadEnv(path: string): void {
  try {
    const envPath = join(path, ".env");
    const envFile = readFileSync(envPath, "utf-8");

    envFile.split("\n").forEach((line) => {
      if (!line.trim() || line.startsWith("#")) return;

      const [key, ...values] = line.split("=");
      const value = values.join("=").trim();

      if (key && !process.env[key]) {
        process.env[key] = value.replace(/^['"]/, "").replace(/['"]$/, "");
      }
    });

    console.log("✅ Variables de entorno cargadas correctamente");
  } catch (error: any) {
    console.error("❌ Error cargando .env:", error.message);
  }
}
