// Script de teste da API do OpenWeather
const API_KEY = 'b402c30cf2313c6523b56bd8911c65a6';
const LAT = '-7.1195';
const LON = '-34.8450';

const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=pt_br&cnt=7`;

console.log('🌤️  Testando OpenWeather API...\n');
console.log('📍 Local: João Pessoa/PB');
console.log('🔑 API Key:', API_KEY.substring(0, 10) + '...\n');

fetch(url)
  .then(response => {
    console.log('📡 Status:', response.status, response.statusText);
    return response.json();
  })
  .then(data => {
    if (data.cod === '401') {
      console.log('\n❌ ERRO: API key inválida ou inativa');
      console.log('⏳ Aguarde alguns minutos e tente novamente');
      console.log('💡 APIs keys novas podem levar até 2 horas para ativar\n');
      console.log('🔄 Enquanto isso, o site usará dados mockados automaticamente');
      return;
    }

    if (data.cod === '200') {
      console.log('\n✅ SUCESSO! API funcionando!\n');
      console.log('📊 Dados recebidos:');
      console.log(`   Cidade: ${data.city.name}, ${data.city.country}`);
      console.log(`   Previsões: ${data.list.length} períodos`);

      const first = data.list[0];
      console.log(`\n🌡️  Agora em João Pessoa:`);
      console.log(`   Temperatura: ${Math.round(first.main.temp)}°C`);
      console.log(`   Condição: ${first.weather[0].description}`);
      console.log(`   Vento: ${Math.round(first.wind.speed * 3.6)} km/h`);
      console.log(`   Chuva: ${Math.round(first.pop * 100)}%`);

      console.log('\n🎉 Integração configurada com sucesso!');
    }
  })
  .catch(error => {
    console.log('\n❌ Erro na requisição:', error.message);
  });
