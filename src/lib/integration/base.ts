export interface IntegrationConfig {
  name: string;
  isActive: boolean;
  config: Record<string, any>;
}

export interface MetricData {
  date: string;
  platform: string;
  campaignId: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  cpc: number;
  cpm: number;
  ctr: number;
  roas: number;
  costPerConversion: number;
}

export interface CampaignData {
  id: string;
  name: string;
  platform: string;
  status: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  objective?: string;
}

export abstract class BaseIntegration {
  protected config: IntegrationConfig;

  constructor(config: IntegrationConfig) {
    this.config = config;
  }

  abstract authenticate(): Promise<boolean>;
  abstract fetchCampaigns(accountId: string): Promise<CampaignData[]>;
  abstract fetchMetrics(campaignId: string, startDate: string, endDate: string): Promise<MetricData[]>;
  abstract isConnected(): Promise<boolean>;

  protected async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Request failed for ${this.config.name}:`, error);
      throw error;
    }
  }

  protected log(message: string, level: 'info' | 'error' | 'warn' = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${this.config.name}] [${level.toUpperCase()}] ${message}`);
  }
}

