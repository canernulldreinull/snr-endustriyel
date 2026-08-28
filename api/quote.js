const { createClient } = require('@supabase/supabase-js');

const rawUrl = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
const rawKey = (process.env.SUPABASE_KEY || '').trim();
const supabase = createClient(rawUrl, rawKey);

module.exports = async (req, res) => {
  // CORS başlıkları
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Yalnızca POST istekleri desteklenir.' });
  }

  const { name, company, phone, category, message } = req.body || {};

  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Lütfen zorunlu alanları doldurun.' });
  }

  try {
    const { error } = await supabase
      .from('quotes')
      .insert([{
        name: String(name),
        company: company ? String(company) : null,
        phone: String(phone),
        category: category ? String(category) : null,
        message: String(message),
        status: 'yeni'
      }]);

    if (error) throw error;

    return res.status(200).json({ success: true, message: 'Teklif talebi başarıyla alındı.' });
  } catch (err) {
    console.error('Kayıt Hatası:', err);
    return res.status(500).json({ error: err.message || 'Veritabanı hatası.' });
  }
};