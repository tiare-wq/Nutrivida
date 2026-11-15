export const RUT_LARGO_MAX = 12;

export function normalizarRut(valor) {
    return String(valor ?? '')
        .replace(/[.\-\s]/g, '')
        .toUpperCase();
}
