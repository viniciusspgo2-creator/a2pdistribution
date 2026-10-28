# Correção TypeScript — TS1355 (sitemap)

- `src/app/sitemap.ts`: removida a asserção `as const` sobre uma expressão condicional, rejeitada pelo TypeScript com TS1355. Cada entrada do sitemap é agora tipada com `MetadataRoute.Sitemap[number]` e a propriedade `changeFrequency` recebe o tipo apropriado por contexto.
- `tsconfig.json`: adicionada a entrada `.next/dev/types/**/*.ts` recomendada pelo Next.js 16.

**Como aplicar:** substituir os ficheiros do projeto com os conteúdos deste ZIP, mantendo as variáveis de ambiente configuradas na Vercel; fazer commit e novo deploy.

**Validação:** patch de código revisto; o `npm run build` completo não foi executado neste ambiente por falta de acesso às dependências via npm. Se aparecer outro erro no build, enviar a mensagem exata.
