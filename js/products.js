// Ürün Veritabanı
const products = [
  {
    id: "kagit-1",
    category: "kagit",
    title: "Premium Z-Katlama Havlu",
    desc: "Yüksek emiciliğe sahip, %100 selüloz çift katlı havlu. Elde dağılma yapmaz, tüm dispenserlerle uyumludur.",
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
    specs: ["Genişlik: 21 cm", "Uzunluk: 150 Metre", "Koli İçi: 6 Rulo", "Uyum: Tüm markalarla uyumlu"],
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
  }
];

// Ürünleri Ekrana Basma
function renderProducts(filter = 'kagit') { 
    const grid = document.getElementById('product-grid');
    const resultCount = document.getElementById('result-count');
    if (!grid) return;

    grid.innerHTML = '';
    
    let filtered = products;
    if (filter !== 'all') {
        filtered = products.filter(p => p.category === filter);
    }

    if (resultCount) {
        resultCount.innerText = `${filtered.length} ürün listeleniyor`;
    }

    filtered.forEach(p => {
        const badgeHtml = p.badge ? `<span class="absolute top-3 right-3 bg-white/95 backdrop-blur text-brand-dark text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm border border-slate-100">${p.badge}</span>` : '';

        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-cardHover transition-all flex flex-col group cursor-pointer';
        
        // Tıklama olayını garantilemek için eventListener kullanıyoruz
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

// Modal (Pop-up) İşlemleri
function openModal(product) {
    const modal = document.getElementById('product-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const panel = document.getElementById('modal-panel');
    const modalImage = document.getElementById('modal-image');
    
    if (!modal) return;

    // Fotoğrafı kocaman ekrana ver
    if (modalImage) {
        modalImage.src = product.image;
        modalImage.alt = product.title;
    }

    // Metinleri Doldur
    document.getElementById('modal-category').innerText = product.category === 'kagit' ? 'HİJYEN KAĞITLARI' : 'DİĞER';
    document.getElementById('modal-title').innerText = product.title;
    document.getElementById('modal-desc').innerText = product.desc;
    document.getElementById('modal-code').innerText = product.code;

    // Rozet Kontrolü
    const badge = document.getElementById('modal-badge');
    if (product.badge) {
        badge.innerText = product.badge;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }

    // Özellikleri (Specs) Ekle
    const specsUl = document.getElementById('modal-specs');
    specsUl.innerHTML = '';
    product.specs.forEach(spec => {
        specsUl.innerHTML += `
            <li class="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0 text-sm">
                <span class="text-slate-500">${spec.split(':')[0]}:</span>
                <span class="font-medium text-ink">${spec.split(':')[1] || ''}</span>
            </li>
        `;
    });

    // WhatsApp Linkini Hazırla
    const wpBtn = document.getElementById('modal-whatsapp');
    const msg = encodeURIComponent(`Merhaba, ${product.code} kodlu "${product.title}" ürünü hakkında toptan fiyat bilgisi almak istiyorum.`);
    wpBtn.href = `https://wa.me/905001234567?text=${msg}`;

    // Modal'ı Göster (Sınıfları temizle ve ekle)
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Animasyonu tetiklemek için ufak bir gecikme
    requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('opacity-0', 'translate-y-8', 'scale-95');
    });
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const panel = document.getElementById('modal-panel');

    // Animasyonu geri sar
    backdrop.classList.add('opacity-0');
    panel.classList.add('opacity-0', 'translate-y-8', 'scale-95');
    
    // Animasyon bittikten sonra gizle
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

// Olay Dinleyicileri (Sayfa Yüklenince)
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('kagit');
    
    const closeBtn = document.getElementById('modal-close');
    const backdrop = document.getElementById('modal-backdrop');
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
});