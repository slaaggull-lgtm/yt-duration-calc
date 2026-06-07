[README_TR.md](https://github.com/user-attachments/files/28682584/README_TR.md)
[🇬🇧 For English README click here](README.md)

<div align="center">

# ▶ YT Duration Calc

### YouTube Oynatma Listesi Süre Hesaplayıcı

[![Lisans: MIT](https://img.shields.io/badge/Lisans-MIT-red.svg?style=flat-square)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/tr/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/tr/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/tr/docs/Web/JavaScript)
[![YouTube API](https://img.shields.io/badge/YouTube%20Data%20API-v3-FF0000?style=flat-square&logo=youtube&logoColor=white)](https://developers.google.com/youtube/v3)
[![Sıfır Bağımlılık](https://img.shields.io/badge/Bağımlılık-Sıfır-00C864?style=flat-square)](#)
[![GitHub Pages](https://img.shields.io/badge/Dağıtım-GitHub%20Pages-181717?style=flat-square&logo=github)](https://pages.github.com)

**Herhangi bir YouTube oynatma listesinin toplam süresini hesapla — video bazlı kırılım, oynatma hızı analizi ve CSV dışa aktarımıyla birlikte.**

[🚀 Canlı Demo](https://slaaggull-lgtm.github.io/yt-duration-calc/) · [📖 API Anahtarı Nasıl Alınır?](#-youtube-api-anahtarı-alma) · [🐛 Hata Bildir](../../issues) · [✨ Özellik İste](../../issues)

<br/>

![YT Duration Calc Ekran Görüntüsü](https://via.placeholder.com/900x500/0a0a0f/ff4444?text=YT+Duration+Calc+Ekran+Görüntüsü)

</div>

---

## ✨ Özellikler

| Özellik | Açıklama |
|---|---|
| 🎯 **Tam Liste Analizi** | Otomatik sayfalama ile tüm videoları çeker — liste boyutunda limit yok |
| ⏱ **ISO 8601 Ayrıştırma** | YouTube'un `PT1H23M45S` formatını saniyeye doğru şekilde çevirir |
| ⚡ **Hız Analizi** | 1×, 1.25×, 1.5×, 1.75×, 2× hızlarında kırılım ve kazanılan süre |
| 📋 **Video Başına Tablo** | Her video için hız ayarlı sürelerle ayrıntılı liste |
| 🔍 **Arama ve Sıralama** | Başlığa göre filtrele, süreye veya sıraya göre sırala |
| 📊 **Eğlenceli İstatistikler** | İzlemek için gereken gün, kahve molası sayısı, atlanan uyku döngüleri |
| 📁 **CSV Dışa Aktarım** | Tek tıkla tüm video listesini CSV olarak indir |
| 📋 **Özet Kopyala** | Biçimlendirilmiş düz metin raporunu panoya kopyala |
| 🔒 **Gizlilik Öncelikli** | API anahtarı yalnızca localStorage'da saklanır — YouTube API dışında hiçbir yere gönderilmez |
| 📱 **Duyarlı Tasarım** | Mobil, tablet ve masaüstünde tam çalışır |
| 🌙 **Karanlık Tema** | Göz yormayan, şık karanlık editoryal arayüz |
| ⚡ **Sıfır Bağımlılık** | Saf HTML + CSS + JS — npm yok, bundler yok, framework yok |

---

## 📸 Ekran Görüntüleri

<div align="center">

| Giriş Ekranı | Sonuçlar ve Hız Analizi |
|:---:|:---:|
| ![Giriş](https://via.placeholder.com/420x280/111118/ff4444?text=Giriş+Ekranı) | ![Sonuçlar](https://via.placeholder.com/420x280/111118/ff4444?text=Sonuç+Ekranı) |

</div>

---

## 🚀 Başlangıç

### Ön Koşullar

- Modern bir tarayıcı (Chrome, Firefox, Edge, Safari)
- YouTube Data API v3 anahtarı (ücretsiz — aşağıya bakın)

### 🔑 YouTube API Anahtarı Alma

> Ücretsiz günlük kota (günde 10.000 birim) kişisel kullanım için fazlasıyla yeterli.

1. **[Google Cloud Console](https://console.cloud.google.com)** adresini aç ve Google hesabınla giriş yap.
2. **"Proje Oluştur"** → proje adı gir (örn. `YT Hesaplayıcı`) → **Oluştur**'a tıkla.
3. Sol menüden: **API'ler ve Hizmetler → Kitaplık** yolunu izle.
4. **"YouTube Data API v3"** ara → **Etkinleştir**'e tıkla.
5. **API'ler ve Hizmetler → Kimlik Bilgileri** → **+ KİMLİK BİLGİSİ OLUŞTUR → API Anahtarı**'na tıkla.
6. *(Önerilen)* **Anahtarı Kısıtla**'ya tıkla → API kısıtlamaları altında yalnızca **YouTube Data API v3** seç.
7. Anahtarını kopyala — `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` şeklinde görünür.

### 📦 Kurulum ve Çalıştırma

#### Seçenek A — GitHub Pages (Önerilen, kurulum gerektirmez)
```
1. Bu repoyu fork'la
2. Fork'una git → Ayarlar → Pages
3. Kaynak olarak: Branch: main / root seç
4. Ziyaret et: https://<kullanici-adin>.github.io/yt-duration-calc
```

#### Seçenek B — Yerel Çalıştırma (sunucu gerektirmez)
```bash
# Repoyu klonla
git clone https://github.com/<kullanici-adin>/yt-duration-calc.git

# Klasöre gir
cd yt-duration-calc

# index.html dosyasını tarayıcında aç
# macOS:
open index.html
# Windows:
start index.html
# Linux:
xdg-open index.html
```

> ✅ `npm install` gerekmez, derleme adımı yok, sunucu gerekmez.

---

## 📁 Proje Yapısı

```
yt-duration-calc/
│
├── index.html           # Tek sayfalı uygulama — tüm bölümler, framework yok
│
├── css/
│   └── style.css        # Tam UI stilleri — karanlık tema, duyarlı, animasyonlar
│
├── js/
│   ├── utils.js         # Saf yardımcılar: ISO 8601 ayrıştırma, zaman formatı, hız hesabı
│   ├── api.js           # YouTube Data API v3 sarmalayıcısı (sayfalama, toplu istekler)
│   ├── ui.js            # DOM render: kartları, tabloyu, toast'ı ve CSV dışa aktarımı doldurur
│   └── app.js           # Her şeyi bağlar: olaylar, durum, pipeline yönetimi
│
├── README.md            # İngilizce README
├── README_TR.md         # Bu dosya (Türkçe)
└── LICENSE              # MIT Lisansı
```

---

## 🧮 Teknik Detaylar

### ISO 8601 → Saniye Dönüşümü

YouTube, video sürelerini [ISO 8601 süre formatında](https://en.wikipedia.org/wiki/ISO_8601#Durations) döndürür:

```
PT1H23M45S  →  1 saat, 23 dakika, 45 saniye  →  5025 saniye
PT45M       →  45 dakika                       →  2700 saniye
PT30S       →  30 saniye                       →  30 saniye
```

**Ayrıştırma mantığı (`utils.js`):**
```javascript
function isoToSeconds(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const h = parseInt(match[1] || '0', 10);
  const m = parseInt(match[2] || '0', 10);
  const s = parseInt(match[3] || '0', 10);
  return (h * 3600) + (m * 60) + s;
}
```

### Oynatma Hızı Formülü

```
ayarlanmışSüre = toplamSaniye / hızKatsayısı
kazanılanSüre  = toplamSaniye - ayarlanmışSüre
```

| Hız  | Formül | Örnek (10 saatlik liste) |
|---|---|---|
| 1×   | `36000 / 1.00` | **10s 0d** (temel) |
| 1.25× | `36000 / 1.25` | **8s 0d** (2s kazanır) |
| 1.5× | `36000 / 1.50` | **6s 40d** (3s 20d kazanır) |
| 1.75× | `36000 / 1.75` | **5s 42d** (4s 18d kazanır) |
| 2×   | `36000 / 2.00` | **5s 0d** (5s kazanır) |

### API Mimarisi

```
analyzePlaylist()
  ├── fetchPlaylistMeta()      → 1 API çağrısı  → başlık, kanal, küçük resim
  ├── fetchAllVideoIds()       → N API çağrısı  → sayfalama (sayfa başı 50 öğe)
  │     └── nextPageToken bitene kadar devam eder
  └── fetchVideosDuration()   → N API çağrısı  → toplu istek (istek başı 50 ID)
        └── video ID'lerini 50'lik gruplara böler (API limiti)
```

**API kota tahmini:**
- 1 liste meta çağrısı ≈ 1 birim
- Her video ID sayfası ≈ 1 birim (50 video/sayfa)
- Her süre grubu ≈ 1 birim (50 video/grup)
- 200 videolu bir liste ≈ toplam ~10 birim

---

## ⚙ Yapılandırma

Tüm yapılandırma arayüz üzerinden yapılır — `.env` dosyası gerekmez.

| Ayar | Konum | Kalıcılık |
|---|---|---|
| API Anahtarı | Giriş alanı → "Kaydet" | `localStorage` (yalnızca tarayıcı) |
| Oynatma Listesi URL | Giriş alanı | Oturum başına |

---

## 🤝 Katkıda Bulunma

Katkılar memnuniyetle karşılanır!

```bash
# 1. Repoyu fork'la
# 2. Özellik dalı oluştur
git checkout -b ozellik/harika-ozellik

# 3. Değişikliklerini commit et
git commit -m 'Harika özellik ekle'

# 4. Dalı push'la
git push origin ozellik/harika-ozellik

# 5. Pull Request aç
```

---

## 📄 Lisans

MIT Lisansı altında dağıtılmaktadır. Daha fazla bilgi için [`LICENSE`](LICENSE) dosyasına bakın.

---

## 🙏 Teşekkürler

- [YouTube Data API v3](https://developers.google.com/youtube/v3) — Google
- [Syne](https://fonts.google.com/specimen/Syne) & [DM Mono](https://fonts.google.com/specimen/DM+Mono) — Google Fonts
- [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) süre standardı

---

<div align="center">

❤ ile yapıldı · Faydalıysa lütfen ⭐ ver!

</div>
