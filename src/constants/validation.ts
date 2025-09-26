export const PHONE_ERROR_MESSAGE = "Ingrese un número de teléfono válido.";
export const CODE_ERROR_MESSAGE = "El código debe tener entre 5 y 8 dígitos.";

export const CODE_DIGITS = 8;
export const CODE_MIN_DIGITS = 5;
export const PHONE_DIGITS = 8;

export const LETTERS_REGEX = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const PHONE_REGEX = new RegExp(`^\\d{${PHONE_DIGITS}}$`);
export const CODE_REGEX = new RegExp(`^\\d{${CODE_MIN_DIGITS},${CODE_DIGITS}}$`);
