# Revisão visual A2P — 28/10/2026

## Implementado

- Reconstrução dos logos do cabeçalho e rodapé a partir dos ficheiros originais enviados, com recorte transparente e proporções equilibradas.
- Slideshow automático de 4 imagens gastronómicas originais: queijos, vinhos, enchidos/especiarias e azeites, sem camiões, com imagens editáveis no painel admin. Controles de anterior/próximo, indicadores e suporte a movimento reduzido.
- Cards dos seis setores agora abrem páginas reais em `/{idioma}/setores/{slug}`, com conteúdo, vantagens e contato. O comportamento de expansão ao passar o rato continua.
- Composição do catálogo substituída por layout editorial de duas colunas e fotografia, sem máscara com degradê.
- Mantidas as funcionalidades do blog, idiomas, API, SEO e admin.

## Deploy

Substitua no GitHub os ficheiros do projeto pelos desta versão, mantendo as variáveis de ambiente configuradas na Vercel. Não sobrescreva o ficheiro `.env.local` se tiver criado um no seu computador.

Nota: o projeto não foi compilado neste ambiente porque a instalação das dependências npm expirou. Verifique o resultado no deploy de pré-visualização antes de promover ao domínio oficial.

- A imagem anterior do camião foi também removida da pré-visualização social e do CTA inferior.
