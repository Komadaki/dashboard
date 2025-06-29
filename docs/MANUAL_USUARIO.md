# Manual do Usuário - ClientManager

## 📖 Índice

1. [Introdução](#introdução)
2. [Primeiros Passos](#primeiros-passos)
3. [Dashboard](#dashboard)
4. [Gerenciamento de Clientes](#gerenciamento-de-clientes)
5. [Relatórios](#relatórios)
6. [Analytics](#analytics)
7. [Mensagens](#mensagens)
8. [Configurações](#configurações)
9. [Painel Administrativo](#painel-administrativo)
10. [Solução de Problemas](#solução-de-problemas)

## 🚀 Introdução

O ClientManager é uma plataforma completa para gerenciamento de clientes de tráfego pago. Este manual irá guiá-lo através de todas as funcionalidades do sistema.

### Tipos de Usuário

- **Administrador**: Acesso completo ao sistema
- **Gestor**: Gerencia clientes e campanhas
- **Cliente**: Visualiza apenas seus próprios dados

## 🏁 Primeiros Passos

### 1. Fazendo Login

1. Acesse a URL do sistema
2. Digite seu email e senha
3. Clique em "Entrar"
4. Você será redirecionado para o dashboard

### 2. Navegação Principal

A barra lateral esquerda contém os principais menus:

- **Dashboard**: Visão geral das métricas
- **Clientes**: Gerenciamento de clientes
- **Relatórios**: Histórico de relatórios
- **Analytics**: Análises detalhadas
- **Mensagens**: Comunicação via WhatsApp
- **Configurações**: Ajustes do sistema

### 3. Barra Superior

- **Busca Global**: Pesquise clientes, campanhas, etc.
- **Notificações**: Alertas e avisos importantes
- **Perfil**: Configurações da conta e logout

## 📊 Dashboard

O dashboard é sua central de comando com informações em tempo real.

### Métricas Principais

**Cards de KPIs**:
- **ROAS**: Retorno sobre investimento em anúncios
- **CPC**: Custo por clique médio
- **Conversões**: Total de conversões do período
- **Impressões**: Alcance das campanhas

### Gráficos

**Gráfico de Performance**:
- Visualize tendências dos últimos 7, 30 ou 90 dias
- Compare métricas entre diferentes períodos
- Identifique padrões de performance

### Filtros

Use os filtros para personalizar a visualização:
- **Período**: Últimos 7, 30 ou 90 dias
- **Cliente**: Filtre por cliente específico
- **Plataforma**: Meta Ads ou Google Ads

### Ações Rápidas

- **Gerar Relatório**: Crie relatórios instantâneos
- **Sincronizar Dados**: Atualize informações das APIs
- **Ver Alertas**: Verifique notificações importantes

## 👥 Gerenciamento de Clientes

### Visualizando Clientes

Na página "Clientes", você verá cards com informações resumidas:
- Nome da empresa e responsável
- Orçamento mensal
- ROAS atual
- Campanhas ativas
- Status da conta

### Adicionando Novo Cliente

1. Clique em "Novo Cliente"
2. Preencha as informações:
   - **Dados Pessoais**: Nome, email, telefone
   - **Empresa**: Nome, segmento
   - **Contas de Anúncios**: IDs do Meta Ads e Google Ads
   - **Orçamento**: Valor mensal
3. Clique em "Salvar"

### Editando Cliente

1. Clique no ícone de edição no card do cliente
2. Modifique as informações necessárias
3. Salve as alterações

### Configurações do Cliente

**Integrações**:
- Configure IDs das contas de anúncios
- Teste conexões com as APIs
- Configure webhooks

**Relatórios**:
- Defina frequência de envio
- Escolha templates personalizados
- Configure destinatários

## 📋 Relatórios

### Tipos de Relatórios

**Por Frequência**:
- **Diário**: Enviado todos os dias
- **Semanal**: Enviado semanalmente
- **Mensal**: Enviado mensalmente
- **Personalizado**: Período específico

**Por Formato**:
- **WhatsApp**: Mensagem formatada
- **Email**: HTML responsivo
- **PDF**: Documento para download
- **Slack**: Integração com workspace

### Gerando Relatório Manual

1. Vá para "Relatórios"
2. Clique em "Gerar Relatório"
3. Selecione:
   - Cliente
   - Período
   - Formato
4. Clique em "Gerar"

### Agendamento Automático

1. Acesse "Configurações" > "Agendamentos"
2. Clique em "Nova Tarefa"
3. Configure:
   - Nome da tarefa
   - Expressão cron (frequência)
   - Cliente alvo
   - Formato de envio
4. Ative a tarefa

### Histórico de Relatórios

- Visualize todos os relatórios gerados
- Faça download de relatórios anteriores
- Verifique status de entrega
- Reenvie relatórios se necessário

## 📈 Analytics

### Visão Geral

A página Analytics oferece análises detalhadas:
- Métricas consolidadas
- Comparação entre plataformas
- Tendências temporais
- Insights automatizados

### Métricas Disponíveis

**Performance**:
- ROAS (Return on Ad Spend)
- CPC (Custo por Clique)
- CTR (Taxa de Cliques)
- CPM (Custo por Mil Impressões)

**Volume**:
- Impressões totais
- Cliques totais
- Conversões
- Investimento

### Comparação de Plataformas

Compare performance entre:
- Meta Ads vs Google Ads
- Diferentes períodos
- Diferentes clientes
- Diferentes campanhas

### Exportação de Dados

- Exporte dados em CSV
- Gere gráficos em PNG
- Crie relatórios personalizados

## 💬 Mensagens

### WhatsApp Business

O sistema integra com Evolution API para envio automático via WhatsApp.

### Configuração

1. Configure a Evolution API
2. Adicione números dos clientes
3. Teste o envio
4. Configure templates

### Templates Disponíveis

**Relatórios**:
- Template diário
- Template semanal
- Template mensal

**Alertas**:
- Orçamento atingido
- Performance baixa
- Falhas de sincronização

### Histórico de Mensagens

- Visualize todas as mensagens enviadas
- Verifique status de entrega
- Reenvie mensagens se necessário

## ⚙️ Configurações

### Perfil do Usuário

- Altere dados pessoais
- Modifique senha
- Configure preferências

### Integrações

**Meta Ads**:
- Configure App ID e Secret
- Adicione Access Token
- Teste conexão

**Google Ads**:
- Configure credenciais OAuth
- Adicione Developer Token
- Teste conexão

**Evolution API**:
- Configure URL da API
- Adicione API Key
- Teste envio de mensagens

**n8n**:
- Configure webhook URL
- Adicione API Key
- Teste automações

### Notificações

- Configure alertas por email
- Defina thresholds de performance
- Configure horários de envio

## 🔧 Painel Administrativo

*Disponível apenas para administradores*

### Gerenciamento de Usuários

**Adicionar Usuário**:
1. Clique em "Novo Usuário"
2. Preencha dados pessoais
3. Defina role (admin/gestor/cliente)
4. Envie convite

**Gerenciar Permissões**:
- Altere roles dos usuários
- Ative/desative contas
- Redefina senhas

### Monitoramento do Sistema

**Logs**:
- Visualize logs de sistema
- Monitore erros
- Acompanhe performance

**Saúde do Sistema**:
- Status das integrações
- Performance do banco
- Uso de recursos

### Configurações Globais

- Configurações de email
- Configurações de backup
- Configurações de segurança

## 🆘 Solução de Problemas

### Problemas Comuns

**Não consigo fazer login**:
- Verifique email e senha
- Limpe cache do navegador
- Contate o administrador

**Dados não estão atualizando**:
- Verifique conexão com internet
- Force sincronização manual
- Verifique configurações das APIs

**Relatórios não estão sendo enviados**:
- Verifique configuração do WhatsApp
- Verifique agendamentos ativos
- Verifique logs de erro

**Gráficos não carregam**:
- Atualize a página
- Limpe cache do navegador
- Verifique se há dados no período

### Códigos de Erro

- **401**: Não autorizado - Faça login novamente
- **403**: Sem permissão - Contate administrador
- **404**: Página não encontrada - Verifique URL
- **500**: Erro interno - Contate suporte

### Contato para Suporte

- **Email**: suporte@clientmanager.com
- **WhatsApp**: +55 11 99999-9999
- **Discord**: [Servidor da Comunidade](https://discord.gg/clientmanager)

### Recursos Adicionais

- **Documentação Técnica**: `/docs/TECHNICAL.md`
- **API Reference**: `/docs/API.md`
- **Changelog**: `/docs/CHANGELOG.md`
- **FAQ**: `/docs/FAQ.md`

---

**Última atualização**: Janeiro 2024  
**Versão do sistema**: 1.0.0

