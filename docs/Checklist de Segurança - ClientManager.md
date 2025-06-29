# Checklist de Segurança - ClientManager

## 🔒 Configurações de Segurança Essenciais

### ✅ Autenticação e Autorização

- [ ] **JWT Secrets Seguros**
  - JWT_SECRET com pelo menos 32 caracteres
  - NEXTAUTH_SECRET único e seguro
  - Tokens com expiração adequada (24h)

- [ ] **Hash de Senhas**
  - bcryptjs com salt rounds >= 12
  - Validação de força de senha
  - Política de senhas implementada

- [ ] **Controle de Acesso**
  - Roles definidos (admin, gestor, cliente)
  - Middleware de autorização em todas as rotas
  - Validação de permissões no frontend

### ✅ Banco de Dados

- [ ] **Conexão Segura**
  - SSL/TLS habilitado
  - Credenciais em variáveis de ambiente
  - Connection string não exposta

- [ ] **Proteção contra SQL Injection**
  - Uso exclusivo do Prisma ORM
  - Queries parametrizadas
  - Validação de inputs

- [ ] **Backup e Recovery**
  - Backups automáticos configurados
  - Teste de restore realizado
  - Dados sensíveis criptografados

### ✅ API e Endpoints

- [ ] **Rate Limiting**
  - Limite de requisições por IP
  - Proteção contra ataques DDoS
  - Throttling em endpoints sensíveis

- [ ] **Validação de Dados**
  - Sanitização de todos os inputs
  - Validação de tipos de dados
  - Proteção contra XSS

- [ ] **Headers de Segurança**
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection: 1; mode=block
  - Content-Security-Policy configurado

### ✅ Integrações Externas

- [ ] **APIs de Terceiros**
  - Tokens de API em variáveis de ambiente
  - Validação de webhooks
  - Timeout configurado para requisições

- [ ] **WhatsApp (Evolution API)**
  - API Key segura
  - Validação de números de telefone
  - Rate limiting para envios

### ✅ Deploy e Infraestrutura

- [ ] **HTTPS Obrigatório**
  - Certificado SSL válido
  - Redirecionamento HTTP para HTTPS
  - HSTS habilitado

- [ ] **Variáveis de Ambiente**
  - Secrets não commitados no Git
  - .env no .gitignore
  - Variáveis específicas por ambiente

- [ ] **Logs e Monitoramento**
  - Logs de segurança habilitados
  - Monitoramento de tentativas de login
  - Alertas para atividades suspeitas

### ✅ Código e Dependências

- [ ] **Dependências Atualizadas**
  - npm audit executado
  - Vulnerabilidades corrigidas
  - Dependências desnecessárias removidas

- [ ] **Código Limpo**
  - Secrets removidos do código
  - Console.logs removidos
  - Comentários sensíveis removidos

## 🛡️ Configurações Avançadas de Segurança

### Content Security Policy (CSP)
```nginx
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.facebook.com https://googleads.googleapis.com;
  frame-ancestors 'none';
" always;
```

### Nginx Security Headers
```nginx
# Security headers
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Hide Nginx version
server_tokens off;

# Disable unused HTTP methods
if ($request_method !~ ^(GET|HEAD|POST|PUT|DELETE|OPTIONS)$ ) {
    return 405;
}
```

### Rate Limiting
```javascript
// middleware/rateLimit.js
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts',
  skipSuccessfulRequests: true,
});
```

## 🔍 Auditoria de Segurança

### Ferramentas Recomendadas

1. **npm audit**
   ```bash
   npm audit
   npm audit fix
   ```

2. **OWASP ZAP**
   - Scan de vulnerabilidades web
   - Teste de penetração automatizado

3. **Snyk**
   ```bash
   npm install -g snyk
   snyk test
   snyk monitor
   ```

4. **ESLint Security Plugin**
   ```bash
   npm install eslint-plugin-security --save-dev
   ```

### Testes de Segurança

```bash
# Teste de SQL Injection
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com'\'' OR 1=1--", "password": "test"}'

# Teste de XSS
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name": "<script>alert(\"XSS\")</script>"}'

# Teste de Rate Limiting
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "test@test.com", "password": "wrong"}'
done
```

## 🚨 Plano de Resposta a Incidentes

### Em caso de violação de segurança:

1. **Contenção Imediata**
   - Isolar sistemas afetados
   - Revogar tokens comprometidos
   - Alterar senhas de acesso

2. **Avaliação do Impacto**
   - Identificar dados comprometidos
   - Avaliar extensão do incidente
   - Documentar evidências

3. **Notificação**
   - Informar usuários afetados
   - Notificar autoridades se necessário
   - Comunicar stakeholders

4. **Recuperação**
   - Restaurar sistemas seguros
   - Implementar correções
   - Monitorar atividades

5. **Lições Aprendidas**
   - Revisar procedimentos
   - Atualizar políticas
   - Treinar equipe

## 📋 Checklist de Deploy Seguro

### Antes do Deploy

- [ ] Audit de dependências executado
- [ ] Variáveis de ambiente configuradas
- [ ] Certificado SSL válido
- [ ] Backup realizado
- [ ] Testes de segurança executados

### Durante o Deploy

- [ ] Deploy em horário de baixo tráfego
- [ ] Monitoramento ativo
- [ ] Rollback preparado
- [ ] Logs sendo coletados

### Após o Deploy

- [ ] Testes de funcionalidade
- [ ] Verificação de SSL
- [ ] Teste de autenticação
- [ ] Monitoramento de logs
- [ ] Verificação de performance

## 🔧 Configurações de Produção

### Environment Variables
```env
# Produção
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-32-chars-minimum
NEXTAUTH_SECRET=your-super-secure-nextauth-secret
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Desabilitar telemetria
NEXT_TELEMETRY_DISABLED=1

# Configurações de segurança
BCRYPT_ROUNDS=12
SESSION_TIMEOUT=86400
MAX_LOGIN_ATTEMPTS=5
```

### Next.js Security Config
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};
```

## 📞 Contatos de Emergência

- **Equipe de Segurança**: security@clientmanager.com
- **Suporte Técnico**: suporte@clientmanager.com
- **Telefone de Emergência**: +55 11 99999-9999

---

**Última atualização**: Janeiro 2024  
**Versão**: 1.0.0

