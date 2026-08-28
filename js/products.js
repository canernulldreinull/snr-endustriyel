/**
 * js/products.js
 * SNR Endüstriyel Temizlik Ürünleri — Ürün Veri Katmanı
 */

// Kategori İkonları (Tasarımdaki şık duruşu korumak için)
const ICONS = {
  kagit: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>`,
  kimyasal: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L4.2 14.5m15.6 15.3l-1.57-.393a9.065 9.065 0 00-6.23-.693m0 0A9.065 9.065 0 014.2 14.5M12 15v8.25" /></svg>`,
  sarf: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>`,
  dispenser: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>`
};

const categories = [
  { id: "all", label: "Tüm Ürünler" },
  { id: "kagit", label: "Hijyen Kağıtları" },
  { id: "kimyasal", label: "Temizlik Kimyasalları" },
  { id: "sarf", label: "Sarf Malzemeleri" },
  { id: "dispenser", label: "Dispenser & Ekipman" }
];

// Claude'un verisinin tasarıma entegre edilmiş hali
const products = [
  // HİJYEN VE TEMİZLİK KAĞITLARI
  { id: 1, title: "Z Katlı Dispenser Kağıt Havlu", category: "kagit", categoryLabel: "Hijyen Kağıtları", code: "SNR-K01", desc: "%100 saf selüloz, çift katlı, yüksek emiciliğe sahip hijyenik havlu.", specs: ["200 Yaprak / Paket", "Koli İçi: 12 Paket", "Çift Katlı %100 Selüloz"], badge: "Toptan Satış", icon: ICONS.kagit },
  { id: 2, title: "Hareketli Rulo Havlu (Maxi)", category: "kagit", categoryLabel: "Hijyen Kağıtları", code: "SNR-K02", desc: "Endüstriyel mutfak ve üretim alanları için yüksek kapasiteli rulo havlu.", specs: ["6 Rulo / Koli", "150 mt / Rulo", "Tek Katlı Yüksek Emicilik"], badge: "", icon: ICONS.kagit },
  { id: 3, title: "Mini Jumbo Tuvalet Kağıdı", category: "kagit", categoryLabel: "Hijyen Kağıtları", code: "SNR-K03", desc: "Yoğun kullanılan ortak alanlar için uzun ömürlü, iç içe geçmeli rulo.", specs: ["12 Rulo / Koli", "150 mt / Rulo", "İki Katlı, Kokusuz"], badge: "Çok Satan", icon: ICONS.kagit },
  { id: 4, title: "İçten Çekmeli Kağıt Havlu", category: "kagit", categoryLabel: "Hijyen Kağıtları", code: "SNR-K04", desc: "Ofis ve mutfak tezgahları için tek tek çekilebilen pratik havlu sistemi.", specs: ["150 Yaprak / Paket", "Koli İçi: 20 Paket", "V veya Z Katlama Uyumlu"], badge: "", icon: ICONS.kagit },
  { id: 5, title: "V Katlı Kağıt Peçete", category: "kagit", categoryLabel: "Hijyen Kağıtları", code: "SNR-K05", desc: "Restoran ve kafeler için standart boy, dayanıklı sofra peçetesi.", specs: ["100 Yaprak / Paket", "Koli İçi: 36 Paket", "33x33 cm"], badge: "", icon: ICONS.kagit },
  { id: 6, title: "Kutu Mendil (Yumuşak Doku)", category: "kagit", categoryLabel: "Hijyen Kağıtları", code: "SNR-K06", desc: "Resepsiyon ve ofis masaları için üç katlı yumuşak dokulu kutu mendil.", specs: ["100 Yaprak / Kutu", "Koli İçi: 24 Kutu", "Üç Katlı"], badge: "", icon: ICONS.kagit },
  { id: 7, title: "İç İçe Geçmeli Kağıt Havlu", category: "kagit", categoryLabel: "Hijyen Kağıtları", code: "SNR-K07", desc: "Standart havlu dispenserleri ile uyumlu, ekonomik lavabo havlusu.", specs: ["200 Yaprak / Paket", "Koli İçi: 20 Paket", "Tek Katlı"], badge: "Ekonomik", icon: ICONS.kagit },
  { id: 8, title: "Endüstriyel Silme Bezi Rulo", category: "kagit", categoryLabel: "Hijyen Kağıtları", code: "SNR-K08", desc: "Atölye ve üretim hatlarında yağ/kir silme için yüksek mukavemetli rulo.", specs: ["500 Yaprak / Rulo", "Perforeli Kesim", "Yüksek Emicilik"], badge: "", icon: ICONS.kagit },

  // DETERJAN VE TEMİZLİK KİMYASALLARI
  { id: 9, title: "Endüstriyel Sıvı El Sabunu", category: "kimyasal", categoryLabel: "Temizlik Kimyasalları", code: "SNR-D01", desc: "Nötr pH, cilt dostu formül; yoğun kullanım alanları için ekonomik ambalaj.", specs: ["5 L Bidon", "Nötr pH", "Dermatolojik Test Onaylı"], badge: "Toptan Satış", icon: ICONS.kimyasal },
  { id: 10, title: "Genel Yüzey Temizleyici", category: "kimyasal", categoryLabel: "Temizlik Kimyasalları", code: "SNR-D02", desc: "Tüm yıkanabilir yüzeylerde kullanılan, hızlı kirleşmeyi önleyen konsantre çözelti.", specs: ["5 L Bidon", "1:100 Dilüsyon Oranı", "Ferah Koku"], badge: "", icon: ICONS.kimyasal },
  { id: 11, title: "Yağ Çözücü Endüstriyel", category: "kimyasal", categoryLabel: "Temizlik Kimyasalları", code: "SNR-D03", desc: "Mutfak davlumbaz, ocak ve üretim ekipmanlarındaki inatçı yağları çözer.", specs: ["5 L Bidon", "Yüksek Alkali Formül", "Hızlı Etki"], badge: "Güçlü Etki", icon: ICONS.kimyasal },
  { id: 12, title: "Kireç ve Pas Sökücü", category: "kimyasal", categoryLabel: "Temizlik Kimyasalları", code: "SNR-D04", desc: "Banyo, mutfak ve endüstriyel tesisatlardaki kireç birikintilerini giderir.", specs: ["5 L Bidon", "Asidik Formül", "Paslanmaz Yüzey Uyumlu"], badge: "", icon: ICONS.kimyasal },
  { id: 13, title: "Klorlu Çamaşır Suyu (Yoğun)", category: "kimyasal", categoryLabel: "Temizlik Kimyasalları", code: "SNR-D05", desc: "Dezenfeksiyon ve ağartma amaçlı yüksek konsantrasyonlu hijyen ürünü.", specs: ["5 L Bidon", "%5 Aktif Klor", "Geniş Yüzey Kullanımı"], badge: "", icon: ICONS.kimyasal },
  { id: 14, title: "Bulaşık Makinesi Deterjanı (Toz)", category: "kimyasal", categoryLabel: "Temizlik Kimyasalları", code: "SNR-D06", desc: "Endüstriyel bulaşık makineleri için leke bırakmayan yüksek performanslı toz deterjan.", specs: ["10 kg Kova", "Sert Suya Uygun", "Parlatıcı Takviyeli"], badge: "Çok Satan", icon: ICONS.kimyasal },
  { id: 15, title: "Zemin Bakım ve Cilalama", category: "kimyasal", categoryLabel: "Temizlik Kimyasalları", code: "SNR-D07", desc: "Mermer, seramik ve granit zeminlerde parlaklık ve koruma sağlayan bakım ürünü.", specs: ["5 L Bidon", "Kaymaz Formül", "Yüksek Parlaklık"], badge: "", icon: ICONS.kimyasal },
  { id: 16, title: "Endüstriyel Çamaşır Yumuşatıcısı", category: "kimyasal", categoryLabel: "Temizlik Kimyasalları", code: "SNR-D08", desc: "Otel ve çamaşırhaneler için yoğun kullanım kapasiteli konsantre yumuşatıcı.", specs: ["5 L Bidon", "Uzun Süreli Koku", "Konsantre Formül"], badge: "", icon: ICONS.kimyasal },
  { id: 17, title: "Yüzey Dezenfektanı", category: "kimyasal", categoryLabel: "Temizlik Kimyasalları", code: "SNR-D09", desc: "Sağlık kuruluşları ve gıda üretim alanları için hızlı etkili dezenfektan.", specs: ["5 L Bidon", "%70 Alkol Bazlı", "Ruhsatlı Ürün"], badge: "Sertifikalı", icon: ICONS.kimyasal },

  // SARF MALZEMESİ VE TEMİZLİK EKİPMANLARI
  { id: 18, title: "Endüstriyel Çöp Torbası", category: "sarf", categoryLabel: "Sarf Malzemeleri", code: "SNR-S01", desc: "Yırtılmaya dayanıklı, yoğun atık toplama alanları için geniş hacimli torba.", specs: ["100x120 cm", "25 Adet / Rulo", "Extra Kalın Şerit"], badge: "Jumbo Boy", icon: ICONS.sarf },
  { id: 19, title: "Ayak Pedallı Çöp Konteyneri", category: "sarf", categoryLabel: "Sarf Malzemeleri", code: "SNR-S02", desc: "Hijyenik, temassız kullanım sağlayan pedallı iç mekan çöp kovası.", specs: ["50 Litre Hacim", "Plastik Gövde", "Sessiz Kapak"], badge: "", icon: ICONS.sarf },
  { id: 20, title: "Mikrofiber Mop Takımı", category: "sarf", categoryLabel: "Sarf Malzemeleri", code: "SNR-S03", desc: "Geniş alan zemin temizliğinde hız ve verim sağlayan profesyonel mop seti.", specs: ["Mikrofiber Başlık", "Teleskopik Sap", "Yıkanabilir Yapı"], badge: "", icon: ICONS.sarf },
  { id: 21, title: "İkili Kovalı Temizlik Arabası", category: "sarf", categoryLabel: "Sarf Malzemeleri", code: "SNR-S04", desc: "Otel ve AVM koridorlarında hızlı ve organize temizlik için katlı araba.", specs: ["25+25 L Çift Kova", "Mop Presi Dahil", "Sepet ve Torba Bölmesi"], badge: "Toptan Satış", icon: ICONS.sarf },
  { id: 22, title: "Mikrofiber Temizlik Bezi", category: "sarf", categoryLabel: "Sarf Malzemeleri", code: "SNR-S05", desc: "Çizik bırakmayan, yüksek emicilikte çok amaçlı silme bezi seti.", specs: ["10 Adet / Paket", "40x40 cm", "Tüy Bırakmaz"], badge: "", icon: ICONS.sarf },
  { id: 23, title: "Endüstriyel Paspas Seti", category: "sarf", categoryLabel: "Sarf Malzemeleri", code: "SNR-S06", desc: "Ağır kirli zeminler ve dış mekanlar için dayanıklı iplik paspas.", specs: ["400 gr Ağırlık", "Metal Bağlantı Aparatı", "Yüksek Emicilik"], badge: "", icon: ICONS.sarf },
  { id: 24, title: "Nitril Eldiven Seti", category: "sarf", categoryLabel: "Sarf Malzemeleri", code: "SNR-S07", desc: "Kimyasal temizlik uygulamalarında kullanılan kişisel koruyucu ekipman.", specs: ["100 Adet / Kutu", "Pudrasız Nitril", "S / M / L / XL"], badge: "", icon: ICONS.sarf },

  // ENDÜSTRİYEL TEMİZLİK MAKİNELERİ & DİSPENSERLER
  { id: 25, title: "Sensörlü Otomatik Havlu Dispenseri", category: "dispenser", categoryLabel: "Makine & Dispenser", code: "SNR-M01", desc: "Temassız kullanım sağlayan, pilli sensör teknolojili duvar tipi dispenser.", specs: ["Z Katlı Havlu Uyumlu", "4x C Pil ile Çalışır", "ABS Gövde"], badge: "Garantili", icon: ICONS.dispenser },
  { id: 26, title: "Köpük Sabun Kartuş Vericisi", category: "dispenser", categoryLabel: "Makine & Dispenser", code: "SNR-M02", desc: "Hijyenik ve tasarruflu kullanım sunan kartuşlu köpük sabun dispenseri.", specs: ["1000 ml Kapasite", "Sensörlü Model", "Kilitli Kapak"], badge: "", icon: ICONS.dispenser },
  { id: 27, title: "Zemin Yıkama Makinesi", category: "dispenser", categoryLabel: "Makine & Dispenser", code: "SNR-M03", desc: "Geniş alanlarda hızlı yıkama ve kurutma sağlayan akülü zemin temizleme makinesi.", specs: ["45 L Temiz Su Tankı", "Akülü", "1 Saat Çalışma Süresi"], badge: "Pro Seri", icon: ICONS.dispenser },
  { id: 28, title: "Tek Diskli Cilalama Makinesi", category: "dispenser", categoryLabel: "Makine & Dispenser", code: "SNR-M04", desc: "Mermer ve seramik zeminlerde profesyonel parlatma ve bakım için disk makine.", specs: ["1500 W Motor", "175-200 mm Pad Uyumu", "Ayarlanabilir Sap"], badge: "", icon: ICONS.dispenser },
  { id: 29, title: "Dijital Tuvalet Kağıdı Dispenseri", category: "dispenser", categoryLabel: "Makine & Dispenser", code: "SNR-M05", desc: "İki rulo kapasiteli, otomatik geçişli mini jumbo tuvalet kağıdı dispenseri.", specs: ["İkili Rulo Bölmesi", "Kilit Mekanizması", "Şeffaf Gösterge"], badge: "", icon: ICONS.dispenser },
  { id: 30, title: "Endüstriyel Kuru-Islak Süpürge", category: "dispenser", categoryLabel: "Makine & Dispenser", code: "SNR-M06", desc: "Sıvı ve katı atıkları birlikte toplayabilen yüksek kapasiteli endüstriyel süpürge.", specs: ["30 L Tank Kapasitesi", "1400 W Motor", "Çift Filtre"], badge: "", icon: ICONS.dispenser }
];