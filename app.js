let mapa = null; document.getElementById('search-btn').addEventListener('click', async () => {
  const city = document.getElementById('city-input').value.trim();
  const weatherCard = document.getElementById('weather-card');

  if (!city) {
    weatherCard.innerHTML =
      "<p style='color: #fee2e2;'>⚠️ Por favor, escribe un lugar válido.</p>";
    return;
  }
if (mapa) {
  mapa.remove();
  mapa = null;
}
  weatherCard.innerHTML = "<p>🔄 Consultando ubicación...</p>";

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`
    );

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      weatherCard.innerHTML =
        "<p style='color: #fee2e2;'>❌ No se encontraron datos para esa ubicación.</p>";
      return;
    }

    const lugar = data[0];

    let temp, humidity, condition;

    // Estos datos son simulados, no provienen de una API del clima.
    if (city.toLowerCase() === 'lerma') {
      temp = '27.4';
      humidity = '91';
      condition = 'Tormenta meteorológica';
    } else {
      temp = (Math.random() * 30 + 5).toFixed(1);
      humidity = Math.floor(Math.random() * 60 + 40);

      const conditions = [
        'Despejado',
        'Nublado',
        'Lluvia ligera',
        'Tormenta eléctrica'
      ];

      condition = conditions[
        Math.floor(Math.random() * conditions.length)
      ];
    }

    // Insertamos primero una estructura fija.
    weatherCard.innerHTML = `
      <h3>🗺️ Ubicación localizada: <span class="city"></span></h3>

      <p class="description">
        <strong>Descripción oficial:</strong>
        <span class="place"></span>
      </p>

      <div class="geo-data">
        <p>
          <strong>Latitud:</strong> <span class="latitude"></span>
          |
          <strong>Longitud:</strong> <span class="longitude"></span>
        </p>
      </div>
      <div class="geo-data">
  <p>
    <strong>Latitud:</strong> <span class="latitude"></span>
    |
    <strong>Longitud:</strong> <span class="longitude"></span>
  </p>
</div>

<!-- Aquí aparecerá el mapa -->
<div id="map"></div>

<hr style="border: 0.5px solid #4ade80; margin: 15px 0;">

      <hr style="border: 0.5px solid #4ade80; margin: 15px 0;">

      <div class="weather-data">
        <h4>🌤️ Parámetros climatológicos — simulación</h4>
        <p><strong>Temperatura:</strong> <span class="temp"></span> °C</p>
        <p><strong>Humedad:</strong> <span class="humidity"></span>%</p>
        <p><strong>Condición:</strong> <span class="condition"></span></p>
      </div>

      <div class="success-footer">
        ✓ Ubicación consultada. Los datos del clima son de ejemplo.
      </div>
    `;

    // textContent permite mostrar texto sin interpretarlo como HTML.
    weatherCard.querySelector('.city').textContent = city;
    weatherCard.querySelector('.place').textContent = lugar.display_name;
    weatherCard.querySelector('.latitude').textContent = lugar.lat;
    weatherCard.querySelector('.longitude').textContent = lugar.lon;
    weatherCard.querySelector('.temp').textContent = temp;
    weatherCard.querySelector('.humidity').textContent = humidity;
    weatherCard.querySelector('.condition').textContent = condition;
const latitud = Number(lugar.lat);
const longitud = Number(lugar.lon);

// Crear el mapa en el contenedor.
mapa = L.map('map').setView([latitud, longitud], 13);

// Mostrar el mapa de OpenStreetMap.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">' +
    'OpenStreetMap</a> contributors'
}).addTo(mapa);

// Ajustar el encuadre al tamaño del lugar.
// Para España mostrará un territorio amplio;
// para una ciudad mostrará una zona más cercana.
if (lugar.boundingbox) {
  const [sur, norte, oeste, este] = lugar.boundingbox.map(Number);

  mapa.fitBounds(
    [[sur, oeste], [norte, este]],
    { padding: [20, 20], maxZoom: 15 }
  );
}

// Crear un marcador con el nombre de la ubicación.
const etiqueta = document.createElement('div');
etiqueta.textContent = lugar.display_name;

L.marker([latitud, longitud])
  .addTo(mapa)
  .bindPopup(etiqueta);

// Actualizar las dimensiones cuando termine de dibujarse la tarjeta.
requestAnimationFrame(() => {
  if (mapa) {
    mapa.invalidateSize();
  }
});
  } catch (error) {
    console.error(error);

    weatherCard.innerHTML =
      "<p style='color: #fee2e2;'>❌ No se pudo consultar la ubicación. Revisa tu conexión e intenta nuevamente.</p>";
  }
});