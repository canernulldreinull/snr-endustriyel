// ÜRÜN VERİTABANI
const products = [
  // --- 1. HİJYEN KAĞITLARI ---
  {
    id: "kagit-1",
    category: "kagit",
    title: "Premium Z-Katlama Havlu",
    desc: "Yüksek emiciliğe sahip, %100 selüloz çift katlı havlu. Elde dağılma yapmaz, tüm standart dispenserlerle uyumludur.",
    code: "HK-Z200",
    badge: "Çok Satan",
    specs: ["Kat: 2 Katlı", "Yaprak: 200 Adet/Paket", "Koli İçi: 12 Paket", "Hammadde: %100 Saf Selüloz"],
    image: "img/kagit-1.jpg"
  },
  {
    id: "kagit-2",
    category: "kagit",
    title: "Kurumsal Tuvalet Kağıdı",
    desc: "Otel, restoran ve ofisler için ideal, yumuşak dokulu ve suda kolay çözünen standart rulo tuvalet kağıdı.",
    code: "HK-TK72",
    badge: "",
    specs: ["Kat: 2 Katlı", "Rulo Uzunluğu: 17 Metre", "Koli İçi: 72 Rulo", "Özellik: Suda çabuk erir"],
    image: "img/kagit-2.jpg"
  },
  {
    id: "kagit-3",
    category: "kagit",
    title: "Sensörlü Makine Havlusu",
    desc: "Fotoselli dispenserler için özel üretilmiş, yüksek sarfiyatlı alanlara uygun uzun metrajlı, dayanıklı rulo havlu.",
    code: "HK-SM21",
    badge: "Ekonomik",
    specs: ["Genişlik: 21 cm", "Uzunluk: 150 Metre", "Koli İçi: 6 Rulo", "Uyum: Tüm fotoselli cihazlar"],
    image: "img/kagit-3.jpg"
  },
  {
    id: "kagit-4",
    category: "kagit",
    title: "İçten Çekmeli Rulo Havlu",
    desc: "Mutfak, atölye ve üretim alanlarında pratik kullanım sağlayan, ortadan çekmeli endüstriyel kağıt havlu.",
    code: "HK-IC06",
    badge: "",
    specs: ["Kat: 2 Katlı", "Ağırlık: 1.2 kg / Rulo", "Koli İçi: 6 Rulo", "Kullanım: Merkezi çekim"],
    image: "img/kagit-4.jpg"
  },
  {
    id: "kagit-5",
    category: "kagit",
    title: "Mini Jumbo Tuvalet Kağıdı",
    desc: "AVM, hastane ve restoran tuvaletleri için tasarlanmış, sık değiştirme gerektirmeyen büyük boy tasarruflu rulo.",
    code: "HK-MJ12",
    badge: "",
    specs: ["Kat: 2 Katlı", "Uzunluk: 130 Metre", "Koli İçi: 12 Rulo", "Kullanım: Jumbo Dispenser"],
    image: "img/kagit-5.jpg"
  },
  {
    id: "kagit-6",
    category: "kagit",
    title: "Endüstriyel Kağıt Bobin",
    desc: "Fabrikalar, oto servisleri ve sanayi tesisleri için yüksek sıvı ve yağ emici güçte ağır hizmet kağıt bobini.",
    code: "HK-EB02",
    badge: "Ağır Hizmet",
    specs: ["Kat: 2 Katlı (Laminasyonlu)", "Ağırlık: 4.5 kg / Bobin", "Koli İçi: 2 Bobin", "Emicilik: Ultra Yüksek"],
    image: "img/kagit-6.jpg"
  },
  {
    id: "kagit-7",
    category: "kagit",
    title: "Kare Masa Peçetesi (30x30)",
    desc: "Yemekhane, kafe ve restoranlar için ideal, ekonomik tek katlı masa peçetesi. Saf beyaz ve toz bırakmayan yapı.",
    code: "HK-P30",
    badge: "",
    specs: ["Boyut: 30x30 cm", "Kat: Tek Katlı", "Paket: 100 Adet", "Koli İçi: 32 Paket"],
    image: "img/kagit-7.jpg"
  },
  {
    id: "kagit-8",
    category: "kagit",
    title: "Muayene Masa Örtüsü",
    desc: "Klinik, hastane ve güzellik merkezleri için perforeli, sıvı geçirmez ve ekstra hijyenik hasta altı masa örtüsü.",
    code: "HK-MM01",
    badge: "Yeni",
    specs: ["Genişlik: 50 cm", "Uzunluk: 50 Metre", "Koli İçi: 12 Rulo", "Yapı: Çift katlı (Kağıt + PE Film)"],
    image: "img/kagit-8.jpg"
  },

  // --- 2. TEMİZLİK KİMYASALLARI ---
  {
    id: "kimyasal-1",
    category: "kimyasal",
    title: "Endüstriyel Ultra Kıvamlı Çamaşır Suyu",
    desc: "Geniş yüzeyler, zeminler ve sıhhi alanlar için yoğun formüllü, maksimum hijyen sağlayan klor bazlı ağartıcı.",
    code: "KM-CS20",
    badge: "Çok Satan",
    specs: ["Hacim: 20 Litre", "Formül: Yoğun Kıvamlı Klor", "pH Değeri: 12 - 13", "Kullanım: Seyreltilerek uygulanır"],
    image: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "kimyasal-2",
    category: "kimyasal",
    title: "Ağır Kir ve Yağ Sökücü",
    desc: "Endüstriyel mutfaklar, fırınlar, ızgaralar ve zeminlerdeki yanmış, donmuş yağları hızla çözen alkali temizleyici.",
    code: "KM-YS05",
    badge: "Güçlü Formül",
    specs: ["Hacim: 5 Litre", "Koli İçi: 4 Adet", "pH Değeri: 13 - 14", "Uygulama: Mutfak, Fırın, Davlumbaz"],
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "kimyasal-3",
    category: "kimyasal",
    title: "Genel Yüzey Temizleyici (Lavanta / Çam)",
    desc: "Mermer, fayans, seramik ve granit zeminlerde leke bırakmadan parlaklık sağlayan kalıcı kokulu yüzey deterjanı.",
    code: "KM-YT20",
    badge: "",
    specs: ["Hacim: 20 Litre", "Koku: Lavanta Esanslı", "Özellik: Durulama gerektirmez", "pH Değeri: Nötr (6.5 - 7.5)"],
    image: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "kimyasal-4",
    category: "kimyasal",
    title: "Antibakteriyel Köpük El Sabunu Kartuşu",
    desc: "Cildi kurutmayan nemlendirici formüllü, yüksek tasarruf sağlayan lüks köpük sabun dolum solüsyonu.",
    code: "KM-KS05",
    badge: "Ekonomik",
    specs: ["Hacim: 5 Litre", "Koli İçi: 4 Adet", "Özellik: Gliserin katkılı, E vitamini", "Sarfiyat: Sıvı sabuna göre %50 tasarruf"],
    image: "https://images.unsplash.com/photo-1608248597359-bb5839218d6e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "kimyasal-5",
    category: "kimyasal",
    title: "Sanayi Tipi Otomat Zemin Yıkama Sıvısı",
    desc: "Binicili ve itmeli zemin yıkama makinelerinde köpürme yapmayan, fabrikalar ve depolar için geliştirilmiş zemin sıvısı.",
    code: "KM-ZY20",
    badge: "Endüstriyel",
    specs: ["Hacim: 20 Litre", "Özellik: Köpüksüz formül", "Kullanım: Zemin yıkama otomatları", "Etki: Ağır forklift izlerini söker"],
    image: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "kimyasal-6",
    category: "kimyasal",
    title: "Kireç ve Pas Sökücü Asidik Temizleyici",
    desc: "Kireç bağlamış lavabo, klozet, batarya ve fayans aralarını aşındırmadan temizleyen güçlü mineral çözücü.",
    code: "KM-KP05",
    badge: "",
    specs: ["Hacim: 5 Litre", "Koli İçi: 4 Adet", "pH: 1 - 2 (Asidik)", "Kullanım: Islak hacimler ve inşaat sonrası"],
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80"
  },

  // --- 3. SARF MALZEMELER ---
  {
    id: "sarf-1",
    category: "sarf",
    title: "Endüstriyel Battal Boy Çöp Torbası (80x110)",
    desc: "Geri dönüştürülebilir dayanıklı polietilen hammaddeden üretilmiş, tabandan sızdırmaz kaynaklı çöp poşeti.",
    code: "SR-CP80",
    badge: "Çok Satan",
    specs: ["Ölçü: 80 x 110 cm (Battal)", "Paket İçi: 10 Rulo (100 Adet)", "Koli Ağırlığı: 8 kg", "Renk: Siyah"],
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sarf-2",
    category: "sarf",
    title: "Hantal / Konteyner Çöp Torbası (100x120)",
    desc: "Ağır sanayi atıkları, bahçe ve inşaat molozları için ekstra kalın mukavemete sahip endüstriyel torba.",
    code: "SR-CP100",
    badge: "Ekstra Kalın",
    specs: ["Ölçü: 100 x 120 cm (Hantal)", "Mikron: 70 Mikron (Ağır Hizmet)", "Koli İçi: 100 Adet", "Özellik: Yırtılma dirençli"],
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sarf-3",
    category: "sarf",
    title: "Mikrofiber Temizlik Bezi (40x40 cm - 5 Renk)",
    desc: "Toz ve suyu iz bırakmadan hapseden, çamaşır makinesinde yıkanabilir kurumsal renk kodlu mikrofiber bezler.",
    code: "SR-MB40",
    badge: "Renkli Kodlama",
    specs: ["Ölçü: 40 x 40 cm", "Ağırlık: 300 GSM", "Paket İçi: 10'lu Paket", "Renkler: Mavi, Kırmızı, Sarı, Yeşil, Beyaz"],
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sarf-4",
    category: "sarf",
    title: "Pudra Seviyesi Sıfır Nitril Muayene Eldiveni",
    desc: "Gıda üretimi, temizlik ve medikal kullanıma uygun, lateks içermeyen alerji yapmaz mavi nitril eldiven.",
    code: "SR-NE100",
    badge: "Gıda Uyumlu",
    specs: ["Beden: S / M / L / XL", "Kutu İçi: 100 Adet", "Koli İçi: 10 Kutu (1000 Adet)", "Malzeme: %100 Nitril"],
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sarf-5",
    category: "sarf",
    title: "Endüstriyel Islak Mop Paspas (350 gr)",
    desc: "Yüksek su emiciliğine sahip pamuk/polyester karışımlı iplikten üretilmiş vidalı ve geçmeli paspas ucu.",
    code: "SR-MP350",
    badge: "",
    specs: ["Ağırlık: 350 Gram", "İplik: %70 Pamuk, %30 Sentetik", "Koli İçi: 25 Adet", "Uyum: Standart mop aparatları"],
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80"
  },

  // --- 4. EKİPMANLAR & DİSPENSERLER ---
  {
    id: "dispenser-1",
    category: "dispenser",
    title: "Sensörlü Fotoselli Kağıt Havlu Dispenseri",
    desc: "Pilli veya adaptörlü çalışabilen, yaprak boyu ayarlanabilir hijyenik temassız otomatik havlu makinesi.",
    code: "EK-FH01",
    badge: "Çok Satan",
    specs: ["Çalışma: 4x D Boy Pil / 220V Adaptör", "Rulo Genişliği: 21 cm", "Kasa: Darbeye dayanıklı ABS", "Garanti: 2 Yıl"],
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "dispenser-2",
    category: "dispenser",
    title: "Çift Kovalı Presli Temizlik Arabası (25L + 25L)",
    desc: "Temiz ve kirli suyu ayıran çift kovalı, ergonomik dikey presli, tekerlekli profesyonel kat arabası.",
    code: "EK-CA50",
    badge: "Sağlam Kasa",
    specs: ["Kapasite: 2 x 25 Litre (50L Toplam)", "Gövde: Paslanmaz Çelik Şasi + ABS Kova", "Pres: Ağır hizmet dikey sıkma", "Teker: 360° Döner Sessiz Kauçuk"],
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "dispenser-3",
    category: "dispenser",
    title: "Paslanmaz Krom Z-Katlama Havluluk",
    desc: "304 kalite mat paslanmaz çelikten üretilmiş, kilit mekanizmalı şık ve dayanıklı Z-havlu dispenseri.",
    code: "EK-ZH304",
    badge: "Inox Paslanmaz",
    specs: ["Malzeme: 304 Kalite Mat Paslanmaz Çelik", "Kapasite: 400 Yaprak", "Kilit: Anahtarlı emniyet kilidi", "Montaj: Duvara monte vida kiti dahil"],
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "dispenser-4",
    category: "dispenser",
    title: "Otomatik Sensörlü Sıvı / Dezenfektan Dispenseri",
    desc: "Giriş alanları, yemekhaneler ve tuvaletler için temassız pilli sıvı sabun ve jel dezenfektan makinesi.",
    code: "EK-SD10",
    badge: "Temassız",
    specs: ["Hacim: 1000 ml Hazne", "Sensör Mesafesi: 5 - 10 cm", "Dozaj: 1 ml / Basım", "Çalışma: 4 Adet AA Kalem Pil"],
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=600&q=80"
  }
];

// ÜRÜNLERİ EKRANA BASMA VE FİLTRELEME
function renderProducts(category = 'all') {
    const grid = document.getElementById('product-grid');
    const resultCount = document.getElementById('result-count');
    if (!grid) return;

    grid.innerHTML = '';
    
    let filtered = products;
    if (category !== 'all') {
        filtered = products.filter(p => p.category === category);
    }

    if (resultCount) {
        resultCount.innerText = `${filtered.length} ürün listeleniyor`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-12 text-center text-slate-500 font-medium">Bu kategoride henüz ürün bulunmuyor.</div>`;
        return;
    }

    filtered.forEach(p => {
        const badgeHtml = p.badge ? `<span class="absolute top-3 right-3 bg-white/95 backdrop-blur text-brand-dark text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm border border-slate-100">${p.badge}</span>` : '';

        const card = document.createElement('div');
        card.className = 'product-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-cardHover transition-all flex flex-col group cursor-pointer';
        
        card.addEventListener('click', () => {
            openModal(p);
        });

        card.innerHTML = `
            <div class="relative w-full aspect-square bg-slate-50 overflow-hidden border-b border-slate-100 p-6 flex items-center justify-center">
                <img src="${p.image}" alt="${p.title}" loading="lazy" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                ${badgeHtml}
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <span class="text-[10px] font-mono font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">KOD: ${p.code}</span>
                <h3 class="font-display font-semibold text-ink text-base mb-2 group-hover:text-brand transition-colors">${p.title}</h3>
                <p class="text-sm text-ink-soft line-clamp-2 leading-relaxed">${p.desc}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// MODAL AÇMA
function openModal(product) {
    const modal = document.getElementById('product-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const panel = document.getElementById('modal-panel');
    const modalImage = document.getElementById('modal-image');
    
    if (!modal) return;

    if (modalImage) {
        modalImage.src = product.image;
        modalImage.alt = product.title;
    }

    const catNames = { 
        'kagit': 'HİJYEN KAĞITLARI', 
        'kimyasal': 'TEMİZLİK KİMYASALLARI', 
        'sarf': 'SARF MALZEMELER', 
        'dispenser': 'EKİPMANLAR & DİSPENSERLER' 
    };
    
    document.getElementById('modal-category').innerText = catNames[product.category] || 'ÜRÜN DETAYI';
    document.getElementById('modal-title').innerText = product.title;
    document.getElementById('modal-desc').innerText = product.desc;
    document.getElementById('modal-code').innerText = product.code;

    const badge = document.getElementById('modal-badge');
    if (product.badge) {
        badge.innerText = product.badge;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }

    const specsUl = document.getElementById('modal-specs');
    specsUl.innerHTML = '';
    product.specs.forEach(spec => {
        specsUl.innerHTML += `
            <li class="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                <span class="text-slate-500">${spec.split(':')[0]}:</span>
                <span class="font-medium text-ink">${spec.split(':')[1] || ''}</span>
            </li>
        `;
    });

    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    
    requestAnimationFrame(() => {
        if (backdrop) backdrop.classList.remove('opacity-0');
        if (panel) panel.classList.remove('opacity-0', 'translate-y-8', 'scale-95');
    });
}

// MODAL KAPATMA
function closeModal() {
    const modal = document.getElementById('product-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const panel = document.getElementById('modal-panel');

    if (!modal) return;

    if (backdrop) backdrop.classList.add('opacity-0');
    if (panel) panel.classList.add('opacity-0', 'translate-y-8', 'scale-95');
    
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.add('hidden');
    }, 300);
}

// SAYFA YÜKLENİNCE
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('all');

    // Filtre Çubuğu
    const filterBar = document.getElementById('filter-bar');
    if (filterBar) {
        const categories = [
            { id: 'all', name: 'Tüm Ürünler' },
            { id: 'kagit', name: 'Hijyen Kağıtları' },
            { id: 'kimyasal', name: 'Kimyasallar' },
            { id: 'sarf', name: 'Sarf Malzemeler' },
            { id: 'dispenser', name: 'Ekipmanlar' }
        ];

        filterBar.innerHTML = '';
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `filter-chip px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${cat.id === 'all' ? 'bg-brand text-white border-brand' : 'bg-white text-ink border-slate-200 hover:border-brand'}`;
            btn.innerText = cat.name;
            btn.setAttribute('data-category', cat.id);
            if (cat.id === 'all') btn.setAttribute('data-active', 'true');

            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-chip').forEach(c => {
                    c.setAttribute('data-active', 'false');
                    c.className = 'filter-chip px-4 py-2 rounded-xl text-xs font-semibold border bg-white text-ink border-slate-200 hover:border-brand';
                });
                btn.setAttribute('data-active', 'true');
                btn.className = 'filter-chip px-4 py-2 rounded-xl text-xs font-semibold border bg-brand text-white border-brand';
                
                const titleEl = document.getElementById('katalog-title');
                if (titleEl) titleEl.innerText = cat.name;

                renderProducts(cat.id);
            });
            filterBar.appendChild(btn);
        });
    }

    // Üst Kategori Kutuları
    document.querySelectorAll('[data-main-category]').forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-main-category');
            renderProducts(cat);
            const katalog = document.getElementById('katalog');
            if (katalog) katalog.scrollIntoView({ behavior: 'smooth' });
            
            document.querySelectorAll('.filter-chip').forEach(c => {
                if (c.getAttribute('data-category') === cat) c.click();
            });
        });
    });

    // Footer Kategori Linkleri
    document.querySelectorAll('[data-footer-filter]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = link.getAttribute('data-footer-filter');
            renderProducts(cat);
            const katalog = document.getElementById('katalog');
            if (katalog) katalog.scrollIntoView({ behavior: 'smooth' });

            document.querySelectorAll('.filter-chip').forEach(c => {
                if (c.getAttribute('data-category') === cat) c.click();
            });
        });
    });
});