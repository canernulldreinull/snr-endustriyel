// İletişim / WhatsApp Numarası
const WHATSAPP_PHONE = "905335117623";

// ÜRÜN LİSTESİ (products.json'dan dolacak)
let products = [];
let currentCategory = 'all';

// JSON Dosyasından Ürünleri Yükleme
async function initProducts() {
  try {
    const res = await fetch('/products.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        products = data;
      }
    }
  } catch (e) {
    console.warn("products.json okunamadı:", e);
  }
  renderProducts();
}

// ÜRÜNLERİ EKRANA BASMA (Kategori ve Arama Filtreli)
function renderProducts() {
  const grid = document.getElementById('product-grid');
  const resultCount = document.getElementById('result-count');
  const searchInput = document.getElementById('product-search');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  if (!grid) return;

  grid.innerHTML = '';

  // 1. Kategoriye Göre Filtrele
  let filtered = products;
  if (currentCategory !== 'all') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  // 2. Arama Kelimesine Göre Filtrele
  if (query) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.code.toLowerCase().includes(query) ||
      (p.desc && p.desc.toLowerCase().includes(query))
    );
  }

  // Sayı Bildirimi
  if (resultCount) {
    resultCount.innerText = `${filtered.length} ürün listeleniyor`;
  }

  // Sonuç Yoksa
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-span-full py-12 text-center text-slate-500 font-medium">Aradığınız kriterlere uygun ürün bulunamadı.</div>`;
    return;
  }

  // Kartları Bas
  filtered.forEach(p => {
    const badgeHtml = p.badge ? `<span class="absolute top-3 right-3 bg-white/95 backdrop-blur text-brand-dark text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm border border-slate-100">${p.badge}</span>` : '';

    const card = document.createElement('div');
    card.className = 'product-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-cardHover transition-all flex flex-col group cursor-pointer';

    card.addEventListener('click', () => openModal(p));

    card.innerHTML = `
      <div class="relative w-full aspect-square bg-slate-50 overflow-hidden border-b border-slate-100 p-6 flex items-center justify-center">
        <img src="${p.image}" alt="${p.title}" loading="lazy" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" onerror="this.onerror=null; this.src='img/logo.png';" />
        ${badgeHtml}
      </div>
      <div class="p-5 flex flex-col flex-grow">
        <span class="text-[10px] font-mono font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">KOD: ${p.code}</span>
        <h3 class="font-display font-semibold text-ink text-base mb-2 group-hover:text-brand transition-colors">${p.title}</h3>
        <p class="text-sm text-ink-soft line-clamp-2 leading-relaxed">${p.desc || ''}</p>
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
  const waBtn = document.getElementById('modal-whatsapp-btn');

  if (!modal) return;

  if (modalImage) {
    modalImage.src = product.image;
    modalImage.alt = product.title;
    modalImage.onerror = function() {
      this.onerror = null;
      this.src = 'img/logo.png';
    };
  }

  const catNames = {
    'kagit': 'HİJYEN KAĞITLARI',
    'kimyasal': 'TEMİZLİK KİMYASALLARI',
    'sarf': 'SARF MALZEMELER',
    'dispenser': 'EKİPMANLAR & DİSPENSERLER'
  };

  document.getElementById('modal-category').innerText = catNames[product.category] || 'ÜRÜN DETAYI';
  document.getElementById('modal-title').innerText = product.title;
  document.getElementById('modal-desc').innerText = product.desc || '';
  document.getElementById('modal-code').innerText = product.code;

  if (waBtn) {
    const message = encodeURIComponent(`Merhaba SNR Endüstriyel, "${product.title}" (${product.code}) ürünü hakkında toptan fiyat ve detaylı bilgi almak istiyorum.`);
    waBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
  }

  const badge = document.getElementById('modal-badge');
  if (product.badge) {
    badge.innerText = product.badge;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }

  const specsUl = document.getElementById('modal-specs');
  specsUl.innerHTML = '';
  const specsList = Array.isArray(product.specs) ? product.specs : [];
  specsList.forEach(spec => {
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
  initProducts();

  // Canlı Arama Input Dinleyicisi
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderProducts();
    });
  }

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

        currentCategory = cat.id;
        renderProducts();
      });
      filterBar.appendChild(btn);
    });
  }

  // Üst Kategori Kutuları
  document.querySelectorAll('[data-main-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-main-category');
      currentCategory = cat;
      renderProducts();
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
      currentCategory = cat;
      renderProducts();
      const katalog = document.getElementById('katalog');
      if (katalog) katalog.scrollIntoView({ behavior: 'smooth' });

      document.querySelectorAll('.filter-chip').forEach(c => {
        if (c.getAttribute('data-category') === cat) c.click();
      });
    });
  });
});
// Arama çubuğunu global dinle (Her durumda yakalar)
document.addEventListener('input', (e) => {
  if (e.target && e.target.id === 'product-search') {
    renderProducts();
  }
});