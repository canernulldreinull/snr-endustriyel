const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

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

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    body = body || {};

    const name = body.name || 'Belirtilmedi';
    const company = body.company || 'Belirtilmedi';
    const phone = body.phone || 'Belirtilmedi';
    const category = body.category || 'Genel';
    const message = body.message || 'Mesaj bırakılmadı.';

    const { data, error } = await resend.emails.send({
      from: 'SNR Web Form <onboarding@resend.dev>',
      to: ['ccanerr936590@gmail.com'],
      subject: `Yeni Teklif Talebi: ${name} (${company})`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #0f172a;">
          <h2 style="color: #0284c7;">Yeni Teklif Talebi Alındı</h2>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
          <p><strong>Ad Soyad:</strong> ${name}</p>
          <p><strong>Firma:</strong> ${company}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <p><strong>İlgilenilen Kategori:</strong> ${category}</p>
          <p><strong>Mesaj:</strong></p>
          <blockquote style="background: #f8fafc; padding: 12px; border-left: 4px solid #0284c7; margin: 0;">
            ${message}
          </blockquote>
        </div>
      `
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true, message: 'Teklif talebiniz başarıyla iletildi.' });
  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Sunucu hatası oluştu.' });
  }
};