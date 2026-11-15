export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch("/api" + path, {
      credentials: "same-origin",
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(
      "No se pudo conectar con NutriVida. Comprueba que el servidor esté encendido.",
    );
  }
  const result = await response
    .json()
    .catch(() => ({ error: "La respuesta del servidor no es válida." }));
  if (!response.ok)
    throw new Error(result.error || "No se pudo completar la operación.");
  return result;
}
