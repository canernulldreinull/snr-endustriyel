const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase Bağlantısı
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Teklif Formu Kayıt Endpoint'i
app.post('/api/quote', async (req, res) => {
  const { name, company, phone, category, message } = req.body;

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

    if (error) {
      console.error('Supabase İşlem Hatası:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ success: true, message: 'Teklif talebi başarıyla alındı.' });
  } catch (err) {
    console.error('Sunucu Hatası:', err);
    res.status(500).json({ error: err.message || 'Sunucu tarafında beklenmeyen hata.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor...`);
});