// Script simples para testar cálculo de marés
console.log('🌊 Testando Cálculo de Marés para João Pessoa\n');

// Simula o cálculo básico
const calculateTideForDay = (dayNum) => {
  const lunarCycle = 12.42;
  const firstHighTide = 3.5 + (dayNum * 0.84) % lunarCycle;
  const firstLowTide = firstHighTide + 6.21;

  const lunarMonth = 29.53;
  const lunarPhase = (dayNum % lunarMonth) / lunarMonth;
  const isSpringTide = lunarPhase < 0.25 || (lunarPhase > 0.45 && lunarPhase < 0.55) || lunarPhase > 0.75;

  const lowTideHeight = isSpringTide ? 0.2 : 0.5;

  const formatTime = (decimal) => {
    const hour = Math.floor(decimal) % 24;
    const minute = Math.round((decimal % 1) * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const quality = lowTideHeight <= 0.3 ? '⭐ Ideal' : lowTideHeight <= 0.5 ? '✅ Boa' : '⚠️ Regular';

  return {
    lowTide: formatTime(firstLowTide),
    height: lowTideHeight.toFixed(1),
    quality,
    isSpring: isSpringTide ? 'Sizígia (lua nova/cheia)' : 'Quadratura'
  };
};

console.log('📅 Próximos 7 dias:\n');

const today = new Date();
for (let i = 0; i < 7; i++) {
  const date = new Date(today);
  date.setDate(today.getDate() + i);

  const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
  const tide = calculateTideForDay(date.getDate());

  console.log(`${dayName} - Maré baixa: ${tide.lowTide} (${tide.height}m) ${tide.quality}`);
  console.log(`           Fase: ${tide.isSpring}\n`);
}

console.log('✅ Cálculos baseados em ciclos astronômicos');
console.log('💡 Para dados oficiais, consulte: https://www.marinha.mil.br/chm/tabuas-de-mare\n');
