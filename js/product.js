let products = [];

// API'den Ürünleri Çek ve Ekrana Bas
async function fetchProducts() {
    try {
        const res = await fetch('/api/products');
        products = await res.json();
        renderProducts('all');
    } catch (err) {
        console.error('Ürünler yüklenemedi:', err);
    }
}

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
                <img src="${p.image}" alt="${p.title}" loading="lazy" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" onerror="this.onerror=null; this.src='img/logo.png';" />
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

// Modal Açma / Kapama fonksiyonları aynı şekilde kalır...
function openModal(product) {
    const modal = document.getElementById('product-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const panel = document.getElementById('modal-panel');
    const modalImage = document.getElementById('modal-image');
    
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
    const specsArray = Array.isArray(product.specs) ? product.specs : [];
    specsArray.forEach(spec => {
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

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    // Filtre butonları ve kategori linkleri dinleyicileri
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
});