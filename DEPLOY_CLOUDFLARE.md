# 🚀 Deploy no Cloudflare Pages - Tranquilidade Boat

## ✅ Pré-requisitos Concluídos

- ✅ Projeto renomeado para "Tranquilidade Boat"
- ✅ Todos os links e referências atualizadas
- ✅ Build de produção criado
- ✅ Arquivo `wrangler.toml` configurado
- ✅ Tábua de marés atualizada até 31/12/2026

## 📦 Opção 1: Deploy via Wrangler CLI (Recomendado)

### 1. Instalar Wrangler (se não tiver)
```bash
npm install -g wrangler
```

### 2. Fazer login no Cloudflare
```bash
wrangler login
```

### 3. Deploy do projeto
```bash
cd /root/projetos/sites/traquilidade/apps/web
wrangler pages deploy dist --project-name=tranquilidade-boat
```

O projeto será publicado em: `https://tranquilidade-boat.pages.dev`

---

## 🌐 Opção 2: Deploy via Dashboard do Cloudflare

### Passo 1: Acessar Cloudflare Pages
1. Acesse https://dash.cloudflare.com
2. Vá em **Workers & Pages**
3. Clique em **Create application**
4. Selecione **Pages** → **Upload assets**

### Passo 2: Upload dos Arquivos
1. Nome do projeto: `tranquilidade-boat`
2. Arraste a pasta `/root/projetos/traquilidade/apps/web/dist`
3. Clique em **Deploy**

### Passo 3: Verificar Deploy
O site estará disponível em:
```
https://tranquilidade-boat.pages.dev
```

---

## 🔗 Opção 3: Deploy via Git (CI/CD Automático)

### 1. Criar repositório Git
```bash
cd /root/projetos/traquilidade
git init
git add .
git commit -m "Initial commit - Tranquilidade Jampa"
```

### 2. Enviar para GitHub
```bash
git remote add origin https://github.com/SEU_USUARIO/tranquilidade-boat.git
git push -u origin main
```

### 3. Conectar ao Cloudflare Pages
1. No Cloudflare Dashboard, vá em **Workers & Pages**
2. Clique em **Create application** → **Pages** → **Connect to Git**
3. Selecione seu repositório GitHub
4. Configure:
   - **Project name:** tranquilidade-boat
   - **Production branch:** main
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `apps/web`

5. Clique em **Save and Deploy**

Agora, a cada push no GitHub, o Cloudflare fará o deploy automaticamente!

---

## ⚙️ Configurações Adicionais

### Custom Domain (Opcional)
Se você tiver um domínio próprio:

1. No Cloudflare Pages, vá em **Custom domains**
2. Clique em **Set up a custom domain**
3. Digite: `tranquilidadeboat.com.br` (ou seu domínio)
4. Siga as instruções para configurar DNS

### Variáveis de Ambiente
Se precisar configurar variáveis de ambiente:

1. No Cloudflare Pages, vá em **Settings** → **Environment variables**
2. Adicione:
   - `VITE_API_URL` = URL da sua API (ex: `http://95.217.158.112:3001/api`)

---

## 📊 Verificar Build Atual

Os arquivos já foram gerados em:
```
/root/projetos/traquilidade/apps/web/dist/
```

Arquivos gerados:
- ✅ `index.html` (1.85 kB)
- ✅ `assets/index-DOT4e-pA.css` (75.56 kB)
- ✅ `assets/index-DkFaLHNa.js` (619.31 kB)
- ✅ Arquivos de mock (weather, tides)

---

## 🧪 Testar Localmente

Para testar o build local antes do deploy:
```bash
cd /root/projetos/traquilidade/apps/web
npm run preview
```

O site estará disponível em `http://localhost:4173`

---

## 🔄 Atualizar Deploy

Para fazer um novo deploy após mudanças:
```bash
cd /root/projetos/traquilidade/apps/web
npm run build
wrangler pages deploy dist --project-name=tranquilidade-boat
```

---

## 📝 URLs Importantes

**Desenvolvimento:**
- Local: http://localhost:8082
- API: http://localhost:3001/api

**Produção (após deploy):**
- Site: https://tranquilidade-boat.pages.dev
- API: Configurar em variáveis de ambiente

---

## ✅ Checklist de Deploy

- [x] Projeto renomeado
- [x] Build criado
- [x] Wrangler configurado
- [ ] Login no Cloudflare
- [ ] Deploy executado
- [ ] URL testada
- [ ] Custom domain configurado (opcional)
- [ ] Variáveis de ambiente configuradas

---

## 🆘 Troubleshooting

### Erro: "Wrangler not found"
```bash
npm install -g wrangler
```

### Erro: "Not logged in"
```bash
wrangler login
```

### Build não atualiza
```bash
rm -rf dist
npm run build
```

### Cloudflare não encontra arquivos
Certifique-se de que está fazendo deploy da pasta `dist/` e não da raiz do projeto.

---

**Última atualização:** 25/11/2024 02:25 AM
**Status:** Pronto para deploy 🚀
