const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  // CORS Başlıkları
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

  // Ortam değişkenlerini oku ve temizle
  const rawUrl = process.env.SUPABASE_URL || '';
  const rawKey = process.env.SUPABASE_KEY || '';

  const supabaseUrl = rawUrl.replace(/[\n\r\t]/g, '').trim();
  const supabaseKey = rawKey.replace(/[\n\r\t]/g, '').trim();

  if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
    return res.status(500).json({
      success: false,
      message: `Geçersiz SUPABASE_URL: "${supabaseUrl}". Lütfen Vercel panelindeki SUPABASE_URL değerini kontrol edin.`
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { fullName, email, phone, company, service, message } = req.body || {};

    if (!fullName || !email || !phone || !service) {
      return res.status(400).json({ success: false, message: 'Lütfen zorunlu alanları doldurun.' });
    }

    const { error } = await supabase
      .from('quotes')
      .insert([
        {
          full_name: fullName,
          email: email,
          phone: phone,
          company: company || null,
          service: service,
          message: message || null
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