/**
 * js/app.js
 * SNR Endüstriyel - Dinamik Görünüm ve Uygulama Mantığı
 */
document.addEventListener("DOMContentLoaded", () => {
  // Mobil Menü
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  menuToggle?.addEventListener("click", () => mobileMenu.classList.toggle("open"));
  document.querySelectorAll(".mobile-link").forEach(link => {
    link.addEventListener("click", () => mobileMenu.classList.remove("open"));
  });

  // Filtreler ve Ürün Yönetimi
  const katalogSection = document.getElementById("katalog");
  const filterBar = document.getElementById("filter-bar");
  const productGrid = document.getElementById("product-grid");
  const resultCount = document.getElementById("result-count");
  const katalogTitle = document.getElementById("katalog-title");
  let currentFilter = "all";

  // YENİ: Başlangıçta katalog bölümünü tamamen gizliyoruz. 
  // Sadece bir kategoriye veya menüden "Tüm Ürünler"e tıklandığında açılacak.
  katalogSection.classList.add("hidden");

  function renderFilters() {
    if (!filterBar) return;
    filterBar.innerHTML = categories.map(cat => {
      const count = cat.id === "all" ? products.length : products.filter(p => p.category === cat.id).length;
      const isActive = currentFilter === cat.id;
      return `
        <button type="button" data-filter="${cat.id}" 
                class="filter-chip inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-ink-soft transition-colors ${isActive ? '!bg-brand !text-white !border-brand' : 'hover:border-brand'}">
          <span>${cat.label}</span>
          <span class="inline-flex items-center justify-center min-w-[1.35rem] h-[1.35rem] px-1 rounded-full text-[11px] font-mono font-semibold ${isActive ? 'bg-white/20 text-white' : 'bg-base-100 text-ink-soft'}">${count}</span>
        </button>
      `;
    }).join("");

    document.querySelectorAll(".filter-chip").forEach(btn => {
      btn.addEventListener("click", (e) => {
        currentFilter = e.currentTarget.dataset.filter;
        renderFilters();
        renderProducts();
      });
    });
  }

  function renderProducts() {
    if (!productGrid) return;
    const filtered = currentFilter === "all" ? products : products.filter(p => p.category === currentFilter);
    const catLabel = categories.find(c => c.id === currentFilter)?.label || "Tüm Ürünler";
    
    if (katalogTitle) katalogTitle.textContent = catLabel;
    if (resultCount) resultCount.textContent = `${filtered.length} ürün bulundu`;
    
    productGrid.innerHTML = filtered.map(product => `
      <article class="product-card group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-card overflow-hidden flex flex-col h-full">
        <div class="flex items-center justify-between px-4 pt-4">
          <span class="font-mono text-[11px] font-semibold text-ink-soft bg-base-100 rounded px-2 py-1">${product.code}</span>
          ${product.badge ? `<span class="font-mono text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">${product.badge}</span>` : ""}
        </div>
        <div class="tag-perforation h-px mx-4 mt-3"></div>
        <div class="p-4 flex flex-col flex-1">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 shrink-0 rounded-lg bg-brand-50 text-brand p-2">${product.icon}</div>
            <div class="min-w-0">
              <span class="text-[10px] font-mono font-semibold text-brand-dark uppercase tracking-wide">${product.categoryLabel}</span>
              <h3 class="font-display font-semibold text-sm leading-snug text-ink mt-0.5">${product.title}</h3>
            </div>
          </div>
          <p class="mt-3 text-[13px] text-ink-soft leading-relaxed flex-1 line-clamp-2">${product.desc}</p>
          <button type="button" onclick="openModal(${product.id})" class="mt-4 w-full bg-base-50 hover:bg-brand hover:text-white text-ink font-semibold text-[13px] py-2 rounded-lg border border-slate-200 hover:border-brand transition-colors">
            İncele
          </button>
        </div>
      </article>
    `).join("");
  }

  // YENİ: Kataloğu Görünür Yapma ve Kaydırma Fonksiyonu
  function openCatalog(category = "all") {
    currentFilter = category;
    katalogSection.classList.remove("hidden"); // Gizliliği kaldır
    renderFilters();
    renderProducts();
    // DOM'un güncellenmesi için ufak bir gecikme ile kaydır
    setTimeout(() => {
      katalogSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  // 1. Ana sayfadaki büyük kategori kartlarına tıklanınca
  document.querySelectorAll("[data-main-category]").forEach(box => {
    box.addEventListener("click", (e) => {
      openCatalog(e.currentTarget.dataset.mainCategory);
    });
  });

  // 2. Üst menü veya Footer'daki linklere tıklanınca (Tüm ürünler veya alt kategoriler)
  document.querySelectorAll('a[href="#katalog"]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetCategory = e.currentTarget.dataset.footerFilter || "all";
      openCatalog(targetCategory);
    });
  });

  // Modal İşlemleri
  const modal = document.getElementById("product-modal");
  const backdrop = document.getElementById("modal-backdrop");
  const panel = document.getElementById("modal-panel");
  
  window.openModal = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById("modal-icon").innerHTML = product.icon;
    document.getElementById("modal-category").textContent = product.categoryLabel;
    document.getElementById("modal-title").textContent = product.title;
    document.getElementById("modal-code").textContent = product.code;
    document.getElementById("modal-desc").textContent = product.desc;

    const badgeEl = document.getElementById("modal-badge");
    if (product.badge) { badgeEl.textContent = product.badge; badgeEl.classList.remove("hidden"); } 
    else { badgeEl.classList.add("hidden"); }

    document.getElementById("modal-specs").innerHTML = product.specs.map(s => `<li class="text-sm text-ink-soft border-b border-slate-100 pb-2 last:border-0">• ${s}</li>`).join("");

    const waText = encodeURIComponent(`Merhaba, ${product.title} (Kod: ${product.code}) ürünü için fiyat alabilir miyim?`);
    document.getElementById("modal-whatsapp").href = `https://wa.me/905001234567?text=${waText}`;

    modal.classList.remove("hidden");
    setTimeout(() => {
      backdrop.classList.remove("opacity-0");
      panel.classList.remove("opacity-0", "translate-y-6", "sm:scale-95");
    }, 10);
  };

  window.closeModal = () => {
    backdrop.classList.add("opacity-0");
    panel.classList.add("opacity-0", "translate-y-6", "sm:scale-95");
    setTimeout(() => modal.classList.add("hidden"), 300);
  };

  document.getElementById("modal-close")?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);

  // İletişim Formu - Gerçek API Bağlantısı ve Bildirim
  const form = document.getElementById("quote-form");
  const success = document.getElementById("form-success");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    const fd = new FormData(form);
    const payload = {
      name: fd.get("name")?.toString().trim(),
      company: fd.get("company")?.toString().trim() || null,
      phone: fd.get("phone")?.toString().trim(),
      category: fd.get("category")?.toString().trim() || null,
      message: fd.get("message")?.toString().trim()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Gönderiliyor...";

    try {
      const apiUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3000/api/quote"
  : "/api/quote";

const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        success.textContent = "Talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.";
        success.removeAttribute("class");
        success.setAttribute("class", "mt-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-lg block");
        form.reset();
      } else {
        throw new Error(result.error || "Bir hata oluştu.");
      }
    } catch (err) {
      success.textContent = err.message || "Teklif gönderilemedi. Lütfen WhatsApp üzerinden bize ulaşın.";
      success.removeAttribute("class");
      success.setAttribute("class", "mt-3 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg block");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      setTimeout(() => {
        success.className = "hidden mt-3 text-sm p-3 rounded-lg";
      }, 6000);
    }
  });

  // Dinamik Yıl Gösterimi
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Sayfa kaydırıldığında header ve logoyu orantılı küçültme
  const header = document.getElementById("main-header");
  const headerContainer = document.getElementById("header-container");
  const logo = document.getElementById("main-logo");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      // Kaydırılınca: Şeffaf zemin + kompakt header + orantılı küçülen logo
      header.classList.remove("bg-white/95", "border-slate-200");
      header.classList.add("bg-white/80", "backdrop-blur-md", "shadow-sm", "border-slate-200/60");
      
      headerContainer.classList.remove("h-20", "sm:h-24");
      headerContainer.classList.add("h-16", "sm:h-16");

      if (logo) {
        logo.classList.remove("h-14", "sm:h-20");
        logo.classList.add("h-11", "sm:h-12");
      }
    } else {
      // En tepede: Orijinal dolgun boyutlar
      header.classList.add("bg-white/95", "border-slate-200");
      header.classList.remove("bg-white/80", "backdrop-blur-md", "shadow-sm", "border-slate-200/60");
      
      headerContainer.classList.add("h-20", "sm:h-24");
      headerContainer.classList.remove("h-16", "sm:h-16");

      if (logo) {
        logo.classList.add("h-14", "sm:h-20");
        logo.classList.remove("h-11", "sm:h-12");
      }
    }
  });