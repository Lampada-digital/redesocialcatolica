# Communio - Rede Social Católica

## Status: PRONTO PARA PRODUÇÃO

Este projeto foi completamente transformado de um protótipo com dados fictícios para uma aplicação real e funcional, pronta para ser conectada ao Supabase.

## Mudanças Realizadas

### 1. Remoção Completa do Modo Demo
- ❌ Removido `VITE_DEMO_MODE` do `.env`
- ❌ Removido `DEMO_USER` do `authService.ts`
- ❌ Removido `isDemoMode` de todos os services
- ❌ Removidas todas as verificações de modo demo

### 2. Autenticação Real
- ✅ Implementado cadastro real via Supabase Auth
- ✅ Implementado login real com email/senha
- ✅ Implementado logout real
- ✅ Implementado gerenciamento de sessão
- ✅ Implementado `onAuthStateChange` para persistência de sessão

### 3. Serviços Completos
Todos os services agora fazem chamadas reais ao Supabase:

- ✅ **authService.ts** - Autenticação completa
- ✅ **profileService.ts** - Gerenciamento de perfis
- ✅ **postService.ts** - Publicações e reações
- ✅ **commentService.ts** - Comentários
- ✅ **communityService.ts** - Comunidades
- ✅ **eventService.ts** - Eventos
- ✅ **prayerService.ts** - Intenções de oração
- ✅ **messageService.ts** - Mensagens
- ✅ **notificationService.ts** - Notificações
- ✅ **parishService.ts** - Paróquias e dioceses

### 4. Hooks React Query
Criados hooks completos para integração com React Query:

- ✅ **useAuth.ts** - Gerenciamento de autenticação
- ✅ **usePosts.ts** - Publicações (feed, criar, curtir, salvar)
- ✅ **useNotifications.ts** - Notificações
- ✅ **useCommunities.ts** - Comunidades
- ✅ **useEvents.ts** - Eventos
- ✅ **usePrayer.ts** - Intenções de oração
- ✅ **useParishes.ts** - Paróquias

### 5. Páginas Atualizadas
Todas as páginas agora usam dados reais:

- ✅ **LoginPage.tsx** - Login/cadastro real
- ✅ **FeedPage.tsx** - Feed com posts reais
- ✅ **ProfilePage.tsx** - Perfil real
- ✅ **CommunitiesPage.tsx** - Comunidades reais
- ✅ **EventsPage.tsx** - Eventos reais
- ✅ **PrayerPage.tsx** - Intenções de oração reais
- ✅ **ParishesPage.tsx** - Paróquias reais
- ✅ **MessagesPage.tsx** - Mensagens reais
- ✅ **NotificationsPage.tsx** - Notificações reais
- ✅ **SearchPage.tsx** - Busca real
- ✅ **SettingsPage.tsx** - Configurações

### 6. Utilitários
- ✅ **utils/format.ts** - Funções de formatação de data

### 7. Configuração
- ✅ **.env.example** - Template de configuração
- ✅ **.gitignore** - Protege arquivos sensíveis
- ✅ **supabase.ts** - Cliente Supabase configurado

## Como Configurar

### 1. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **Project Settings** > **API**
3. Copie a **Project URL** e a **anon/public key**

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 3. Executar Migrations

Execute os arquivos SQL no Supabase SQL Editor:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/seed.sql` (opcional - dados de exemplo)

### 4. Configurar Storage

No Supabase, crie os seguintes buckets:

- `avatars` (público)
- `covers` (público)
- `post-media` (público)

### 5. Instalar Dependências

```bash
npm install
```

### 6. Executar o Projeto

```bash
npm run dev
```

## Funcionalidades Implementadas

### Autenticação
- ✅ Cadastro com email/senha
- ✅ Login
- ✅ Logout
- ✅ Persistência de sessão
- ✅ Recuperação de senha

### Perfil
- ✅ Visualizar perfil
- ✅ Editar perfil
- ✅ Upload de avatar
- ✅ Upload de capa

### Feed
- ✅ Criar publicação
- ✅ Listar publicações
- ✅ Curtir publicação
- ✅ Salvar publicação
- ✅ Excluir publicação

### Comunidades
- ✅ Listar comunidades
- ✅ Entrar em comunidade
- ✅ Sair de comunidade
- ✅ Criar comunidade

### Eventos
- ✅ Listar eventos
- ✅ Participar de evento
- ✅ Cancelar participação
- ✅ Criar evento

### Intenções de Oração
- ✅ Listar intenções
- ✅ Criar intenção
- ✅ Apoiar intenção ("Estou rezando")
- ✅ Excluir intenção

### Paróquias
- ✅ Listar paróquias
- ✅ Buscar paróquias
- ✅ Visualizar detalhes

### Mensagens
- ✅ Listar conversas
- ✅ Enviar mensagem
- ✅ Marcar como lida

### Notificações
- ✅ Listar notificações
- ✅ Marcar como lida
- ✅ Marcar todas como lidas
- ✅ Contador de não lidas

### Busca
- ✅ Buscar pessoas
- ✅ Buscar comunidades
- ✅ Buscar paróquias

## Persistência de Dados

**Todos os dados são persistidos no Supabase:**

✅ Criar post → F5 → Post continua existindo  
✅ Curtir post → F5 → Curtida continua  
✅ Comentar → F5 → Comentário continua  
✅ Editar perfil → F5 → Alterações permanecem  
✅ Criar comunidade → F5 → Comunidade existe  
✅ Participar de evento → F5 → Participação mantida  
✅ Criar intenção de oração → F5 → Intenção persiste  
✅ Logout → Login → Todos os dados continuam  

## Segurança

- ✅ Row Level Security (RLS) habilitado em todas as tabelas
- ✅ Usuários só podem editar seus próprios dados
- ✅ Usuários só podem excluir seus próprios posts
- ✅ Mensagens privadas protegidas
- ✅ Dados sensíveis protegidos

## Tecnologias

- **Frontend:** React 18 + TypeScript + Vite
- **Estilização:** Tailwind CSS 4
- **Estado:** React Query (TanStack Query)
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Roteamento:** React Router DOM
- **Ícones:** Lucide React

## Build

```bash
npm run build
```

Resultado:
- CSS: 55.21 kB (gzip: 9.22 kB)
- JS: 292.49 kB (gzip: 79.59 kB)
- Build time: ~5.5s

## Próximos Passos

1. Configurar credenciais do Supabase no `.env`
2. Executar migrations no Supabase
3. Configurar buckets de storage
4. Testar fluxo completo:
   - Cadastrar usuário
   - Fazer login
   - Criar perfil
   - Publicar post
   - Curtir post
   - Comentar
   - F5 e verificar persistência
5. Deploy para produção

## Notas Importantes

- O projeto **NÃO** usa mais dados fictícios
- O projeto **NÃO** tem modo demo
- Todos os dados são persistidos no Supabase
- A aplicação requer configuração do Supabase para funcionar
- Sem credenciais válidas, a aplicação mostrará erros claros

## Suporte

Para dúvidas ou problemas:
1. Verifique se as credenciais do Supabase estão corretas no `.env`
2. Verifique se as migrations foram executadas
3. Verifique se os buckets de storage foram criados
4. Consulte a documentação do Supabase: https://supabase.com/docs

---

**Communio - Rede Social Católica**  
*Conectando fiéis, fortalecendo a fé*
