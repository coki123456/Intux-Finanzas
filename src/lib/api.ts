export const URL_API = import.meta.env.VITE_API_URL || "";

function obtenerCabecerasAuth() {
  const token = localStorage.getItem("intux_pass");
  return token ? { "x-api-key": token } : {};
}

async function manejarRespuesta(respuesta: Response) {
  if (!respuesta.ok) {
    const error = await respuesta
      .json()
      .catch(() => ({ error: "Error desconocido" }));
    throw new Error(error.error || error.message || "Error en la petición");
  }
  if (respuesta.status === 204) return null;
  return respuesta.json();
}

export const api = {
  async obtenerGastos() {
    const respuesta = await fetch(`${URL_API}/api/expenses`, {
      headers: { ...obtenerCabecerasAuth() },
    });
    return manejarRespuesta(respuesta);
  },

  async crearGasto(gasto: any) {
    const respuesta = await fetch(`${URL_API}/api/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...obtenerCabecerasAuth() },
      body: JSON.stringify(gasto),
    });
    return manejarRespuesta(respuesta);
  },

  async actualizarGasto(id: string, gasto: any) {
    const respuesta = await fetch(`${URL_API}/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...obtenerCabecerasAuth() },
      body: JSON.stringify(gasto),
    });
    return manejarRespuesta(respuesta);
  },

  async eliminarGasto(id: string) {
    const respuesta = await fetch(`${URL_API}/api/expenses/${id}`, {
      method: "DELETE",
      headers: { ...obtenerCabecerasAuth() },
    });
    return manejarRespuesta(respuesta);
  },

  async obtenerConfiguracion() {
    const respuesta = await fetch(`${URL_API}/api/settings`, {
      headers: { ...obtenerCabecerasAuth() },
    });
    return manejarRespuesta(respuesta);
  },

  async actualizarConfiguracion(configuracion: any) {
    const configuracionDB = {
      partner_a_name: configuracion.nombreSocioA || configuracion.partner_a_name,
      partner_b_name: configuracion.nombreSocioB || configuracion.partner_b_name,
    };
    const respuesta = await fetch(`${URL_API}/api/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...obtenerCabecerasAuth() },
      body: JSON.stringify(configuracionDB),
    });
    return manejarRespuesta(respuesta);
  },
};
