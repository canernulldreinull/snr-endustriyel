const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'gizli_anahtar';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik Dosyalar (Frontend ve Yüklenen Resimler)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Uploads ve Data klasörlerini oluştur
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
if (!fs.existsSync('./data')) fs.mkdirSync('./data');

// Veritabanı Bağlantısı (SQLite)
const db = new sqlite3.Database('./data/database.sqlite', (err) => {
    if (err) console.error('DB Bağlantı Hatası:', err);
    else console.log('SQLite Veritabanı Bağlandı.');
});

// Tabloları Oluştur
db.serialize(() => {
    // Ürünler Tablosu
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        code TEXT NOT NULL,
        badge TEXT,
        desc TEXT,
        specs TEXT,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Admin Kullanıcısı Tablosu
    db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`, () => {
        // Varsayılan Admin Hesabı Ekle (Yoksa)
        const checkAdmin = "SELECT * FROM admins WHERE username = 'admin'";
        db.get(checkAdmin, async (err, row) => {
            if (!row) {
                const hash = await bcrypt.hash('admin123', 10);
                db.run("INSERT INTO admins (username, password) VALUES (?, ?)", ['admin', hash]);
                console.log("Varsayılan Admin Hesabı Oluşturuldu: admin / admin123");
            }
        });
    });
});

// Multer Görsel Yükleme Ayarı
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// JWT Yetki Kontrol Middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ success: false, message: 'Yetkisiz erişim. Token gerekli.' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ success: false, message: 'Geçersiz veya süresi dolmuş token.' });
        req.adminId = decoded.id;
        next();
    });
};

// ================= API ROTLARI =================

// 1. Admin Giriş (Login)
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM admins WHERE username = ?", [username], async (err, user) => {
        if (err || !user) return res.status(400).json({ success: false, message: 'Kullanıcı bulunamadı.' });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ success: false, message: 'Hatalı şifre.' });

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ success: true, token });
    });
});

// 2. Herkese Açık: Ürünleri Listele (Frontend İçin)
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        
        // specs alanını JSON formatına geri parse et
        const formatted = rows.map(r => ({
            ...r,
            specs: r.specs ? JSON.parse(r.specs) : []
        }));
        res.json(formatted);
    });
});

// 3. Admin: Yeni Ürün Ekle
app.post('/api/admin/products', verifyToken, upload.single('image'), (req, res) => {
    const { title, category, code, badge, desc, specs } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : 'img/logo.png';
    
    // specs bir dizi string olarak gelir
    const specsJson = typeof specs === 'string' ? JSON.stringify(specs.split('\n').filter(s => s.trim())) : JSON.stringify(specs || []);

    const query = `INSERT INTO products (title, category, code, badge, desc, specs, image) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [title, category, code, badge || '', desc || '', specsJson, image], function(err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, productId: this.lastID, message: 'Ürün başarıyla eklendi.' });
    });
});

// 4. Admin: Ürün Sil
app.delete('/api/admin/products/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    
    // Önce eski görseli silmek için ürünün resim yolunu al
    db.get("SELECT image FROM products WHERE id = ?", [id], (err, row) => {
        if (row && row.image && row.image.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, row.image);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        db.run("DELETE FROM products WHERE id = ?", [id], (err) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, message: 'Ürün silindi.' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor.`);
});