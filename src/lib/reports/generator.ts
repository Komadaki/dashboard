import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ReportData {
  clientId: string;
  clientName: string;
  period: string;
  startDate: string;
  endDate: string;
  totalSpend: number;
  totalConversions: number;
  totalImpressions: number;
  totalClicks: number;
  avgRoas: number;
  avgCpc: number;
  avgCpm: number;
  avgCtr: number;
  platforms: {
    meta_ads: PlatformData;
    google_ads: PlatformData;
  };
  campaigns: CampaignSummary[];
  topPerformingCampaigns: CampaignSummary[];
  insights: string[];
}

export interface PlatformData {
  spend: number;
  conversions: number;
  impressions: number;
  clicks: number;
  roas: number;
  cpc: number;
  cpm: number;
  ctr: number;
}

export interface CampaignSummary {
  id: string;
  name: string;
  platform: string;
  spend: number;
  conversions: number;
  roas: number;
  status: string;
}

export class ReportGenerator {
  async generateReport(
    clientId: string,
    period: 'daily' | 'weekly' | 'monthly' | 'custom',
    startDate?: string,
    endDate?: string
  ): Promise<ReportData> {
    try {
      // Calcular datas baseado no período
      const dates = this.calculateDateRange(period, startDate, endDate);
      
      // Buscar dados do cliente
      const client = await prisma.client.findUnique({
        where: { id: clientId },
        include: {
          campaigns: {
            include: {
              metrics: {
                where: {
                  date: {
                    gte: new Date(dates.startDate),
                    lte: new Date(dates.endDate),
                  },
                },
              },
            },
          },
        },
      });

      if (!client) {
        throw new Error(`Cliente não encontrado: ${clientId}`);
      }

      // Processar dados
      const reportData = await this.processReportData(client, dates);
      
      // Salvar relatório no banco
      await this.saveReport(reportData);
      
      return reportData;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw error;
    }
  }

  private calculateDateRange(
    period: string,
    startDate?: string,
    endDate?: string
  ): { startDate: string; endDate: string } {
    const now = new Date();
    let start: Date;
    let end: Date = new Date(now);

    switch (period) {
      case 'daily':
        start = new Date(now);
        start.setDate(start.getDate() - 1);
        break;
      
      case 'weekly':
        start = new Date(now);
        start.setDate(start.getDate() - 7);
        break;
      
      case 'monthly':
        start = new Date(now);
        start.setMonth(start.getMonth() - 1);
        break;
      
      case 'custom':
        if (!startDate || !endDate) {
          throw new Error('Datas de início e fim são obrigatórias para período customizado');
        }
        start = new Date(startDate);
        end = new Date(endDate);
        break;
      
      default:
        throw new Error(`Período não suportado: ${period}`);
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }

  private async processReportData(client: any, dates: any): Promise<ReportData> {
    const campaigns = client.campaigns;
    const allMetrics = campaigns.flatMap((c: any) => c.metrics);

    // Calcular totais
    const totals = allMetrics.reduce(
      (acc: any, metric: any) => ({
        spend: acc.spend + metric.spend,
        conversions: acc.conversions + metric.conversions,
        impressions: acc.impressions + metric.impressions,
        clicks: acc.clicks + metric.clicks,
      }),
      { spend: 0, conversions: 0, impressions: 0, clicks: 0 }
    );

    // Calcular médias
    const avgRoas = totals.conversions > 0 ? (totals.conversions * 50) / totals.spend : 0; // Assumindo valor médio de conversão
    const avgCpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;
    const avgCpm = totals.impressions > 0 ? (totals.spend / totals.impressions) * 1000 : 0;
    const avgCtr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;

    // Processar dados por plataforma
    const metaMetrics = allMetrics.filter((m: any) => m.platform === 'meta_ads');
    const googleMetrics = allMetrics.filter((m: any) => m.platform === 'google_ads');

    const metaData = this.calculatePlatformData(metaMetrics);
    const googleData = this.calculatePlatformData(googleMetrics);

    // Resumo das campanhas
    const campaignSummaries = campaigns.map((campaign: any) => {
      const campaignMetrics = campaign.metrics;
      const campaignTotals = campaignMetrics.reduce(
        (acc: any, metric: any) => ({
          spend: acc.spend + metric.spend,
          conversions: acc.conversions + metric.conversions,
        }),
        { spend: 0, conversions: 0 }
      );

      return {
        id: campaign.id,
        name: campaign.name,
        platform: campaign.platform,
        spend: campaignTotals.spend,
        conversions: campaignTotals.conversions,
        roas: campaignTotals.conversions > 0 ? (campaignTotals.conversions * 50) / campaignTotals.spend : 0,
        status: campaign.status,
      };
    });

    // Top campanhas por ROAS
    const topPerformingCampaigns = [...campaignSummaries]
      .sort((a, b) => b.roas - a.roas)
      .slice(0, 3);

    // Gerar insights
    const insights = this.generateInsights(totals, metaData, googleData, campaignSummaries);

    return {
      clientId: client.id,
      clientName: client.name,
      period: dates.period || 'custom',
      startDate: dates.startDate,
      endDate: dates.endDate,
      totalSpend: totals.spend,
      totalConversions: totals.conversions,
      totalImpressions: totals.impressions,
      totalClicks: totals.clicks,
      avgRoas,
      avgCpc,
      avgCpm,
      avgCtr,
      platforms: {
        meta_ads: metaData,
        google_ads: googleData,
      },
      campaigns: campaignSummaries,
      topPerformingCampaigns,
      insights,
    };
  }

  private calculatePlatformData(metrics: any[]): PlatformData {
    const totals = metrics.reduce(
      (acc: any, metric: any) => ({
        spend: acc.spend + metric.spend,
        conversions: acc.conversions + metric.conversions,
        impressions: acc.impressions + metric.impressions,
        clicks: acc.clicks + metric.clicks,
      }),
      { spend: 0, conversions: 0, impressions: 0, clicks: 0 }
    );

    return {
      spend: totals.spend,
      conversions: totals.conversions,
      impressions: totals.impressions,
      clicks: totals.clicks,
      roas: totals.conversions > 0 ? (totals.conversions * 50) / totals.spend : 0,
      cpc: totals.clicks > 0 ? totals.spend / totals.clicks : 0,
      cpm: totals.impressions > 0 ? (totals.spend / totals.impressions) * 1000 : 0,
      ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
    };
  }

  private generateInsights(
    totals: any,
    metaData: PlatformData,
    googleData: PlatformData,
    campaigns: CampaignSummary[]
  ): string[] {
    const insights: string[] = [];

    // Insight sobre plataforma com melhor performance
    if (metaData.roas > googleData.roas) {
      insights.push(`Meta Ads está performando melhor com ROAS de ${metaData.roas.toFixed(1)}x vs ${googleData.roas.toFixed(1)}x do Google Ads`);
    } else if (googleData.roas > metaData.roas) {
      insights.push(`Google Ads está performando melhor com ROAS de ${googleData.roas.toFixed(1)}x vs ${metaData.roas.toFixed(1)}x do Meta Ads`);
    }

    // Insight sobre CPC
    const avgCpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;
    if (avgCpc > 2.0) {
      insights.push(`CPC médio de R$ ${avgCpc.toFixed(2)} está acima da média. Considere otimizar a segmentação.`);
    } else if (avgCpc < 1.0) {
      insights.push(`Excelente CPC médio de R$ ${avgCpc.toFixed(2)}. Continue com a estratégia atual.`);
    }

    // Insight sobre campanhas pausadas
    const pausedCampaigns = campaigns.filter(c => c.status === 'pausado' || c.status === 'PAUSED');
    if (pausedCampaigns.length > 0) {
      insights.push(`${pausedCampaigns.length} campanha(s) pausada(s). Verifique se é necessário reativar.`);
    }

    // Insight sobre distribuição de investimento
    const metaPercentage = (metaData.spend / totals.spend) * 100;
    if (metaPercentage > 70) {
      insights.push(`${metaPercentage.toFixed(0)}% do investimento está no Meta Ads. Considere diversificar.`);
    } else if (metaPercentage < 30) {
      insights.push(`Apenas ${metaPercentage.toFixed(0)}% do investimento está no Meta Ads. Considere aumentar.`);
    }

    return insights;
  }

  private async saveReport(reportData: ReportData): Promise<void> {
    try {
      await prisma.report.create({
        data: {
          title: `Relatório ${reportData.period} - ${reportData.clientName}`,
          period: reportData.period,
          startDate: new Date(reportData.startDate),
          endDate: new Date(reportData.endDate),
          data: reportData as any,
          status: 'gerado',
          clientId: reportData.clientId,
        },
      });
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      throw error;
    }
  }

  async getReportHistory(clientId: string, limit: number = 10): Promise<any[]> {
    try {
      return await prisma.report.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('Erro ao buscar histórico de relatórios:', error);
      throw error;
    }
  }
}

