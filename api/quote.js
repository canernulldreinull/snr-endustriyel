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

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    body = body || {};

    const fullName = body.name || body.fullName || 'İsimsiz';
    const company = body.company || null;
    const phone = body.phone || '';
    const service = body.category || body.service || 'Genel';
    const message = body.message || null;

    const { error } = await supabase
      .from('quotes')
      .insert([
        {
          full_name: fullName,
          company: company,
          phone: phone,
          service: service,
          message: message
        }
      ]);

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true, message: 'Teklif talebiniz başarıyla alındı.' });
  } catch (err) {
    console.error('Catch Error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Sunucu hatası oluştu.' });
  }
};