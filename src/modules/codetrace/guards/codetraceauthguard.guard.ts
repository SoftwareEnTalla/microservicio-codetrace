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
const TRACE_WHITELIST_PATTERNS: RegExp[] = [
  // Autenticación y login
  /authenticat/i,
  /login/i,
  /logout/i,
  /sign[_-]?in/i,
  /sign[_-]?up/i,
  /sign[_-]?out/i,
  // Registro de usuario
  /register/i,
  /create.*user/i,
  /user.*create/i,
  /signup/i,
  // Activación de cuenta
  /activat/i,
  /verify/i,
  /confirm/i,
  /pin/i,
  /mfa/i,
  /totp/i,
  // Recuperación de contraseña
  /password.*reset/i,
  /reset.*password/i,
  /forgot.*password/i,
  /recover/i,
  /change.*password/i,
  // Trazas de validación de startup de microservicios
  /\.validate$/i,
  /onModuleInit/i,
];

/**
 * Header que identifica trazas enviadas por microservicios internos.
 * Cuando este header está presente con un valor válido, la traza
 * se acepta sin token de Authorization.
 */
const TRACE_SOURCE_HEADER = 'x-trace-source';

/**
 * Lista de microservicios confiables que pueden enviar trazas sin auth.
 * Estos servicios se identifican vía header X-Trace-Source.
 */
const TRUSTED_TRACE_SOURCES: string[] = [
  'security-service',
  'customer-service',
  'client-service',
  'merchant-service',
  'payment-service',
  'invoice-service',
  'orders-service',
  'product-service',
  'salesmanager-service',
  'catalog-service',
  'codetrace-service',
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

    // 2. Si viene de un microservicio confiable (header X-Trace-Source)
    const traceSource = request.headers[TRACE_SOURCE_HEADER] as string;
    if (traceSource && TRUSTED_TRACE_SOURCES.includes(traceSource.toLowerCase())) {
      return true;
    }

    // 3. Si el body contiene datos de traza que coinciden con la whitelist
    const body = request.body;
    if (body && this.isWhitelistedTrace(body)) {
      return true;
    }

    return false;
  }

  private validateToken(token: string): boolean {
    return !!token; // delegado a JwtAuthGuard global (APP_GUARD)
  }

  /**
   * Verifica si la traza corresponde a una acción de la whitelist
   * basándose en el campo name o description del body.
   */
  private isWhitelistedTrace(body: any): boolean {
    const nameToCheck = body?.name || '';
    const descToCheck = body?.description || '';
    const textToCheck = `${nameToCheck} ${descToCheck}`;

    return TRACE_WHITELIST_PATTERNS.some(pattern => pattern.test(textToCheck));
  }
}
