import {logDebug} from './logging';

/**
 * logge l'appel à la méthode annotée ainsi que les paramètres et le résultat si la méthode n'est pas void
 */
export function traced(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // keep a reference to the original function
  const originalValue = descriptor.value;
  const className = target.constructor.name;

  // Replace the original function with a wrapper
  descriptor.value = function (...args: any[]) {
    logDebug(`@traced => ${className}.${propertyKey}(${args.join(', ')})`);

    // Call the original function
    const result = originalValue.apply(this, args);

    if (result) {
      if (typeof(result)=='object') {
        logDebug(`@traced <= ${className}.${propertyKey}=${JSON.stringify(result)}`);
      } else {
        logDebug(`@traced <= ${result}`);
      }
    }
    return result;
  };
}
