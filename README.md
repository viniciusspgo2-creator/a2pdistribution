# A2P Food Distribution — Site Institucional

Projeto real em **Next.js 16 + React 19 + TypeScript** com identidade azul, laranja e branco. O site foi concebido para a distribuição profissional de produtos alimentares portugueses na Suíça. As imagens e os logótipos fornecidos foram integrados, bem como uma nova ilustração fotográfica gerada para a hero.

## O que está implementado

- Homepage corporativa responsiva com hero cinematográfica, secções claras/escuras alternadas, cartão de confiança, história, **cartões de setores que expandem com hover/toque**, produtos, catálogo, benefícios, etapas, FAQ, blog e contacto.
- Cinco idiomas: **Português de Portugal (principal)**, espanhol, alemão, francês e inglês, em `/pt`, `/es`, `/de`, `/fr` e `/en`.
- **10 artigos originais** com versões nos cinco idiomas, páginas de artigo e metadados SEO individuais. Os textos estão num ficheiro inicial e podem ser editados no painel quando houver base de dados.
- **Admin `/admin`**: login seguro via password com hash bcrypt, cookie assinado de oito horas, autenticação nas APIs, proteção por origem, limite de tentativas de login por período, gestão de traduções, catálogo, hero, SEO, artigos, media, contactos e métricas.
- **Armazenamento persistente**: Neon PostgreSQL (conteúdos, artigos, leads, métricas, media) e Vercel Blob (uploads de imagens e PDF).
- SEO/GEO técnico: metadados, Open Graph, URLs canónicas, `hreflang`, JSON-LD de organização/artigos/FAQ, `sitemap.xml`, `robots.txt`, `llms.txt`, verificação do Google Search Console no painel.
- Contadores de visualizações, cliques de contacto, catálogo e redes, agregados por dia e página, **sem cookies publicitários ou identificação de utilizadores**. Não é possível medir visitantes únicos de forma fidedigna com esta abordagem.
- Formulário de contactos guardado no banco de dados, verificação de consentimento, campo anti-spam e limite de pedidos por email.

## ATENÇÃO: configuração necessária para produção

O código e os conteúdos estão criados, **mas não existe um deploy, acesso ao painel ou base de dados funcional sem configurar as credenciais**. Os uploads funcionam somente após ativar Vercel Blob. A submissão do formulário grava pedidos no Neon; **não envia emails automaticamente**. As imagens de categorias referenciadas pelo Unsplash dependem de disponibilidade externa e devem ser revistas quanto à adequação/licenciamento antes da publicação comercial.

### Passo 1 — Crie o projeto na Vercel

1. Extraia o ZIP num computador.
2. Crie um repositório GitHub com os ficheiros **dentro da pasta do projeto**, não uma pasta com outra pasta dentro.
3. No painel Vercel clique **Add New → Project**, escolha o repositório e **Import**.
4. A configuração deve reconhecer automaticamente **Next.js**. Não altere os scripts de build.

### Passo 2 — Base de dados Neon

1. Na Vercel abra o projeto, **Storage → Connect Database → Neon**, ou crie uma base diretamente no Neon.
2. Copie a string de conexão PostgreSQL (incluindo SSL) como `DATABASE_URL` em **Project → Settings → Environment Variables**.
3. Não coloque a string de conexão em nenhum ficheiro do GitHub. A aplicação cria automaticamente as tabelas na primeira operação; em ambiente de manutenção pode executar `npm run setup:db` com a variável configurada.

### Passo 3 — Criar acesso de administrador

1. Num computador com Node.js, dentro da pasta do projeto, execute `npm install`.
2. Escolha uma palavra-passe longa e execute:

   `npm run hash:password -- "A-SUA-PALAVRA-PASSE-COM-MAIS-DE-12-CARACTERES"`

3. Copie **o hash gerado**, não a palavra-passe, para `ADMIN_PASSWORD_HASH` na Vercel.
4. Configure `ADMIN_EMAIL` como o seu endereço de email de administração.
5. Crie um segredo único de pelo menos 32 caracteres para `SESSION_SECRET` (por exemplo com `openssl rand -base64 48`).
6. Faça **Redeploy**, abra `https://SEU-DOMINIO/admin/login` e autentique-se com o email e a palavra-passe que escolheu.

O website **não** vem com utilizador ou palavra-passe padrão.

### Passo 4 — Banners/imagens e PDFs

1. Na Vercel abra **Storage → Create Database → Blob** (o nome do menu pode variar).
2. Associe o Blob ao projeto e confirme que `BLOB_READ_WRITE_TOKEN` aparece nas variáveis de ambiente.
3. Faça novo deploy e carregue imagens/PDF no separador **Banners e media** do admin.
4. Copie a URL do ficheiro e coloque-a em **SEO e Search Console → Imagem da hero** ou **URL do catálogo**. Salve.
5. O catálogo inicialmente aponta para o **PDF de 2024 publicado no site original**, que pode estar desatualizado. Substitua pela edição mais recente **antes do lançamento**.

### Passo 5 — Domínio e Google Search Console

1. Configure `SITE_URL` com o domínio final, por exemplo `https://a2pdistribution.com`.
2. Na Vercel abra **Settings → Domains** e associe o domínio, *apenas quando estiver pronto para substituir o site anterior*.
3. Faça backup do WordPress/site atual, incluindo eventuais URLs existentes. Configure redirecionamentos 301 apropriados para as páginas antigas que forem substituídas, para minimizar a perda de SEO.
4. No Search Console escolha a propriedade do domínio. Em **Verificação → etiqueta HTML**, copie apenas o **valor** do atributo `content` para o painel administrativo no campo **Google Search Console**.
5. Faça a verificação e envie `https://a2pdistribution.com/sitemap.xml`.
6. Revise as URLs canónicas, contactos, logo e conteúdos antes da indexação. SEO/GEO técnico **não garante posicionamento** nem inclusão em resultados de IA.

### Passo 6 — Revisão comercial e legal

- Confirme morada, contactos, emails, horário, condições de entrega e cobertura da empresa. Atualmente, os contactos foram baseados em fontes públicas e nos materiais enviados.
- Atualize o PDF do catálogo. Não foram inventadas marcas, classificações, avaliações, números de clientes, unidades de produto ou promessas de entrega.
- Faça uma revisão jurídica da Política de Privacidade e obrigações locais (LPD suíça e eventual RGPD europeu, conforme aplicável).
- Configure backups do Neon e processo de resposta aos contactos (no painel, menu **Pedidos recebidos**). O projeto não envia email automático; pode ser integrado futuramente com um serviço de correio.
- Confirme que imagens de terceiros usadas em categorias são apropriadas para uso comercial e substitua-as quando necessário.

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local
# Edite .env.local e configure as variáveis reais
npm run dev
# http://localhost:3000/pt
npm run typecheck
npm run build
```

Se não configurar o banco de dados, **as páginas públicas e os 10 artigos iniciais funcionam em modo de demonstração**; o formulário, as métricas persistentes e o admin não funcionam completamente. Configure o Neon para operar em produção.

## Referências públicas de UI no GitHub

- **Motion for React**, MIT: https://github.com/motiondivision/motion — utilizado nos efeitos de entrada por scroll e microinterações.
- **Magic UI**, MIT: https://github.com/magicuidesign/magicui — pesquisado como referência de tendências, sem importar componentes que exijam licença comercial ou copiar um template. A expansão dos cartões foi implementada em CSS original com acessibilidade para toque.

## Estrutura de dados e segurança

- `/src/lib/i18n.ts`: textos base dos cinco idiomas.
- `/src/lib/posts.ts`: os 10 artigos iniciais.
- `/src/lib/db.ts`: tabelas e persistência PostgreSQL.
- `/src/lib/auth.ts`: gestão de sessão JWT assinada (cookie HttpOnly), origem de operações.
- `/src/app/api/admin/...`: APIs do painel com autenticação.
- `/src/app/api/contact/route.ts`: captação B2B com consentimento e validação.
- `/src/app/api/track/route.ts`: métricas agregadas, sem perfil individual.
- `/src/app/[locale]`: páginas e SEO por idioma.
- `/src/components/Home.tsx`: secções da homepage.
- `/src/components/AdminDashboard.tsx`: painel de administração.

O acesso ao admin foi pensado para um proprietário. Para múltiplos funcionários, auditoria de alterações, MFA e permissões granularizadas, será necessário implementar uma solução de identidade empresarial.

## Observações

Este pacote foi gerado sem instalar dependências externas no ambiente de criação (rede npm indisponível). Os ficheiros TS/TSX foram analisados sintaticamente, mas **o build de produção precisa de ser validado com `npm install && npm run build`** num ambiente com acesso ao npm antes de o site entrar no ar.
