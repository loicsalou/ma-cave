import * as log from 'loglevel';

/**
 * Wrapper de l'API de log "loglevel" https://www.npmjs.com/package/loglevel
 * Permet de contrôler le niveau des logs effectivement écrits (dans la console).
 *
 * Exemple complet de logs
 *
 *  // ON LOGGE TOUT
 *  enableAllLogs();
 *  logTrace('trace');
 *  logDebug('debug');
 *  logInfo('info');
 *  logWarn('warn');
 *  logError('error');
 *
 *  // ON NE LOGGE RIEN
 *  disableAllLogs();
 *  logTrace('trace');
 *  logDebug('debug');
 *  logInfo('info');
 *  logWarn('warn');
 *  logError('error');
 *
 *  // ON LOGGE WARN ET ERROR SEULEMENT
 *  setLogLevel('WARN');
 *  logTrace('trace');
 *  logDebug('debug');
 *  logInfo('info');
 *  logWarn('warn');
 *  logError('error');
 *  }
 */

export type LEVEL = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'SILENT';

export function enableAllLogs(): void {
  log.enableAll();
}

export function disableAllLogs(): void {
  log.disableAll();
}

export function getLogLevel(): LEVEL {
  return log.getLevel();
}

export function setLogLevel(level: LEVEL): void {
  log.setLevel(level);
}

export function logTrace(message: any): void {
  log.trace(message);
}

export function logDebug(message: any): void {
  log.debug(message);
}

export function logInfo(message: any): void {
  log.info(message);
}

export function logWarn(message: any): void {
  log.warn(message);
}

export function logError(message: any): void {
  log.error(message);
}
