import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.message.deleteMany();
  await prisma.metric.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.report.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.webhookLog.deleteMany();

  // Criar usuários
  const adminPassword = await bcrypt.hash('admin123', 12);
  const gestorPassword = await bcrypt.hash('gestor123', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@clientmanager.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'admin',
    },
  });

  const gestor = await prisma.user.create({
    data: {
      email: 'gestor@clientmanager.com',
      password: gestorPassword,
      name: 'Gestor de Tráfego',
      role: 'gestor',
    },
  });

  console.log('✅ Usuários criados');

  // Criar clientes
  const cliente1 = await prisma.client.create({
    data: {
      name: 'Empresa ABC Ltda',
      email: 'contato@empresaabc.com',
      phone: '+5511999999999',
      whatsappNumber: '+5511999999999',
      metaAdsAccountId: 'act_123456789',
      googleAdsAccountId: '123-456-7890',
      status: 'ativo',
      reportFrequency: 'semanal',
      reportTime: '09:00',
      customFields: {
        segmento: 'E-commerce',
        orcamentoMensal: 10000,
        observacoes: 'Cliente premium com foco em ROAS'
      },
      userId: gestor.id,
    },
  });

  const cliente2 = await prisma.client.create({
    data: {
      name: 'Startup XYZ',
      email: 'marketing@startupxyz.com',
      phone: '+5511888888888',
      whatsappNumber: '+5511888888888',
      metaAdsAccountId: 'act_987654321',
      googleAdsAccountId: '987-654-3210',
      status: 'ativo',
      reportFrequency: 'diaria',
      reportTime: '08:30',
      customFields: {
        segmento: 'SaaS',
        orcamentoMensal: 5000,
        observacoes: 'Foco em aquisição de leads qualificados'
      },
      userId: gestor.id,
    },
  });

  console.log('✅ Clientes criados');

  // Criar campanhas para Cliente 1
  const campanha1Meta = await prisma.campaign.create({
    data: {
      name: 'Campanha Black Friday - Meta',
      platform: 'meta_ads',
      campaignId: 'meta_123456',
      status: 'ativo',
      budget: 3000,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2024-11-30'),
      objective: 'CONVERSIONS',
      clientId: cliente1.id,
    },
  });

  const campanha1Google = await prisma.campaign.create({
    data: {
      name: 'Campanha Black Friday - Google',
      platform: 'google_ads',
      campaignId: 'google_789012',
      status: 'ativo',
      budget: 2000,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2024-11-30'),
      objective: 'SALES',
      clientId: cliente1.id,
    },
  });

  // Criar campanhas para Cliente 2
  const campanha2Meta = await prisma.campaign.create({
    data: {
      name: 'Aquisição de Leads - Meta',
      platform: 'meta_ads',
      campaignId: 'meta_345678',
      status: 'ativo',
      budget: 1500,
      startDate: new Date('2024-10-01'),
      objective: 'LEAD_GENERATION',
      clientId: cliente2.id,
    },
  });

  const campanha2Google = await prisma.campaign.create({
    data: {
      name: 'Aquisição de Leads - Google',
      platform: 'google_ads',
      campaignId: 'google_901234',
      status: 'ativo',
      budget: 1000,
      startDate: new Date('2024-10-01'),
      objective: 'LEADS',
      clientId: cliente2.id,
    },
  });

  console.log('✅ Campanhas criadas');

  // Criar métricas para as campanhas (últimos 7 dias)
  const hoje = new Date();
  const metricas = [];

  for (let i = 0; i < 7; i++) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);

    // Métricas para Campanha 1 Meta
    metricas.push({
      date: data,
      platform: 'meta_ads',
      impressions: Math.floor(Math.random() * 10000) + 5000,
      clicks: Math.floor(Math.random() * 500) + 100,
      spend: Math.floor(Math.random() * 200) + 50,
      conversions: Math.floor(Math.random() * 20) + 5,
      cpc: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
      cpm: parseFloat((Math.random() * 10 + 5).toFixed(2)),
      ctr: parseFloat((Math.random() * 3 + 1).toFixed(2)),
      roas: parseFloat((Math.random() * 4 + 2).toFixed(2)),
      costPerConversion: parseFloat((Math.random() * 20 + 10).toFixed(2)),
      campaignId: campanha1Meta.id,
    });

    // Métricas para Campanha 1 Google
    metricas.push({
      date: data,
      platform: 'google_ads',
      impressions: Math.floor(Math.random() * 8000) + 3000,
      clicks: Math.floor(Math.random() * 400) + 80,
      spend: Math.floor(Math.random() * 150) + 40,
      conversions: Math.floor(Math.random() * 15) + 3,
      cpc: parseFloat((Math.random() * 2.5 + 0.8).toFixed(2)),
      cpm: parseFloat((Math.random() * 12 + 6).toFixed(2)),
      ctr: parseFloat((Math.random() * 2.5 + 1.2).toFixed(2)),
      roas: parseFloat((Math.random() * 3.5 + 1.8).toFixed(2)),
      costPerConversion: parseFloat((Math.random() * 25 + 12).toFixed(2)),
      campaignId: campanha1Google.id,
    });

    // Métricas para Campanha 2 Meta
    metricas.push({
      date: data,
      platform: 'meta_ads',
      impressions: Math.floor(Math.random() * 6000) + 2000,
      clicks: Math.floor(Math.random() * 300) + 60,
      spend: Math.floor(Math.random() * 100) + 30,
      conversions: Math.floor(Math.random() * 12) + 2,
      cpc: parseFloat((Math.random() * 1.8 + 0.6).toFixed(2)),
      cpm: parseFloat((Math.random() * 8 + 4).toFixed(2)),
      ctr: parseFloat((Math.random() * 2.8 + 1.5).toFixed(2)),
      roas: parseFloat((Math.random() * 3 + 1.5).toFixed(2)),
      costPerConversion: parseFloat((Math.random() * 18 + 8).toFixed(2)),
      campaignId: campanha2Meta.id,
    });

    // Métricas para Campanha 2 Google
    metricas.push({
      date: data,
      platform: 'google_ads',
      impressions: Math.floor(Math.random() * 5000) + 1500,
      clicks: Math.floor(Math.random() * 250) + 50,
      spend: Math.floor(Math.random() * 80) + 25,
      conversions: Math.floor(Math.random() * 10) + 1,
      cpc: parseFloat((Math.random() * 2.2 + 0.7).toFixed(2)),
      cpm: parseFloat((Math.random() * 9 + 5).toFixed(2)),
      ctr: parseFloat((Math.random() * 2.3 + 1.3).toFixed(2)),
      roas: parseFloat((Math.random() * 2.8 + 1.3).toFixed(2)),
      costPerConversion: parseFloat((Math.random() * 22 + 10).toFixed(2)),
      campaignId: campanha2Google.id,
    });
  }

  await prisma.metric.createMany({
    data: metricas,
  });

  console.log('✅ Métricas criadas');

  // Criar relatórios
  const relatorio1 = await prisma.report.create({
    data: {
      title: 'Relatório Semanal - Empresa ABC',
      period: '7_days',
      startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
      endDate: new Date(),
      data: {
        totalSpend: 1250.50,
        totalConversions: 85,
        totalImpressions: 45000,
        totalClicks: 1200,
        avgRoas: 3.2,
        avgCpc: 1.04,
        avgCpm: 8.5,
        avgCtr: 2.67,
        platforms: {
          meta_ads: {
            spend: 750.30,
            conversions: 52,
            roas: 3.4
          },
          google_ads: {
            spend: 500.20,
            conversions: 33,
            roas: 2.9
          }
        }
      },
      status: 'gerado',
      clientId: cliente1.id,
    },
  });

  const relatorio2 = await prisma.report.create({
    data: {
      title: 'Relatório Diário - Startup XYZ',
      period: '1_day',
      startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      endDate: new Date(),
      data: {
        totalSpend: 180.75,
        totalConversions: 12,
        totalImpressions: 8500,
        totalClicks: 220,
        avgRoas: 2.8,
        avgCpc: 0.82,
        avgCpm: 6.2,
        avgCtr: 2.59,
        platforms: {
          meta_ads: {
            spend: 110.45,
            conversions: 8,
            roas: 3.1
          },
          google_ads: {
            spend: 70.30,
            conversions: 4,
            roas: 2.3
          }
        }
      },
      status: 'gerado',
      clientId: cliente2.id,
    },
  });

  console.log('✅ Relatórios criados');

  // Criar algumas mensagens de exemplo
  await prisma.message.create({
    data: {
      type: 'whatsapp',
      recipient: '+5511999999999',
      content: '📊 *Relatório Semanal - Empresa ABC*\n\n💰 Investimento: R$ 1.250,50\n🎯 Conversões: 85\n📈 ROAS: 3.2x\n\nVeja mais detalhes no painel: https://app.clientmanager.com/dashboard',
      template: 'relatorio_semanal',
      status: 'enviado',
      sentAt: new Date(new Date().setHours(new Date().getHours() - 2)),
      deliveredAt: new Date(new Date().setHours(new Date().getHours() - 2, new Date().getMinutes() - 5)),
      userId: gestor.id,
      clientId: cliente1.id,
      reportId: relatorio1.id,
    },
  });

  await prisma.message.create({
    data: {
      type: 'whatsapp',
      recipient: '+5511888888888',
      content: '📊 *Relatório Diário - Startup XYZ*\n\n💰 Investimento: R$ 180,75\n🎯 Conversões: 12\n📈 ROAS: 2.8x\n\nVeja mais detalhes no painel: https://app.clientmanager.com/dashboard',
      template: 'relatorio_diario',
      status: 'enviado',
      sentAt: new Date(new Date().setHours(new Date().getHours() - 1)),
      deliveredAt: new Date(new Date().setHours(new Date().getHours() - 1, new Date().getMinutes() - 3)),
      userId: gestor.id,
      clientId: cliente2.id,
      reportId: relatorio2.id,
    },
  });

  console.log('✅ Mensagens criadas');

  // Criar integrações
  await prisma.integration.create({
    data: {
      name: 'meta_ads',
      isActive: true,
      config: {
        appId: 'your_meta_app_id',
        appSecret: 'your_meta_app_secret',
        apiVersion: 'v18.0'
      },
      lastSync: new Date(new Date().setHours(new Date().getHours() - 1)),
    },
  });

  await prisma.integration.create({
    data: {
      name: 'google_ads',
      isActive: true,
      config: {
        clientId: 'your_google_client_id',
        clientSecret: 'your_google_client_secret',
        developerToken: 'your_developer_token'
      },
      lastSync: new Date(new Date().setHours(new Date().getHours() - 2)),
    },
  });

  await prisma.integration.create({
    data: {
      name: 'evolution_api',
      isActive: true,
      config: {
        baseUrl: 'https://api.evolution.com',
        token: 'your_evolution_token',
        instance: 'your_instance_name'
      },
      lastSync: new Date(new Date().setMinutes(new Date().getMinutes() - 30)),
    },
  });

  await prisma.integration.create({
    data: {
      name: 'n8n',
      isActive: true,
      config: {
        webhookUrl: 'https://your-n8n-instance.com/webhook',
        apiKey: 'your_n8n_api_key'
      },
      lastSync: new Date(new Date().setMinutes(new Date().getMinutes() - 15)),
    },
  });

  console.log('✅ Integrações criadas');

  // Criar alguns logs de webhook
  await prisma.webhookLog.create({
    data: {
      source: 'n8n',
      event: 'campaign_update',
      payload: {
        campaignId: 'meta_123456',
        status: 'active',
        budget: 3000,
        timestamp: new Date().toISOString()
      },
      status: 'processado',
    },
  });

  await prisma.webhookLog.create({
    data: {
      source: 'evolution_api',
      event: 'message_delivered',
      payload: {
        messageId: 'msg_123',
        recipient: '+5511999999999',
        status: 'delivered',
        timestamp: new Date().toISOString()
      },
      status: 'processado',
    },
  });

  console.log('✅ Logs de webhook criados');

  console.log('🎉 Seed concluído com sucesso!');
  console.log('\n📋 Dados criados:');
  console.log('👤 Usuários:');
  console.log('   - admin@clientmanager.com (senha: admin123)');
  console.log('   - gestor@clientmanager.com (senha: gestor123)');
  console.log('🏢 Clientes:');
  console.log('   - Empresa ABC Ltda');
  console.log('   - Startup XYZ');
  console.log('📊 Campanhas: 4 campanhas (2 Meta Ads + 2 Google Ads)');
  console.log('📈 Métricas: 28 registros (7 dias × 4 campanhas)');
  console.log('📄 Relatórios: 2 relatórios');
  console.log('💬 Mensagens: 2 mensagens WhatsApp');
  console.log('🔌 Integrações: 4 integrações configuradas');
  console.log('📝 Webhook Logs: 2 logs de exemplo');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

