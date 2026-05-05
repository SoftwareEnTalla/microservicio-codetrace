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


import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

/**
 * Lista blanca de patrones de trazas que NO requieren autenticación.
 * Estos patrones corresponden a acciones de usuarios no autenticados:
 * - Registro de usuario (signup/register)
 * - Activación de cuenta (PIN, verificación de email)
 * - Login / Autenticación (el usuario aún no tiene token)
 * - Recuperación de contraseña (forgot/reset password)
 * - Logout (invalidar sesión)
 * - Trazas internas de microservicios (sourceService identificado en header)
 *
 * Los microservicios que envían trazas de funciones relacionadas con estas
 * acciones pueden hacerlo sin token de Authorization incluyendo el header
 * X-Trace-Source con el nombre del microservicio.
 */
const TRACE_SOURCE_HEADER = 'x-trace-source';
const TRACE_PUBLIC_PATH_HEADER = 'x-trace-public-path';
const SECURITY_PUBLIC_TRACE_PATHS: RegExp[] = [
  /^\/api\/logins\/command(?:$|[/?])/i,
  /^\/api\/users\/command\/signup(?:$|[/?])/i,
  /^\/api\/.*(?:forgot|recover|reset|activate|verify|confirm|pin|mfa|totp|password)(?:$|[/?-])/i,
];

@Injectable()
export class CodetraceAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    // 1. Si tiene token válido, permitir acceso
    const token = request.headers.authorization?.split(' ')[1];
    if (token && this.validateToken(token)) {
      return true;
    }

    // 2. Security puede emitir trazas públicas sin token solo para rutas públicas explícitas.
    const traceSource = request.headers[TRACE_SOURCE_HEADER] as string;
    const tracePublicPath = request.headers[TRACE_PUBLIC_PATH_HEADER] as string;
    if (
      traceSource?.toLowerCase() === 'security-service' &&
      SECURITY_PUBLIC_TRACE_PATHS.some((pattern) => pattern.test(tracePublicPath || ''))
    ) {
      return true;
    }

    return false;
  }

  private validateToken(token: string): boolean {
    return !!token; // delegado a JwtAuthGuard global (APP_GUARD)
  }
}
