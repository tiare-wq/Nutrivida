const MILISEGUNDOS_DIA = 24 * 60 * 60 * 1000;

export function progresoPlan(fechaCompra, duracionMeses, ahora = new Date()) {
  if (!Number.isInteger(duracionMeses) || duracionMeses < 1) return null;

  const inicio = new Date(fechaCompra);
  if (Number.isNaN(inicio.getTime()) || inicio > ahora) return null;

  const fin = new Date(inicio);
  fin.setMonth(fin.getMonth() + duracionMeses);
  if (fin <= ahora) return null;

  const total = Math.round((fin - inicio) / MILISEGUNDOS_DIA);
  const transcurridos = Math.min(
    total,
    Math.floor((ahora - inicio) / MILISEGUNDOS_DIA),
  );
  return {
    total,
    transcurridos,
    restantes: total - transcurridos,
  };
}
