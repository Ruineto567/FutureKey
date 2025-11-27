import InstagramUser from '../models/InstagramUser.js';

// Lista empresas (usuários) com filtro opcional
export async function listInstagramUsers(req, res) {
  try {
    const { q } = req.query;
    const filter = q
      ? {
          $or: [
            { username: { $regex: q, $options: 'i' } },
            { companyName: { $regex: q, $options: 'i' } }
          ]
        }
      : {};

    const users = await InstagramUser.find(filter)
      .select('username companyName profileImage posts')
      .sort({ username: 1 })
      .limit(50);

    return res.json({ users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ message: 'Erro interno', error: error.message });
  }
}

// Busca um usuário específico
export async function getInstagramUser(req, res) {
  try {
    const { username } = req.params;
    const user = await InstagramUser.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    return res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ message: 'Erro interno', error: error.message });
  }
}

// Atualiza dados do usuário (perfil e posts)
export async function updateInstagramUser(req, res) {
  try {
    const { username } = req.params;
    const { username: newUsername, companyName, profileImage, posts } = req.body;

    const user = await InstagramUser.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    if (newUsername && newUsername !== username) {
      const exists = await InstagramUser.findOne({ username: newUsername });
      if (exists) return res.status(409).json({ message: 'Username já está em uso' });
      user.username = newUsername;
    }

    if (typeof companyName === 'string') user.companyName = companyName;
    if (typeof profileImage === 'string') user.profileImage = profileImage;
    if (Array.isArray(posts)) user.posts = posts;

    await user.save();
    return res.json({ message: 'Dados atualizados com sucesso', user });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro interno', error: error.message });
  }
}

// Cria ou atualiza via seed (usado para cadastro rápido)
export async function seedInstagramData(req, res) {
  try {
    const { username, posts, companyName = '', profileImage = '' } = req.body;

    if (!username || !posts) {
      return res.status(400).json({ message: 'Username e posts são obrigatórios' });
    }

    const existing = await InstagramUser.findOne({ username });

    if (existing) {
      existing.posts = posts;
      if (typeof companyName === 'string') existing.companyName = companyName;
      if (typeof profileImage === 'string') existing.profileImage = profileImage;
      await existing.save();
      return res.status(200).json({ message: 'Dados atualizados com sucesso' });
    }

    const newUser = new InstagramUser({ username, posts, companyName, profileImage });
    await newUser.save();

    return res.status(201).json({ message: 'Dados criados com sucesso' });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ message: 'Erro interno', error: error.message });
  }
}

// Rota para análise dos posts
export async function getInstagramAnalytics(req, res) {
  const { username } = req.params;

  try {
    const user = await InstagramUser.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const posts = user.posts;

    if (!posts || posts.length === 0) {
      return res.status(200).json({ message: 'Usuário não possui posts' });
    }

    const totalPosts = posts.length;
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);
    const avgLikes = Math.round(totalLikes / totalPosts);
    const avgComments = Math.round(totalComments / totalPosts);
    const engajamentoMedio = avgLikes + avgComments;

    const mediaCount = posts.reduce((acc, post) => {
      const type = post.mediaType || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    const mostUsedMediaType = Object.entries(mediaCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const createdAtDates = posts.map(p => new Date(p.createdAt));
    const oldest = new Date(Math.min(...createdAtDates));
    const newest = new Date(Math.max(...createdAtDates));
    const diffDays = (newest - oldest) / (1000 * 60 * 60 * 24) || 1;
    const postsPerWeek = (posts.length / diffDays) * 7;
    const weeklyGoalPercent = Math.min(100, Math.round((postsPerWeek / 3) * 100));

    const best = posts
      .map(post => {
        const createdAt = new Date(post.createdAt);
        const dayOfWeekUTC = createdAt.getUTCDay();
        const hourUTC = createdAt.getUTCHours();
        const score = (post.likes || 0) + (post.comments || 0);
        return { dayOfWeekUTC, hourUTC, score };
      })
      .reduce((acc, curr) => {
        const key = `${curr.dayOfWeekUTC}-${curr.hourUTC}`;
        if (!acc[key]) {
          acc[key] = { ...curr, count: 1 };
        } else {
          acc[key].score += curr.score;
          acc[key].count += 1;
        }
        return acc;
      }, {});

    const bestPostTime = Object.values(best)
      .map(item => ({
        dayOfWeekUTC: item.dayOfWeekUTC,
        hourUTC: item.hourUTC,
        scoreAvg: item.score / item.count,
      }))
      .sort((a, b) => b.scoreAvg - a.scoreAvg)[0];

    return res.json({
      username,
      totalPosts,
      avgLikes,
      avgComments,
      engajamentoMedio,
      mostUsedMediaType,
      weeklyGoalPercent,
      posts,
      best: bestPostTime,
      _source: "banco de dados"
    });

  } catch (error) {
    console.error('Erro ao calcular métricas:', error);
    return res.status(500).json({ message: 'Erro interno', error: error.message });
  }
}
