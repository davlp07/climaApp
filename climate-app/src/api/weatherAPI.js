


export async function weatherLocation(apiKey, cityName) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar localização: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error(`Nenhuma localização encontrada para a cidade: ${cityName}`);
    }

    return data[0]; 
  } catch (error) {
    console.error("Erro na função weatherLocation:", error.message);
    return null; 
  }
}

export async function weatherInfos(latitude, longitude) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=pt_br&units=metric&exclude=alerts&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar informações do clima: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.main || !data.weather) {
      throw new Error("Dados climáticos incompletos retornados pela API.");
    }

    return data;
  } catch (error) {
    console.error("Erro na função weatherInfos:", error.message);
    return null; 
  }
}


