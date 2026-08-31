const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Statik Dosyalar (Public klasöründeki index.html, img ve js)
app.use(express.static(path.join(__dirname, '../public')));

// Supabase Bağlantısı
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const JWT_SECRET = process.env.JWT_SECRET || 'snr_temizlik_jwt_gizli_anahtar_2026';

// JWT Token Doğrulama Middleware
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Yetkisiz erişim. Token bulunamadı.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Geçersiz veya süresi dolmuş token.' });
    req.user = user;
    next();
  });
};

// ==========================================
// 1. MEVCUT TEKLİF FORMU ENDPOINT'İ (DEĞİŞTİRİLMEDİ)
// ==========================================
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

// ==========================================
// 2. ADMİN GİRİŞİ (LOGIN)
// ==========================================
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign({ role: 'admin', username }, JWT_SECRET, { expiresIn: '12h' });
    return res.json({ success: true, token });
  }

  return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
});

// ==========================================
// 3. ÜRÜN LİSTELEME (HERKESE AÇIK)
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Ürün Çekme Hatası:', err);
    res.status(500).json({ error: 'Ürünler yüklenirken bir hata oluştu.' });
  }
});

// ==========================================
// 4. ADMİN: YENİ ÜRÜN EKLE
// ==========================================
app.post('/api/admin/products', verifyAdminToken, async (req, res) => {
  const { title, category, code, badge, desc, specs, image } = req.body;

  if (!title || !category || !code) {
    return res.status(400).json({ error: 'Başlık, kategori ve ürün kodu zorunludur.' });
  }

  try {
    const specsArray = Array.isArray(specs) ? specs : (specs ? specs.split('\n').filter(s => s.trim()) : []);

    const { data, error } = await supabase
      .from('products')
      .insert([{
        title: String(title),
        category: String(category),
        code: String(code),
        badge: badge ? String(badge) : null,
        desc: desc ? String(desc) : null,
        specs: specsArray,
        image: image || 'img/logo.png'
      }])
      .select();

    if (error) throw error;
    res.json({ success: true, product: data[0] });
  } catch (err) {
    console.error('Ürün Ekleme Hatası:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. ADMİN: ÜRÜN SİL
// ==========================================
app.delete('/api/admin/products/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Ürün başarıyla silindi.' });
  } catch (err) {
    console.error('Ürün Silme Hatası:', err);
    res.status(500).json({ error: err.message });
  }
});

// Sunucuyu Başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor...`);
});