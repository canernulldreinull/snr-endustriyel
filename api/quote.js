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

    const fullName = payload.fullName || payload.full_name || payload.name || payload.adsoyad || 'İsimsiz';
    const email = payload.email || payload.eposta || payload.mail || 'eposta@bilgi.com';
    const phone = payload.phone || payload.telefon || '';
    const company = payload.company || payload.firma || null;
    const service = payload.service || payload.hizmet || 'Genel';
    const message = payload.message || payload.mesaj || null;

    const { data, error } = await supabase
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
      console.error('SUPABASE DB ERROR:', error);
      return res.status(500).json({ 
        success: false, 
        message: `Supabase Hatası: ${error.message} (Kod: ${error.code})` 
      });
    }

    return res.status(200).json({ success: true, message: 'Teklif talebiniz başarıyla alındı.' });
  } catch (err) {
    console.error('SERVER CATCH ERROR:', err);
    return res.status(500).json({ 
      success: false, 
      message: `Sunucu Hatası: ${err.message}` 
    });
  }
};