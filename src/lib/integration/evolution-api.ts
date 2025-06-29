import { BaseIntegration, IntegrationConfig } from './base';

export interface WhatsAppMessage {
  recipient: string;
  content: string;
  template?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'document' | 'video';
}

export interface MessageStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  error?: string;
}

export class EvolutionApiIntegration extends BaseIntegration {
  private baseUrl: string;
  private token: string;
  private instance: string;

  constructor(config: IntegrationConfig) {
    super(config);
    this.baseUrl = config.config.baseUrl;
    this.token = config.config.token;
    this.instance = config.config.instance;
  }

  async authenticate(): Promise<boolean> {
    try {
      this.log('Verificando autenticação com Evolution API');
      
      // Em um ambiente real, você verificaria a conexão com:
      // GET ${baseUrl}/instance/connectionState/${instance}
      
      if (this.baseUrl && this.token && this.instance) {
        this.log('Autenticação com Evolution API verificada com sucesso');
        return true;
      }
      
      throw new Error('Credenciais da Evolution API não configuradas');
    } catch (error) {
      this.log(`Erro na autenticação: ${error}`, 'error');
      return false;
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      // Simular verificação de conexão
      return !!(this.baseUrl && this.token && this.instance);
    } catch (error) {
      this.log(`Erro ao verificar conexão: ${error}`, 'error');
      return false;
    }
  }

  async sendMessage(message: WhatsAppMessage): Promise<string> {
    try {
      this.log(`Enviando mensagem para ${message.recipient}`);
      
      const payload = {
        number: message.recipient.replace(/\D/g, ''), // Remove caracteres não numéricos
        text: message.content,
      };

      // Em um ambiente real, você faria uma requisição POST para:
      // ${baseUrl}/message/sendText/${instance}
      
      const response = await this.makeRequest(
        `${this.baseUrl}/message/sendText/${this.instance}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      // Simulando resposta bem-sucedida
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.log(`Mensagem enviada com sucesso. ID: ${messageId}`);
      
      return messageId;
    } catch (error) {
      this.log(`Erro ao enviar mensagem: ${error}`, 'error');
      throw error;
    }
  }

  async sendMediaMessage(message: WhatsAppMessage): Promise<string> {
    try {
      this.log(`Enviando mensagem com mídia para ${message.recipient}`);
      
      const payload = {
        number: message.recipient.replace(/\D/g, ''),
        caption: message.content,
        media: message.mediaUrl,
      };

      // Em um ambiente real, você faria uma requisição POST para:
      // ${baseUrl}/message/sendMedia/${instance}
      
      const response = await this.makeRequest(
        `${this.baseUrl}/message/sendMedia/${this.instance}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      // Simulando resposta bem-sucedida
      const messageId = `msg_media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.log(`Mensagem com mídia enviada com sucesso. ID: ${messageId}`);
      
      return messageId;
    } catch (error) {
      this.log(`Erro ao enviar mensagem com mídia: ${error}`, 'error');
      throw error;
    }
  }

  async getMessageStatus(messageId: string): Promise<MessageStatus> {
    try {
      this.log(`Verificando status da mensagem ${messageId}`);
      
      // Em um ambiente real, você faria uma requisição GET para:
      // ${baseUrl}/message/status/${messageId}
      
      // Simulando status da mensagem
      const statuses = ['sent', 'delivered', 'read'] as const;
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      const status: MessageStatus = {
        id: messageId,
        status: randomStatus,
        timestamp: new Date().toISOString(),
      };

      this.log(`Status da mensagem ${messageId}: ${status.status}`);
      return status;
    } catch (error) {
      this.log(`Erro ao verificar status da mensagem: ${error}`, 'error');
      throw error;
    }
  }

  async getInstanceInfo(): Promise<any> {
    try {
      this.log(`Obtendo informações da instância ${this.instance}`);
      
      // Em um ambiente real, você faria uma requisição GET para:
      // ${baseUrl}/instance/fetchInstances
      
      // Simulando informações da instância
      const instanceInfo = {
        instance: this.instance,
        status: 'open',
        qrcode: null,
        profileName: 'ClientManager Bot',
        profilePictureUrl: null,
        phone: '+5511999999999',
        connected: true,
      };

      this.log('Informações da instância obtidas com sucesso');
      return instanceInfo;
    } catch (error) {
      this.log(`Erro ao obter informações da instância: ${error}`, 'error');
      throw error;
    }
  }

  async createInstance(): Promise<boolean> {
    try {
      this.log(`Criando instância ${this.instance}`);
      
      const payload = {
        instanceName: this.instance,
        token: this.token,
        qrcode: true,
        webhook: `${process.env.NEXTAUTH_URL}/api/webhooks/evolution`,
      };

      // Em um ambiente real, você faria uma requisição POST para:
      // ${baseUrl}/instance/create
      
      const response = await this.makeRequest(
        `${this.baseUrl}/instance/create`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      this.log(`Instância ${this.instance} criada com sucesso`);
      return true;
    } catch (error) {
      this.log(`Erro ao criar instância: ${error}`, 'error');
      return false;
    }
  }

  // Métodos auxiliares para templates de mensagem
  generateReportMessage(clientName: string, reportData: any): string {
    return `📊 *Relatório ${reportData.period} - ${clientName}*

💰 Investimento: R$ ${reportData.totalSpend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
🎯 Conversões: ${reportData.totalConversions}
📈 ROAS: ${reportData.avgRoas.toFixed(1)}x
💡 CPC Médio: R$ ${reportData.avgCpc.toFixed(2)}

📱 Meta Ads: R$ ${reportData.platforms.meta_ads.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | ${reportData.platforms.meta_ads.conversions} conversões
🔍 Google Ads: R$ ${reportData.platforms.google_ads.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | ${reportData.platforms.google_ads.conversions} conversões

🔗 Veja mais detalhes no painel: ${process.env.NEXTAUTH_URL}/dashboard`;
  }

  generateAlertMessage(clientName: string, alertType: string, alertData: any): string {
    switch (alertType) {
      case 'budget_alert':
        return `⚠️ *Alerta de Orçamento - ${clientName}*

O orçamento da campanha "${alertData.campaignName}" está ${alertData.percentage}% consumido.

💰 Gasto atual: R$ ${alertData.currentSpend.toFixed(2)}
🎯 Orçamento total: R$ ${alertData.totalBudget.toFixed(2)}

Considere ajustar o orçamento ou pausar a campanha se necessário.`;

      case 'performance_alert':
        return `📉 *Alerta de Performance - ${clientName}*

A campanha "${alertData.campaignName}" está com performance abaixo do esperado:

📈 ROAS atual: ${alertData.currentRoas.toFixed(1)}x (meta: ${alertData.targetRoas.toFixed(1)}x)
💡 CPC atual: R$ ${alertData.currentCpc.toFixed(2)}

Recomendamos revisar os anúncios e segmentação.`;

      default:
        return `🔔 *Notificação - ${clientName}*

${alertData.message}`;
    }
  }

  // Implementação dos métodos abstratos da classe base
  async fetchCampaigns(accountId: string): Promise<any[]> {
    // Evolution API não gerencia campanhas, retorna array vazio
    return [];
  }

  async fetchMetrics(campaignId: string, startDate: string, endDate: string): Promise<any[]> {
    // Evolution API não gerencia métricas, retorna array vazio
    return [];
  }
}

