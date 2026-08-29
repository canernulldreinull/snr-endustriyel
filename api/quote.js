const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

module.exports = async (req, res) => {
  // CORS başlıkları
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

  if (!supabase) {
    return res.status(500).json({ 
      success: false, 
      message: 'Supabase bağlantı bilgileri (Environment Variables) eksik veya hatalı.' 
    });
  }

  try {
    const { fullName, email, phone, company, service, message } = req.body || {};

    if (!fullName || !email || !phone || !service) {
      return res.status(400).json({ success: false, message: 'Lütfen zorunlu alanları doldurun.' });
    }

    const { data, error } = await supabase
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