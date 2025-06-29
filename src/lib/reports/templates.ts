import { ReportData } from './generator';

export class ReportTemplates {
  static generateWhatsAppMessage(reportData: ReportData): string {
    const { clientName, period, totalSpend, totalConversions, avgRoas, platforms } = reportData;
    
    const periodText = {
      daily: 'Diário',
      weekly: 'Semanal', 
      monthly: 'Mensal',
      custom: 'Personalizado'
    }[period] || 'Personalizado';

    return `📊 *Relatório ${periodText} - ${clientName}*

📅 Período: ${new Date(reportData.startDate).toLocaleDateString('pt-BR')} a ${new Date(reportData.endDate).toLocaleDateString('pt-BR')}

💰 *Resumo Geral*
• Investimento Total: R$ ${totalSpend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• Conversões: ${totalConversions}
• ROAS Médio: ${avgRoas.toFixed(1)}x
• CPC Médio: R$ ${reportData.avgCpc.toFixed(2)}

📱 *Meta Ads*
• Investimento: R$ ${platforms.meta_ads.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• Conversões: ${platforms.meta_ads.conversions}
• ROAS: ${platforms.meta_ads.roas.toFixed(1)}x

🔍 *Google Ads*
• Investimento: R$ ${platforms.google_ads.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• Conversões: ${platforms.google_ads.conversions}
• ROAS: ${platforms.google_ads.roas.toFixed(1)}x

🏆 *Top 3 Campanhas*
${reportData.topPerformingCampaigns.map((campaign, index) => 
  `${index + 1}. ${campaign.name} - ROAS: ${campaign.roas.toFixed(1)}x`
).join('\n')}

💡 *Insights*
${reportData.insights.map(insight => `• ${insight}`).join('\n')}

🔗 Acesse o painel completo: ${process.env.NEXTAUTH_URL}/dashboard`;
  }

  static generateEmailHTML(reportData: ReportData): string {
    const { clientName, period, totalSpend, totalConversions, avgRoas, platforms } = reportData;
    
    const periodText = {
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal', 
      custom: 'Personalizado'
    }[period] || 'Personalizado';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Relatório ${periodText} - ${clientName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric-card { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .metric-value { font-size: 24px; font-weight: bold; color: #1e40af; }
        .metric-label { color: #64748b; font-size: 14px; }
        .platform-section { margin: 20px 0; padding: 20px; background: #f1f5f9; border-radius: 8px; }
        .campaigns-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .campaigns-table th, .campaigns-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .campaigns-table th { background: #f8fafc; font-weight: bold; }
        .insights { background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; }
        .footer { text-align: center; margin-top: 40px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Relatório ${periodText}</h1>
            <h2>${clientName}</h2>
            <p>Período: ${new Date(reportData.startDate).toLocaleDateString('pt-BR')} a ${new Date(reportData.endDate).toLocaleDateString('pt-BR')}</p>
        </div>

        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value">R$ ${totalSpend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div class="metric-label">Investimento Total</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${totalConversions}</div>
                <div class="metric-label">Conversões</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${avgRoas.toFixed(1)}x</div>
                <div class="metric-label">ROAS Médio</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">R$ ${reportData.avgCpc.toFixed(2)}</div>
                <div class="metric-label">CPC Médio</div>
            </div>
        </div>

        <div class="platform-section">
            <h3>📱 Meta Ads</h3>
            <div class="metrics">
                <div class="metric-card">
                    <div class="metric-value">R$ ${platforms.meta_ads.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div class="metric-label">Investimento</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${platforms.meta_ads.conversions}</div>
                    <div class="metric-label">Conversões</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${platforms.meta_ads.roas.toFixed(1)}x</div>
                    <div class="metric-label">ROAS</div>
                </div>
            </div>
        </div>

        <div class="platform-section">
            <h3>🔍 Google Ads</h3>
            <div class="metrics">
                <div class="metric-card">
                    <div class="metric-value">R$ ${platforms.google_ads.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div class="metric-label">Investimento</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${platforms.google_ads.conversions}</div>
                    <div class="metric-label">Conversões</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${platforms.google_ads.roas.toFixed(1)}x</div>
                    <div class="metric-label">ROAS</div>
                </div>
            </div>
        </div>

        <h3>🏆 Top Campanhas por Performance</h3>
        <table class="campaigns-table">
            <thead>
                <tr>
                    <th>Campanha</th>
                    <th>Plataforma</th>
                    <th>Investimento</th>
                    <th>Conversões</th>
                    <th>ROAS</th>
                </tr>
            </thead>
            <tbody>
                ${reportData.topPerformingCampaigns.map(campaign => `
                    <tr>
                        <td>${campaign.name}</td>
                        <td>${campaign.platform === 'meta_ads' ? 'Meta Ads' : 'Google Ads'}</td>
                        <td>R$ ${campaign.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td>${campaign.conversions}</td>
                        <td>${campaign.roas.toFixed(1)}x</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="insights">
            <h3>💡 Insights e Recomendações</h3>
            <ul>
                ${reportData.insights.map(insight => `<li>${insight}</li>`).join('')}
            </ul>
        </div>

        <div class="footer">
            <p>Relatório gerado automaticamente pelo ClientManager</p>
            <p><a href="${process.env.NEXTAUTH_URL}/dashboard">Acesse o painel completo</a></p>
        </div>
    </div>
</body>
</html>`;
  }

  static generatePDFData(reportData: ReportData): any {
    // Estrutura de dados para geração de PDF
    return {
      title: `Relatório ${reportData.period} - ${reportData.clientName}`,
      subtitle: `Período: ${new Date(reportData.startDate).toLocaleDateString('pt-BR')} a ${new Date(reportData.endDate).toLocaleDateString('pt-BR')}`,
      sections: [
        {
          title: 'Resumo Executivo',
          content: [
            `Investimento Total: R$ ${reportData.totalSpend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            `Total de Conversões: ${reportData.totalConversions}`,
            `ROAS Médio: ${reportData.avgRoas.toFixed(1)}x`,
            `CPC Médio: R$ ${reportData.avgCpc.toFixed(2)}`,
          ]
        },
        {
          title: 'Performance por Plataforma',
          content: [
            'Meta Ads:',
            `  • Investimento: R$ ${reportData.platforms.meta_ads.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            `  • Conversões: ${reportData.platforms.meta_ads.conversions}`,
            `  • ROAS: ${reportData.platforms.meta_ads.roas.toFixed(1)}x`,
            '',
            'Google Ads:',
            `  • Investimento: R$ ${reportData.platforms.google_ads.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            `  • Conversões: ${reportData.platforms.google_ads.conversions}`,
            `  • ROAS: ${reportData.platforms.google_ads.roas.toFixed(1)}x`,
          ]
        },
        {
          title: 'Top Campanhas',
          content: reportData.topPerformingCampaigns.map((campaign, index) => 
            `${index + 1}. ${campaign.name} - ROAS: ${campaign.roas.toFixed(1)}x (R$ ${campaign.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`
          )
        },
        {
          title: 'Insights e Recomendações',
          content: reportData.insights
        }
      ]
    };
  }

  static generateSlackMessage(reportData: ReportData): any {
    const { clientName, period, totalSpend, totalConversions, avgRoas } = reportData;
    
    return {
      text: `Relatório ${period} - ${clientName}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `📊 Relatório ${period} - ${clientName}`
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Investimento Total:*\nR$ ${totalSpend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            },
            {
              type: "mrkdwn", 
              text: `*Conversões:*\n${totalConversions}`
            },
            {
              type: "mrkdwn",
              text: `*ROAS Médio:*\n${avgRoas.toFixed(1)}x`
            },
            {
              type: "mrkdwn",
              text: `*CPC Médio:*\nR$ ${reportData.avgCpc.toFixed(2)}`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Top Insights:*\n${reportData.insights.slice(0, 3).map(insight => `• ${insight}`).join('\n')}`
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Ver Relatório Completo"
              },
              url: `${process.env.NEXTAUTH_URL}/dashboard`
            }
          ]
        }
      ]
    };
  }
}

