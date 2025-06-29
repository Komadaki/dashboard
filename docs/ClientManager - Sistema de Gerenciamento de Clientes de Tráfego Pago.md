# ClientManager - Sistema de Gerenciamento de Clientes de Tráfego Pago

![ClientManager Logo](https://via.placeholder.com/800x200/3b82f6/ffffff?text=ClientManager)

## 📋 Sobre o Projeto

O **ClientManager** é um sistema web 100% open source e customizado para gerenciamento de clientes de tráfego pago. Desenvolvido com tecnologias modernas, oferece um dashboard exclusivo com integrações nativas para Meta Ads, Google Ads, n8n e Evolution API (WhatsApp).

### 🎯 Principais Funcionalidades

- **Dashboard Interativo**: Métricas em tempo real com gráficos e KPIs
- **Gerenciamento de Clientes**: CRUD completo com informações detalhadas
- **Integrações Nativas**: Meta Ads, Google Ads, n8n e Evolution API
- **Relatórios Automatizados**: Geração e envio automático via WhatsApp
- **Sistema de Agendamento**: Tarefas automatizadas com cron jobs
- **Painel Administrativo**: Controle total do sistema e usuários
- **Autenticação JWT**: Sistema seguro com roles (admin, gestor, cliente)
- **Responsivo**: Interface adaptável para desktop e mobile

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **ShadCN UI** - Componentes de interface moderna
- **Recharts** - Biblioteca de gráficos
- **Lucide Icons** - Ícones SVG

### Backend
- **Next.js API Routes** - Endpoints RESTful
- **Prisma ORM** - Mapeamento objeto-relacional
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação e autorização
- **bcryptjs** - Hash de senhas

### Integrações
- **Meta Ads API** - Campanhas do Facebook/Instagram
- **Google Ads API** - Campanhas do Google
- **Evolution API** - WhatsApp Business
- **n8n** - Automação de workflows

### Ferramentas
- **Node Cron** - Agendamento de tarefas
- **Axios** - Cliente HTTP
- **ESLint** - Linting de código
- **Git** - Controle de versão

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn
- Git

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/client-manager.git
cd client-manager
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
# Inicie o PostgreSQL
sudo service postgresql start

# Crie o banco de dados
sudo -u postgres createdb client_manager

# Configure a senha do usuário postgres
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

4. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/client_manager"

# JWT
JWT_SECRET="seu-jwt-secret-super-seguro"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-nextauth-secret"

# Meta Ads API
META_ADS_APP_ID="seu-app-id"
META_ADS_APP_SECRET="seu-app-secret"
META_ADS_ACCESS_TOKEN="seu-access-token"

# Google Ads API
GOOGLE_ADS_CLIENT_ID="seu-client-id"
GOOGLE_ADS_CLIENT_SECRET="seu-client-secret"
GOOGLE_ADS_REFRESH_TOKEN="seu-refresh-token"
GOOGLE_ADS_DEVELOPER_TOKEN="seu-developer-token"

# Evolution API
EVOLUTION_API_URL="https://sua-evolution-api.com"
EVOLUTION_API_KEY="sua-api-key"

# n8n
N8N_WEBHOOK_URL="https://seu-n8n.com/webhook"
N8N_API_KEY="sua-api-key"
```

5. **Execute as migrações do banco**
```bash
npx prisma migrate dev --name init
```

6. **Popule o banco com dados iniciais**
```bash
npx tsx prisma/seed.ts
```

7. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

8. **Acesse a aplicação**
```
http://localhost:3000
```

## 👥 Usuários Padrão

Após executar o seed, você terá os seguintes usuários:

| Email | Senha | Role |
|-------|-------|------|
| admin@clientmanager.com | admin123 | Administrador |
| gestor@clientmanager.com | gestor123 | Gestor |
| maria@empresaabc.com | cliente123 | Cliente |
| pedro@startupxyz.com | cliente123 | Cliente |

## 📖 Estrutura do Projeto

```
client-manager/
├── prisma/                 # Schema e migrações do banco
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/                # App Router do Next.js
│   │   ├── api/           # Endpoints da API
│   │   ├── admin/         # Páginas administrativas
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── login/         # Autenticação
│   │   └── ...
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes base (ShadCN)
│   │   ├── layout/       # Layout da aplicação
│   │   └── dashboard/    # Componentes do dashboard
│   ├── lib/              # Utilitários e configurações
│   │   ├── auth.ts       # Configuração JWT
│   │   ├── integrations/ # APIs externas
│   │   ├── reports/      # Sistema de relatórios
│   │   └── scheduler/    # Agendamento de tarefas
│   └── middleware/       # Middlewares do Next.js
├── public/               # Arquivos estáticos
├── docs/                 # Documentação
└── package.json
```

## 🔧 Configuração das Integrações

### Meta Ads API

1. Acesse o [Facebook Developers](https://developers.facebook.com/)
2. Crie um novo app
3. Configure as permissões necessárias
4. Obtenha o App ID, App Secret e Access Token
5. Configure no arquivo `.env`

### Google Ads API

1. Acesse o [Google Ads API](https://developers.google.com/google-ads/api)
2. Configure um projeto no Google Cloud Console
3. Ative a Google Ads API
4. Configure OAuth 2.0
5. Obtenha as credenciais necessárias

### Evolution API (WhatsApp)

1. Configure uma instância da Evolution API
2. Obtenha a URL base e API Key
3. Configure no arquivo `.env`
4. Teste a conexão

### n8n

1. Configure uma instância do n8n
2. Crie workflows para automação
3. Configure webhooks
4. Obtenha a URL do webhook

## 📊 Funcionalidades Detalhadas

### Dashboard

- **Métricas em Tempo Real**: ROAS, CPC, CTR, Conversões
- **Gráficos Interativos**: Performance dos últimos 7, 30 ou 90 dias
- **Comparação de Plataformas**: Meta Ads vs Google Ads
- **Filtros Avançados**: Por período, cliente ou campanha

### Relatórios Automatizados

- **Tipos**: Diário, Semanal, Mensal, Personalizado
- **Formatos**: WhatsApp, Email, PDF, Slack
- **Agendamento**: Cron jobs configuráveis
- **Templates**: Personalizáveis por cliente

### Painel Administrativo

- **Gerenciamento de Usuários**: CRUD completo com roles
- **Gerenciamento de Clientes**: Informações e contas de anúncios
- **Configuração de Integrações**: APIs e webhooks
- **Monitoramento**: Logs, performance e saúde do sistema

## 🔐 Segurança

- **Autenticação JWT**: Tokens seguros com expiração
- **Hash de Senhas**: bcryptjs com salt
- **Roles e Permissões**: Controle granular de acesso
- **Validação de Dados**: Sanitização de inputs
- **HTTPS**: Comunicação criptografada

## 📱 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/register` - Registro de usuário
- `GET /api/auth/me` - Dados do usuário logado

### Clientes
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Criar cliente
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Deletar cliente

### Campanhas
- `GET /api/campaigns` - Listar campanhas
- `POST /api/campaigns` - Criar campanha
- `PUT /api/campaigns/:id` - Atualizar campanha

### Relatórios
- `POST /api/reports/generate` - Gerar relatório
- `GET /api/reports` - Histórico de relatórios

### Integrações
- `POST /api/integrations/sync` - Sincronizar dados
- `POST /api/webhooks/n8n` - Webhook n8n
- `POST /api/webhooks/evolution` - Webhook Evolution API

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Configure o banco PostgreSQL (Supabase/Neon)
4. Deploy automático

### Docker

```bash
# Build da imagem
docker build -t client-manager .

# Execute o container
docker run -p 3000:3000 client-manager
```

### VPS/Servidor

1. Configure Node.js e PostgreSQL
2. Clone o repositório
3. Configure variáveis de ambiente
4. Execute `npm run build`
5. Use PM2 para gerenciar o processo

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: suporte@clientmanager.com
- **Discord**: [Servidor da Comunidade](https://discord.gg/clientmanager)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/client-manager/issues)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [ShadCN UI](https://ui.shadcn.com/) - Componentes de UI
- [Prisma](https://prisma.io/) - ORM
- [Recharts](https://recharts.org/) - Biblioteca de gráficos

---

**Desenvolvido com ❤️ para a comunidade de marketing digital**

