import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.comment.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'João Silva',
        email: 'joao@empresa.com',
        username: 'joao.silva',
        role: 'admin',
        password: 'hashedpassword123'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Maria Santos',
        email: 'maria@empresa.com',
        username: 'maria.santos',
        role: 'agent',
        password: 'hashedpassword123'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Carlos Oliveira',
        email: 'carlos@cliente.com',
        username: 'carlos.oliveira',
        role: 'user',
        password: 'hashedpassword123'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Ana Costa',
        email: 'ana@cliente.com',
        username: 'ana.costa',
        role: 'user',
        password: 'hashedpassword123'
      }
    })
  ])

  // Create tickets
  const tickets = await Promise.all([
    prisma.ticket.create({
      data: {
        title: 'Sistema não carrega após login',
        description: 'Quando tento fazer login, o sistema fica carregando indefinidamente. Já tentei diferentes navegadores e o problema persiste.',
        status: 'open',
        priority: 'high',
        category: 'bug',
        customerId: users[2].id,
        assigneeId: users[1].id
      }
    }),
    prisma.ticket.create({
      data: {
        title: 'Solicitação de nova funcionalidade - Relatórios',
        description: 'Gostaria de solicitar uma nova funcionalidade para gerar relatórios mensais automaticamente.',
        status: 'in_progress',
        priority: 'medium',
        category: 'feature',
        customerId: users[3].id,
        assigneeId: users[1].id
      }
    }),
    prisma.ticket.create({
      data: {
        title: 'Dúvida sobre configuração de perfil',
        description: 'Como posso alterar minhas informações de perfil? Não estou conseguindo encontrar a opção no menu.',
        status: 'resolved',
        priority: 'low',
        category: 'question',
        customerId: users[2].id,
        assigneeId: users[1].id
      }
    }),
    prisma.ticket.create({
      data: {
        title: 'Erro crítico no sistema de pagamento',
        description: 'O sistema de pagamento está apresentando erro 500 quando tentamos processar transações. Isso está impactando as vendas.',
        status: 'open',
        priority: 'critical',
        category: 'bug',
        customerId: users[3].id
      }
    }),
    prisma.ticket.create({
      data: {
        title: 'Suporte para integração com API externa',
        description: 'Preciso de ajuda para integrar nossa aplicação com uma API externa. Já li a documentação mas estou com dificuldades.',
        status: 'closed',
        priority: 'medium',
        category: 'support',
        customerId: users[2].id,
        assigneeId: users[1].id
      }
    })
  ])

  // Create comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Obrigado por reportar este problema. Vou investigar e retornar com uma solução.',
        userId: users[1].id,
        ticketId: tickets[0].id,
        isInternal: false
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Identificamos que o problema está relacionado ao cache do navegador. Pode tentar limpar o cache?',
        userId: users[1].id,
        ticketId: tickets[0].id,
        isInternal: false
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Limpei o cache mas o problema persiste. Pode me ajudar de outra forma?',
        userId: users[2].id,
        ticketId: tickets[0].id,
        isInternal: false
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Vou iniciar o desenvolvimento desta funcionalidade. Estimativa de conclusão: 2 semanas.',
        userId: users[1].id,
        ticketId: tickets[1].id,
        isInternal: false
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Para alterar o perfil, acesse Menu > Configurações > Perfil do Usuário.',
        userId: users[1].id,
        ticketId: tickets[2].id,
        isInternal: false
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Perfeito! Consegui alterar as informações. Muito obrigado!',
        userId: users[2].id,
        ticketId: tickets[2].id,
        isInternal: false
      }
    })
  ])

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })