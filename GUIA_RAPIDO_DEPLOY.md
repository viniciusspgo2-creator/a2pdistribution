# Guia rápido — colocar o site A2P no ar

**Primeiro, confirme:** os ficheiros são um projeto Next.js. O ZIP **não é um site WordPress** e não deve ser enviado diretamente ao cPanel como um tema.

## Para obter uma pré-visualização na Vercel

1. Extraia o ficheiro ZIP no computador.
2. Crie um repositório novo no GitHub, por exemplo `a2p-food-distribution`.
3. Adicione ao repositório **todo o conteúdo da pasta** `a2p-food-distribution`.
4. Na Vercel, entre em **Add New → Project**, escolha o repositório e clique **Deploy**.
5. A Vercel apresentará um endereço de pré-visualização semelhante a `a2p-food-distribution.vercel.app`. A homepage pode ser visualizada em `/pt` mesmo sem banco de dados.

## Para ativar o admin e as funções completas

6. Ligue uma base **Neon Postgres** ao projeto, copiando a string para a variável `DATABASE_URL`.
7. Configure `ADMIN_EMAIL` com o seu email; crie `ADMIN_PASSWORD_HASH` e `SESSION_SECRET` como descrito no **README.md**.
8. Ative um serviço **Vercel Blob** no separador Storage, que disponibilizará `BLOB_READ_WRITE_TOKEN`.
9. Faça **Redeploy** e abra `/admin/login`. No painel, pode editar textos, idiomas, hero, artigos, SEO, media e consultar métricas e pedidos.
10. Apenas depois de testar, associe o domínio oficial e configure o Search Console.

## Antes de substituir o site existente

- Faça cópia de segurança do site antigo e confirme o plano de redirecionamentos 301.
- Substitua o PDF de catálogo de 2024 pelo catálogo atualizado.
- Confirme os detalhes da empresa, textos legais e as traduções.
- Teste o formulário de contacto, o download do catálogo, o menu móvel e o admin.

**Nota:** o ambiente onde o ZIP foi produzido não tinha acesso à instalação npm; deve executar `npm install && npm run build` num computador/CI com rede e corrigir eventuais incompatibilidades de versões antes da publicação de produção.
