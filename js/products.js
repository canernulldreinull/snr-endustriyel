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
    image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=600&h=600&q=80"
  },
  {
    id: "kagit-2",
    category: "kagit",
    title: "Kurumsal Tuvalet Kağıdı",
    desc: "Otel, restoran ve ofisler için ideal, yumuşak dokulu ve suda kolay çözünen standart rulo tuvalet kağıdı.",
    code: "HK-TK72",
    badge: "",
    specs: ["Kat: 2 Katlı", "Rulo Uzunluğu: 17 Metre", "Koli İçi: 72 Rulo", "Özellik: Suda çabuk erir"],
    image: "https://images.unsplash.com/photo-1584486520270-19eca1ef4696?auto=format&fit=crop&w=600&h=600&q=80"
  },
  {
    id: "kagit-3",
    category: "kagit",
    title: "Sensörlü Makine Havlusu",
    desc: "Fotoselli dispenserler için özel üretilmiş, yüksek sarfiyatlı alanlara uygun uzun metrajlı, dayanıklı rulo havlu.",
    code: "HK-SM21",
    badge: "Ekonomik",
    specs: ["Genişlik: 21 cm", "Uzunluk: 150 Metre", "Koli İçi: 6 Rulo", "Uyum: Tüm markalarla uyumlu"],
    image: "https://images.unsplash.com/photo-1628189679198-d1dbd89694ce?auto=format&fit=crop&w=600&h=600&q=80"
  },
  {
    id: "kagit-4",
    category: "kagit",
    title: "İçten Çekmeli Rulo Havlu",
    desc: "Mutfak, atölye ve üretim alanlarında pratik kullanım sağlayan, ortadan çekmeli endüstriyel kağıt havlu.",
    code: "HK-IC06",
    badge: "",
    specs: ["Kat: 2 Katlı", "Ağırlık: 1.2 kg / Rulo", "Koli İçi: 6 Rulo", "Kullanım: Merkezi çekim"],
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=600&h=600&q=80"
  },
  {
    id: "kagit-5",
    category: "kagit",
    title: "Mini Jumbo Tuvalet Kağıdı",
    desc: "AVM, hastane ve restoran tuvaletleri için tasarlanmış, sık değiştirme gerektirmeyen büyük boy tasarruflu rulo.",
    code: "HK-MJ12",
    badge: "",
    specs: ["Kat: 2 Katlı", "Uzunluk: 130 Metre", "Koli İçi: 12 Rulo", "Kullanım: Jumbo Dispenser"],
    image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&h=600&q=80"
  },
  {
    id: "kagit-6",
    category: "kagit",
    title: "Endüstriyel Kağıt Bobin",
    desc: "Fabrikalar, oto servisleri ve sanayi tesisleri için yüksek sıvı ve yağ emici güçte ağır hizmet kağıt bobini.",
    code: "HK-EB02",
    badge: "Ağır Hizmet",
    specs: ["Kat: 2 Katlı (Laminasyonlu)", "Ağırlık: 4.5 kg / Bobin", "Koli İçi: 2 Bobin", "Emicilik: Ultra Yüksek"],
    image: "https://images.unsplash.com/photo-1605367332219-48ee12f949c4?auto=format&fit=crop&w=600&h=600&q=80"
  },
  {
    id: "kagit-7",
    category: "kagit",
    title: "Kare Masa Peçetesi (30x30)",
    desc: "Yemekhane, kafe ve restoranlar için ideal, ekonomik tek katlı masa peçetesi. Saf beyaz ve toz bırakmayan yapı.",
    code: "HK-P30",
    badge: "",
    specs: ["Boyut: 30x30 cm", "Kat: Tek Katlı", "Paket: 100 Adet", "Koli İçi: 32 Paket"],
    image: "https://images.unsplash.com/photo-1592650042456-e630e6bc05a8?auto=format&fit=crop&w=600&h=600&q=80"
  },
  {
    id: "kagit-8",
    category: "kagit",
    title: "Muayene Masa Örtüsü",
    desc: "Klinik, hastane ve güzellik merkezleri için perforeli, sıvı geçirmez ve ekstra hijyenik hasta altı masa örtüsü.",
    code: "HK-MM01",
    badge: "Yeni",
    specs: ["Genişlik: 50 cm", "Uzunluk: 50 Metre", "Koli İçi: 12 Rulo", "Yapı: Çift katlı (Kağıt + PE Film)"],
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&h=600&q=80"
  }
];

// Ürünleri Render Etme
function renderProducts(filter = 'kagit') { // Varsayılan olarak kagit kategorisini gösteriyoruz
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
        card.onclick = () => openModal(p);

        card.innerHTML = `
            <div class="relative w-full aspect-square bg-slate-50 overflow-hidden border-b border-slate-100">
                <img src="${p.image}" alt="${p.title}" loading="lazy" class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
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
    if (!modal) return;

    document.getElementById('modal-category').innerText = product.category === 'kagit' ? 'HİJYEN KAĞITLARI' : 'DİĞER';
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

    const wpBtn = document.getElementById('modal-whatsapp');
    const msg = encodeURIComponent(`Merhaba, ${product.code} kodlu "${product.title}" ürünü hakkında toptan fiyat bilgisi almak istiyorum.`);
    wpBtn.href = `https://wa.me/905001234567?text=${msg}`;

    // Modal Açılış Animasyonu
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('opacity-0', 'translate-y-6', 'sm:scale-95');
    });
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const panel = document.getElementById('modal-panel');

    backdrop.classList.add('opacity-0');
    panel.classList.add('opacity-0', 'translate-y-6', 'sm:scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // 0.3s animasyon bekleme süresi
}

// Sayfa Yüklendiğinde Olay Dinleyicileri Ekle
document.addEventListener('DOMContentLoaded', () => {
    // Sayfa açılışında tüm ürünleri (veya sadece kağıtları) listele
    renderProducts('kagit');

    const closeBtn = document.getElementById('modal-close');
    const backdrop = document.getElementById('modal-backdrop');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
});