const { createClient } = require('@supabase/supabase-js');
const querystring = require('querystring');

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

    // Gelen veriyi her formatta güvenle parse etme
    let payload = req.body;

    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        payload = querystring.parse(payload);
      }
    } else if (Buffer.isBuffer(payload)) {
      const str = payload.toString('utf-8');
      try {
        payload = JSON.parse(str);
      } catch (e) {
        payload = querystring.parse(str);
      }
    }

    payload = payload || {};

    const fullName = payload.fullName || payload.full_name || payload.name || payload.adsoyad || payload['full-name'] || '';
    const email = payload.email || payload.eposta || payload.mail || '';
    const phone = payload.phone || payload.telefon || payload.tel || '';
    const company = payload.company || payload.firma || payload.sirket || null;
    const service = payload.service || payload.hizmet || payload.urun || 'Genel';
    const message = payload.message || payload.mesaj || payload.not || null;

    const { error } = await supabase
      .from('quotes')
      .insert([
        {
          full_name: fullName || 'İsimsiz Gönderi',
          email: email || 'eposta-yok@bilgi.com',
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