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

  const apiKey = (process.env.RESEND_API_KEY || '').trim();

  if (!apiKey) {
    return res.status(500).json({ success: false, message: 'RESEND_API_KEY ortam değişkeni bulunamadı.' });
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
    const email = body.email || 'Belirtilmedi';
    const phone = body.phone || 'Belirtilmedi';
    const category = body.category || 'Genel';
    const message = body.message || 'Mesaj bırakılmadı.';

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'SNR Web Form <onboarding@resend.dev>',
        to: ['ccanerr936590@gmail.com'],
        subject: `Yeni Teklif Talebi: ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #0f172a; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; line-height: 1.6;">
            <h2 style="color: #0284c7; margin-top: 0; margin-bottom: 8px;">Yeni Teklif Talebi Alındı</h2>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            <p style="margin: 6px 0;"><strong>Ad Soyad:</strong> ${name}</p>
            <p style="margin: 6px 0;"><strong>E-posta:</strong> <a href="mailto:${email}" style="color: #0284c7;">${email}</a></p>
            <p style="margin: 6px 0;"><strong>Telefon:</strong> ${phone}</p>
            <p style="margin: 6px 0;"><strong>İlgilenilen Kategori:</strong> ${category}</p>
            <p style="margin: 12px 0 6px 0;"><strong>Mesaj:</strong></p>
            <div style="background: #f8fafc; padding: 14px; border-left: 4px solid #0284c7; border-radius: 4px; font-size: 14px;">
              ${message}
            </div>
          </div>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ success: false, message: data.message || 'Resend API hatası.' });
    }

    return res.status(200).json({ success: true, message: 'Teklif talebiniz başarıyla iletildi.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Sunucu hatası oluştu.' });
  }
};