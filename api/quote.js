const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Yalnızca POST istekleri kabul edilir.' });
  }

  const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
  const supabaseKey = (process.env.SUPABASE_KEY || '').trim();

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Body parse işlemi (string geldiyse JSON'a çevir)
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    body = body || {};

    // Olası tüm alan isimlerini yakala (camelCase veya snake_case)
    const fullName = body.fullName || body.full_name || body.name || '';
    const email = body.email || '';
    const phone = body.phone || body.telefon || '';
    const company = body.company || body.firma || null;
    const service = body.service || body.hizmet || 'Genel';
    const message = body.message || body.mesaj || null;

    if (!fullName || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Lütfen isim ve e-posta alanlarını doldurun.' 
      });
    }

    const { error } = await supabase
      .from('quotes')
      .insert([
        {
          full_name: fullName,
          email: email,
          phone: phone,
          company: company,
          service: service,
          message: message
        }
      ]);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true, message: 'Teklif talebiniz başarıyla alındı.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Sunucu hatası oluştu.' });
  }
};