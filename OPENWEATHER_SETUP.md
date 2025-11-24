# 🌤️ Configuração OpenWeather API

## 📋 Como obter sua API Key (Gratuita)

### Passo 1: Criar conta no OpenWeather

1. Acesse: https://openweathermap.org/api
2. Clique em **"Sign Up"** (canto superior direito)
3. Preencha:
   - Username
   - Email
   - Password
4. Aceite os termos e crie a conta
5. **Confirme seu email** (verifique a caixa de entrada)

### Passo 2: Obter API Key

1. Faça login em: https://home.openweathermap.org/
2. Vá para **"API keys"** no menu
3. Você verá uma chave padrão já criada, OU
4. Clique em **"Generate"** para criar uma nova
5. **Copie a API Key** (algo como: `abc123def456ghi789jkl`)

⚠️ **IMPORTANTE:** A API key pode levar alguns minutos (até 2 horas) para ser ativada após a criação!

### Passo 3: Configurar no projeto

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua `demo_key` pela sua API key:

```env
VITE_OPENWEATHER_API_KEY=SUA_API_KEY_AQUI
```

3. Salve o arquivo
4. **Reinicie o servidor** de desenvolvimento:

```bash
npm run dev
```

## 📊 Plano Gratuito

✅ **O que você tem de graça:**
- 1.000 chamadas por dia
- Previsão de 5 dias (perfeito para nosso uso)
- Atualização a cada 3 horas
- Mais que suficiente para o site!

## 🧪 Testando a integração

Após configurar a API key:

1. Acesse a landing page do site
2. Role até a seção **"Previsão do Tempo"**
3. Você verá:
   - ✅ Indicador verde **"Dados em tempo real via OpenWeather"** (funcionando!)
   - ⚠️ Mensagem de erro (se a key estiver incorreta ou inativa)

## ⚠️ Solução de Problemas

### Problema: "Erro ao carregar previsão"

**Possíveis causas:**
1. API key ainda não ativada (aguarde 10 minutos)
2. API key incorreta (verifique se copiou corretamente)
3. Limite de chamadas excedido (improvável no plano gratuito)

**Solução:**
- Verifique o arquivo `.env`
- Abra o console do navegador (F12) e veja os erros
- Aguarde alguns minutos se acabou de criar a conta

### Problema: Widget mostra dados genéricos

Isso é normal! Se não houver API key configurada (ou estiver como `demo_key`), o sistema usa dados de exemplo automaticamente. Nenhum erro é exibido ao usuário.

## 🔒 Segurança

✅ **Arquivo `.env` está no `.gitignore`** - Sua API key NÃO será enviada ao GitHub

⚠️ **NUNCA commit sua API key para o Git!**

## 📚 Documentação OpenWeather

- API Docs: https://openweathermap.org/forecast5
- Guia de início: https://openweathermap.org/guide
- FAQ: https://openweathermap.org/faq

## 🎯 Resumo Rápido

```bash
# 1. Criar conta
https://openweathermap.org/api

# 2. Copiar API key
https://home.openweathermap.org/api_keys

# 3. Colar no .env
VITE_OPENWEATHER_API_KEY=sua_chave_aqui

# 4. Reiniciar servidor
npm run dev
```

**Pronto! Seu widget de clima está usando dados reais! ☀️**
