# Communio — Rede Social Católica

Rede social católica moderna, segura e profissional que conecta fiéis, paróquias, dioceses e comunidades.

## 🚀 Status do Projeto

**VERSÃO 2.0 — TRANSFORMAÇÃO EM ANDAMENTO**

O projeto foi transformado de um protótipo visual para uma aplicação real com:

- ✅ Autenticação real via Supabase Auth
- ✅ Banco de dados PostgreSQL com RLS
- ✅ Services reais para todas as funcionalidades
- ✅ Migrations SQL completas
- ✅ Sistema de perfis persistente
- ✅ Publicações com persistência
- ✅ Comentários reais
- ✅ Comunidades funcionais
- ✅ Eventos com inscrição
- ✅ Intenções de oração
- ✅ Mensagens em tempo real
- ✅ Notificações push
- ✅ Paróquias e dioceses
- ✅ Busca global
- ✅ Sistema de moderação
- ✅ Modo demo para desenvolvimento

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase (gratuita)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd communio
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie as credenciais do projeto
3. Crie um arquivo `.env` na raiz:

```bash
cp .env.example .env
```

4. Preencha as variáveis:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_DEMO_MODE=false
```

### 4. Execute as migrations

No painel do Supabase, vá em **SQL Editor** e execute:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/seed.sql` (opcional, para dados de demonstração)

### 5. Configure o Storage

No Supabase, crie os seguintes buckets:

- `avatars` (público)
- `covers` (público)
- `post-media` (público)
- `community-media` (público)
- `event-media` (público)

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🏗️ Arquitetura

```
src/
├── components/          # Componentes reutilizáveis
├── context/            # Estado global (React Context)
├── hooks/              # Custom hooks
├── lib/                # Configurações (Supabase client)
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API (Supabase)
├── types/              # Tipos TypeScript
└── data/               # Dados mock (apenas para demo)

supabase/
├── migrations/         # Migrations SQL
└── seed.sql           # Dados de demonstração
```

## 📦 Stack Tecnológica

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4** (estilização)
- **React Router** (roteamento)
- **TanStack Query** (data fetching)
- **React Hook Form** + **Zod** (formulários)
- **Lucide React** (ícones)

### Backend
- **Supabase** (BaaS)
  - **PostgreSQL** (banco de dados)
  - **Auth** (autenticação)
  - **Storage** (arquivos)
  - **Realtime** (tempo real)
  - **RLS** (segurança)

## 🔐 Segurança

- Row Level Security (RLS) em todas as tabelas
- Autenticação via Supabase Auth
- Validação de dados no frontend e backend
- Proteção contra XSS e CSRF
- Upload seguro de arquivos
- Logs de auditoria

## 📱 Funcionalidades

### Autenticação
- ✅ Cadastro com email/senha
- ✅ Login
- ✅ Recuperação de senha
- ✅ Confirmação de email
- ✅ Sessões persistentes

### Perfis
- ✅ Perfil editável
- ✅ Avatar e capa
- ✅ Informações católicas (paróquia, diocese, santo)
- ✅ Verificação de perfis

### Feed
- ✅ Criar publicações
- ✅ Curtir/descurtir
- ✅ Comentar
- ✅ Compartilhar
- ✅ Salvar publicações
- ✅ Visibilidade (público, amigos, privado)

### Comunidades
- ✅ Criar comunidades
- ✅ Entrar/sair
- ✅ Posts em comunidades
- ✅ Moderação
- ✅ Tipos (pública, privada, secreta)

### Eventos
- ✅ Criar eventos
- ✅ Inscrição
- ✅ Tipos (missa, terço, adoração, retiro, etc.)
- ✅ Calendário

### Oração
- ✅ Intenções de oração
- ✅ "Estou rezando por você"
- ✅ Notificações de oração

### Mensagens
- ✅ Conversas privadas
- ✅ Conversas em grupo
- ✅ Tempo real (Supabase Realtime)
- ✅ Status de leitura

### Notificações
- ✅ Notificações em tempo real
- ✅ Central de notificações
- ✅ Categorias

### Paróquias e Dioceses
- ✅ Diretório de paróquias
- ✅ Hierarquia diocese → paróquia → pastoral
- ✅ Horários de missa
- ✅ Verificação institucional

### Busca
- ✅ Busca global
- ✅ Filtros por tipo
- ✅ Resultados agrupados

### Moderação
- ✅ Sistema de denúncias
- ✅ Painel administrativo
- ✅ Logs de auditoria

## 🧪 Modo Demo

Se você não configurar o Supabase, a aplicação funciona em **modo demo**:

```env
VITE_DEMO_MODE=true
```

No modo demo:
- Autenticação simulada (aceita qualquer email)
- Dados fictícios em memória
- Não persiste dados
- Útil para desenvolvimento visual

## 🚀 Deploy

### Vercel (recomendado)

1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras plataformas

```bash
npm run build
# Sirva a pasta dist/
```

## 📝 Scripts

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run typecheck    # Verificação de tipos
```

## 🗄️ Banco de Dados

O schema completo está em `supabase/migrations/`. Principais tabelas:

- `profiles` — Perfis de usuário
- `posts` — Publicações
- `comments` — Comentários
- `communities` — Comunidades
- `events` — Eventos
- `prayer_intentions` — Intenções de oração
- `conversations` / `messages` — Mensagens
- `notifications` — Notificações
- `parishes` / `dioceses` — Estrutura eclesiástica
- `reports` — Denúncias
- `audit_logs` — Logs de auditoria

## 🔒 Row Level Security (RLS)

Todas as tabelas possuem RLS ativado. Exemplos de políticas:

- Usuários podem ver perfis públicos
- Usuários podem editar apenas seu próprio perfil
- Posts públicos são visíveis para todos
- Posts privados são visíveis apenas para o autor
- Mensagens são visíveis apenas para membros da conversa
- Admins têm acesso total

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🙏 Agradecimentos

Comunidade católica brasileira que inspirou este projeto.

---

**Desenvolvido com fé e código.** ✝️
