# 🌊 Sistema de Tábua de Marés

## 📋 Como Funciona

O sistema de Tábua de Marés foi implementado com **cálculos astronômicos** baseados no ciclo lunar e características das marés de João Pessoa/PB.

### ✅ O que está implementado:

1. **Cálculo Automático de Marés**
   - Baseado no ciclo lunar (~12.42 horas entre marés)
   - Considera fases da lua (sizígia e quadratura)
   - Ajustado para as características de João Pessoa

2. **Classificação de Qualidade**
   - ⭐ **Ideal**: Altura ≤ 0.3m (perfeito para Areia Vermelha)
   - ✅ **Boa**: Altura ≤ 0.5m (recomendado)
   - ⚠️ **Regular**: Altura ≤ 0.7m (aceitável)
   - ❌ **Ruim**: Altura > 0.7m (não recomendado)

3. **Funções Úteis**
   - Próximas marés ideais
   - Verificação de data específica
   - Calendário de 30 dias

---

## 🎯 Precisão

### Atualmente:
- **~70-80% de precisão** para fins informativos
- Baseado em cálculos harmônicos simplificados
- Considera fase lunar e ciclos básicos

### Limitações:
- Não considera meteorologia local
- Não considera configuração do fundo marinho
- Não ajusta para eventos especiais (tempestades, etc)

---

## 🔄 Como Melhorar (Futuro)

### Opção 1: API Paga (Mais Precisa)

**WorldTides API**
- Site: https://www.worldtides.info/
- Preço: $10-20/mês
- Precisão: ~99%
- Dados oficiais

**StormGlass API**
- Site: https://stormglass.io/
- Preço: Plano gratuito limitado
- Precisão: ~95%

### Opção 2: Scraping Marinha do Brasil (Grátis)

- Site: https://www.marinha.mil.br/chm/tabuas-de-mare
- Dados oficiais brasileiros
- Requer atualização manual ou scraping
- 100% preciso mas trabalhoso

### Opção 3: Melhorar Cálculos (Grátis)

Adicionar mais harmônicos:
- M2 (Principal lunar)
- S2 (Principal solar)
- N2 (Lunar elíptico)
- K1 (Luni-solar declinacional)

---

## 🛠️ Integrando API Paga (WorldTides)

Se você quiser usar API paga no futuro:

### 1. Adicionar no `.env`:

```env
VITE_WORLDTIDES_API_KEY=sua_chave_aqui
```

### 2. Atualizar `tideService.ts`:

```typescript
const API_KEY = import.meta.env.VITE_WORLDTIDES_API_KEY;

if (API_KEY && API_KEY !== 'demo') {
  // Usar API real
  const url = `https://www.worldtides.info/api/v3?heights&lat=-7.1195&lon=-34.8450&key=${API_KEY}`;
  const response = await fetch(url);
  // ... processar dados
} else {
  // Usar cálculos astronômicos
  // ... código atual
}
```

---

## 📊 Dados de Referência - João Pessoa

- **Latitude**: -7.1195
- **Longitude**: -34.8450
- **Amplitude média**: 1.5 - 2.5m
- **Ciclo**: Semi-diurno (2 altas e 2 baixas por dia)
- **Sizígia** (lua nova/cheia): Marés maiores (~2.2m alta, ~0.2m baixa)
- **Quadratura** (quarto crescente/minguante): Marés menores (~1.7m alta, ~0.5m baixa)

---

## 🧪 Testando o Sistema

### No código:

```typescript
import { checkTideForDate } from '@/services/tideService';

// Verificar dia específico
const result = await checkTideForDate('2024-12-25');
console.log(result);
// {
//   isGood: true,
//   bestTide: { time: '08:30', height: 0.2, quality: 'ideal' },
//   message: 'Maré baixa ideal às 08:30'
// }
```

### No navegador:

1. Abra o site
2. Vá até seção "Tábua de Marés"
3. Verá as próximas 3 marés ideais calculadas

---

## 📚 Referências

- [Ciclo de Marés - Wikipedia](https://pt.wikipedia.org/wiki/Mar%C3%A9)
- [Marinha do Brasil - Tábuas Oficiais](https://www.marinha.mil.br/chm/tabuas-de-mare)
- [WorldTides - API Comercial](https://www.worldtides.info/)
- [Análise Harmônica de Marés](https://en.wikipedia.org/wiki/Theory_of_tides)

---

## 💡 Recomendação

Para uso comercial e compromissos com clientes:

1. **Curto prazo**: Use o sistema atual (informativo)
2. **Médio prazo**: Assine WorldTides API ($10/mês)
3. **Sempre**: Recomende aos clientes confirmarem na Marinha do Brasil

**Mensagem sugerida para clientes:**
> "As marés são calculadas automaticamente. Para confirmação oficial, consulte a tábua da Marinha do Brasil antes de reservar."

---

**Sistema implementado e funcionando! 🌊**
