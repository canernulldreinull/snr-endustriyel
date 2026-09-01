// İletişim / WhatsApp Numarası
const WHATSAPP_PHONE = "905335117623";

let allProducts = [];
let activeCategory = 'all';

// Türkçe Karakter Uyumlu Arama Fonksiyonu
function normalizeText(text) {
  return (text || '')
    .toString()
    .toLocaleLowerCase('tr-TR')
    .trim();
}

// JSON Dosyasından Ürünleri Yükleme
async function initProducts() {
  try {
    const res = await fetch('/products.json?v=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allProducts = data;
      }
    }
  } catch (e) {
    console.warn("products.json okunamadı:", e);
  }
  renderCatalog();
}

// Ürünleri Listeleme ve Çift Yönlü Filtreleme
function renderCatalog() {
  const grid = document.getElementById('product-grid');
  const resultCount = document.getElementById('result-count');
  const searchInput = document.getElementById('product-search');
  const query = searchInput ? normalizeText(searchInput.value) : '';

  if (!grid) return;

  // Filtreleme: Hem Kategori Hem Canlı Arama
  let filtered = allProducts.filter(p => {
    const matchCategory = (activeCategory === 'all') || (p.category === activeCategory);
    
    if (!query) return matchCategory;

    const title = normalizeText(p.title);
    const code = normalizeText(p.code);
    const desc = normalizeText(p.desc);

    const matchQuery = title.includes(query) || code.includes(query) || desc.includes(query);
    return matchCategory && matchQuery;
  });

  if (resultCount) {
    resultCount.innerText = `${filtered.length} ürün listeleniyor`;
  }

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <p class="text-slate-500 font-medium text-base mb-2">Aradığınız kriterlere uygun ürün bulunamadı.</p>
        <button type="button" onclick="clearFilters()" class="text-xs font-semibold text-brand hover:underline">Filtreleri Temizle</button>
      </div>`;
    return;
  }

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

// Filtreleri Temizleme Butonu İçin
window.clearFilters = function() {
  const searchInput = document.getElementById('product-search');
  if (searchInput) searchInput.value = '';
  const allBtn = document.querySelector('[data-category="all"]');
  if (allBtn) allBtn.click();
  else {
    activeCategory = 'all';
    renderCatalog();
  }
};

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

  const modalCat = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalCode = document.getElementById('modal-code');
  const badge = document.getElementById('modal-badge');
  const specsUl = document.getElementById('modal-specs');

  if (modalCat) modalCat.innerText = catNames[product.category] || 'ÜRÜN DETAYI';
  if (modalTitle) modalTitle.innerText = product.title;
  if (modalDesc) modalDesc.innerText = product.desc || '';
  if (modalCode) modalCode.innerText = product.code;

  if (waBtn) {
    const message = encodeURIComponent(`Merhaba SNR Endüstriyel, "${product.title}" (${product.code}) ürünü hakkında toptan fiyat ve detaylı bilgi almak istiyorum.`);
    waBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
  }

  if (badge) {
    if (product.badge) {
      badge.innerText = product.badge;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  if (specsUl) {
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
  }

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

// SAYFA YÜKLENDİĞİNDE
document.addEventListener('DOMContentLoaded', () => {
  initProducts();

  // Arama Girişi Dinleyicisi
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderCatalog();
    });
  }

  // MOBİL MENÜ OTOMATİK KAPANMA KONTROLÜ
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  if (menuToggle && mobileMenu) {
    // Menü açma/kapama butonu
    menuToggle.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      if (iconOpen && iconClose) {
        iconOpen.classList.toggle('hidden', !isHidden);
        iconClose.classList.toggle('hidden', isHidden);
      }
    });

    // Menüdeki herhangi bir linke tıklandığında menüyü kapat
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (iconOpen && iconClose) {
          iconOpen.classList.remove('hidden');
          iconClose.classList.add('hidden');
        }
      });
    });
  }

  // Filtre Çipleri
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

        activeCategory = cat.id;
        renderCatalog();
      });
      filterBar.appendChild(btn);
    });
  }

  // Üst Kategori Kutuları
  document.querySelectorAll('[data-main-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-main-category');
      const chip = document.querySelector(`.filter-chip[data-category="${cat}"]`);
      if (chip) chip.click();
      const katalog = document.getElementById('katalog');
      if (katalog) katalog.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Footer Kategori Linkleri
  document.querySelectorAll('[data-footer-filter]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.getAttribute('data-footer-filter');
      const chip = document.querySelector(`.filter-chip[data-category="${cat}"]`);
      if (chip) chip.click();
      const katalog = document.getElementById('katalog');
      if (katalog) katalog.scrollIntoView({ behavior: 'smooth' });
    });
  });
});