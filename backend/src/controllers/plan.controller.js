export const listPlans = (req, res) => {
  res.json([
    {
      id: 'starter',
      name: 'Iniciante',
      price: 29.0,
      currency: 'BRL',
      interval: 'month',
      features: ['1 perfil', 'métricas básicas', '1 reunião/mês'],
    },
    {
      id: 'pro',
      name: 'Profissional',
      price: 59.0,
      currency: 'BRL',
      interval: 'month',
      features: ['5 perfis', 'insights completos', '2 reuniões/mês'],
    },
    {
      id: 'agency',
      name: 'Agência',
      price: 99.0,
      currency: 'BRL',
      interval: 'month',
      features: ['15 perfis', 'relatórios avançados', '4 reuniões/mês'],
    },
  ]);
};
