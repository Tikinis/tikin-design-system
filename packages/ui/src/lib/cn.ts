import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Une clases condicionales y resuelve conflictos de Tailwind quedandose con la
 * ultima. Es lo que permite que un consumidor sobreescriba estilos por prop:
 *
 *     <Button className="rounded-none" />   // gana sobre el rounded-lg del size
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
