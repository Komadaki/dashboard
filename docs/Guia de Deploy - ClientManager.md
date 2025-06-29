# Guia de Deploy - ClientManager

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Deploy na Vercel](#deploy-na-vercel)
3. [Deploy em VPS](#deploy-em-vps)
4. [Deploy com Docker](#deploy-com-docker)
5. [Configuração de Banco de Dados](#configuração-de-banco-de-dados)
6. [Configuração de SSL](#configuração-de-ssl)
7. [Monitoramento](#monitoramento)
8. [Backup e Restore](#backup-e-restore)

## ✅ Pré-requisitos

### Checklist de Deploy

- [ ] Código testado e funcionando localmente
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Banco de dados configurado
- [ ] Integrações testadas
- [ ] Documentação atualizada
- [ ] Backup dos dados importantes

### Variáveis de Ambiente Obrigatórias

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
NEXTAUTH_URL="https://seu-dominio.com"
NEXTAUTH_SECRET="..."
```

## 🚀 Deploy na Vercel (Recomendado)

### Vantagens
- Deploy automático
- SSL gratuito
- CDN global
- Escalabilidade automática
- Zero configuração

### Passo a Passo

#### 1. Preparar Repositório
```bash
# Commit todas as mudanças
git add .
git commit -m "Preparação para deploy"
git push origin main
```

#### 2. Configurar Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Conecte sua conta GitHub
3. Importe o repositório `client-manager`
4. Configure as variáveis de ambiente

#### 3. Configurar Banco de Dados
Use Supabase para PostgreSQL gratuito:

1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Copie a connection string
4. Configure na Vercel:

```env
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres?sslmode=require"
```

#### 4. Configurar Variáveis na Vercel
```env
# Obrigatórias
DATABASE_URL="postgresql://..."
JWT_SECRET="seu-jwt-secret-32-chars"
NEXTAUTH_URL="https://seu-app.vercel.app"
NEXTAUTH_SECRET="seu-nextauth-secret"

# Opcionais (integrações)
META_ADS_APP_ID="..."
META_ADS_APP_SECRET="..."
GOOGLE_ADS_CLIENT_ID="..."
EVOLUTION_API_URL="..."
```

#### 5. Deploy
1. Clique em "Deploy"
2. Aguarde o build
3. Acesse a URL gerada
4. Teste o login

#### 6. Configurar Domínio Personalizado
1. Vá em Settings > Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções
4. Aguarde propagação

## 🖥️ Deploy em VPS

### Requisitos do Servidor
- Ubuntu 22.04 LTS
- 2GB RAM mínimo
- 20GB espaço em disco
- Node.js 20+
- PostgreSQL 15+
- Nginx

### Passo a Passo

#### 1. Preparar Servidor
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Instalar Nginx
sudo apt install nginx -y

# Instalar PM2
sudo npm install -g pm2

# Instalar Git
sudo apt install git -y
```

#### 2. Configurar PostgreSQL
```bash
# Iniciar PostgreSQL
sudo service postgresql start

# Criar banco e usuário
sudo -u postgres psql << EOF
CREATE DATABASE client_manager;
CREATE USER clientmanager WITH PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE client_manager TO clientmanager;
\q
EOF
```

#### 3. Deploy da Aplicação
```bash
# Criar usuário para a aplicação
sudo adduser --system --group clientmanager

# Clonar repositório
sudo -u clientmanager git clone https://github.com/seu-usuario/client-manager.git /home/clientmanager/app

# Entrar no diretório
cd /home/clientmanager/app

# Instalar dependências
sudo -u clientmanager npm ci --only=production

# Configurar variáveis de ambiente
sudo -u clientmanager cp .env.example .env
sudo -u clientmanager nano .env

# Gerar Prisma client
sudo -u clientmanager npx prisma generate

# Executar migrações
sudo -u clientmanager npx prisma migrate deploy

# Build da aplicação
sudo -u clientmanager npm run build
```

#### 4. Configurar PM2
```bash
# Criar arquivo de configuração PM2
sudo -u clientmanager cat > /home/clientmanager/app/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'client-manager',
    script: 'npm',
    args: 'start',
    cwd: '/home/clientmanager/app',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/clientmanager/logs/err.log',
    out_file: '/home/clientmanager/logs/out.log',
    log_file: '/home/clientmanager/logs/combined.log',
    time: true
  }]
}
EOF

# Criar diretório de logs
sudo mkdir -p /home/clientmanager/logs
sudo chown clientmanager:clientmanager /home/clientmanager/logs

# Iniciar aplicação
sudo -u clientmanager pm2 start /home/clientmanager/app/ecosystem.config.js

# Configurar PM2 para iniciar no boot
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u clientmanager --hp /home/clientmanager
sudo -u clientmanager pm2 save
```

#### 5. Configurar Nginx
```bash
# Criar configuração do site
sudo cat > /etc/nginx/sites-available/client-manager << EOF
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;

    # SSL Configuration (será configurado com Certbot)
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # API routes
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Ativar site
sudo ln -s /etc/nginx/sites-available/client-manager /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

#### 6. Configurar SSL com Let's Encrypt
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Testar renovação automática
sudo certbot renew --dry-run
```

## 🐳 Deploy com Docker

### Vantagens
- Ambiente isolado
- Fácil escalabilidade
- Consistência entre ambientes
- Fácil backup e restore

### Passo a Passo

#### 1. Preparar Arquivos Docker
Os arquivos `Dockerfile` e `docker-compose.yml` já estão incluídos no projeto.

#### 2. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar variáveis
nano .env
```

#### 3. Build e Deploy
```bash
# Build das imagens
docker-compose build

# Iniciar serviços
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f app
```

#### 4. Executar Migrações
```bash
# Executar migrações do banco
docker-compose exec app npx prisma migrate deploy

# Executar seed (opcional)
docker-compose exec app npx tsx prisma/seed.ts
```

#### 5. Configurar Nginx (Opcional)
Se não usar o Nginx do docker-compose, configure manualmente:

```bash
# Configurar proxy para Docker
sudo cat > /etc/nginx/sites-available/client-manager-docker << EOF
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
```

## 🗄️ Configuração de Banco de Dados

### Supabase (Recomendado para Vercel)
```bash
# 1. Criar conta em supabase.com
# 2. Criar novo projeto
# 3. Copiar connection string
# 4. Configurar variável DATABASE_URL
```

### PostgreSQL Gerenciado (DigitalOcean, AWS RDS)
```bash
# 1. Criar instância PostgreSQL
# 2. Configurar firewall para permitir conexões
# 3. Criar banco de dados
# 4. Configurar connection string
```

### PostgreSQL Local (VPS)
```bash
# Configurações de performance para produção
sudo nano /etc/postgresql/15/main/postgresql.conf

# Configurações recomendadas:
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

## 🔒 Configuração de SSL

### Let's Encrypt (Gratuito)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com

# Configurar renovação automática
sudo crontab -e
# Adicionar linha:
0 12 * * * /usr/bin/certbot renew --quiet
```

### Cloudflare (Recomendado)
1. Adicionar domínio ao Cloudflare
2. Configurar DNS
3. Ativar SSL/TLS Full (Strict)
4. Configurar regras de página

## 📊 Monitoramento

### Logs da Aplicação
```bash
# PM2 logs
pm2 logs client-manager

# Docker logs
docker-compose logs -f app

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Monitoramento de Performance
```bash
# Instalar htop
sudo apt install htop

# Monitorar recursos
htop

# Monitorar PostgreSQL
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

### Alertas (Opcional)
Configure alertas para:
- Uso de CPU > 80%
- Uso de memória > 90%
- Espaço em disco < 10%
- Aplicação offline

## 💾 Backup e Restore

### Backup do Banco de Dados
```bash
# Backup manual
pg_dump -h localhost -U clientmanager -d client_manager > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup automático (crontab)
0 2 * * * pg_dump -h localhost -U clientmanager -d client_manager > /backups/client_manager_$(date +\%Y\%m\%d_\%H\%M\%S).sql
```

### Backup dos Arquivos
```bash
# Backup da aplicação
tar -czf app_backup_$(date +%Y%m%d_%H%M%S).tar.gz /home/clientmanager/app

# Backup com rsync
rsync -av /home/clientmanager/app/ /backups/app/
```

### Restore
```bash
# Restore do banco
psql -h localhost -U clientmanager -d client_manager < backup_20240115_120000.sql

# Restore da aplicação
tar -xzf app_backup_20240115_120000.tar.gz -C /home/clientmanager/
```

## 🔧 Troubleshooting

### Problemas Comuns

#### Aplicação não inicia
```bash
# Verificar logs
pm2 logs client-manager

# Verificar variáveis de ambiente
pm2 env client-manager

# Reiniciar aplicação
pm2 restart client-manager
```

#### Erro de conexão com banco
```bash
# Testar conexão
psql -h localhost -U clientmanager -d client_manager

# Verificar status PostgreSQL
sudo systemctl status postgresql
```

#### Erro 502 Bad Gateway
```bash
# Verificar se aplicação está rodando
pm2 status

# Verificar configuração Nginx
sudo nginx -t

# Verificar logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### Scripts de Manutenção

#### Script de Health Check
```bash
#!/bin/bash
# health_check.sh

# Verificar se aplicação está respondendo
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Aplicação OK"
else
    echo "❌ Aplicação com problemas"
    pm2 restart client-manager
fi

# Verificar PostgreSQL
if sudo -u postgres psql -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ PostgreSQL OK"
else
    echo "❌ PostgreSQL com problemas"
    sudo systemctl restart postgresql
fi
```

#### Script de Deploy Automático
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Iniciando deploy..."

# Backup antes do deploy
pg_dump -h localhost -U clientmanager -d client_manager > backup_pre_deploy_$(date +%Y%m%d_%H%M%S).sql

# Atualizar código
cd /home/clientmanager/app
sudo -u clientmanager git pull origin main

# Instalar dependências
sudo -u clientmanager npm ci --only=production

# Executar migrações
sudo -u clientmanager npx prisma migrate deploy

# Build da aplicação
sudo -u clientmanager npm run build

# Reiniciar aplicação
pm2 restart client-manager

echo "✅ Deploy concluído!"
```

## 📞 Suporte

Para problemas durante o deploy:

- **GitHub Issues**: [Reportar problema](https://github.com/seu-usuario/client-manager/issues)
- **Discord**: [Comunidade](https://discord.gg/clientmanager)
- **Email**: suporte@clientmanager.com

---

**Última atualização**: Janeiro 2024  
**Versão**: 1.0.0

