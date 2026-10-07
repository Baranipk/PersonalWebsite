# Portfolyo sitesi: proje özeti ve çalışma kuralları

Bu dosya projenin ne olduğunu, hangi kararların verildiğini ve işin hangi sırayla yapılacağını anlatır. Kararlar kullanıcıyla konuşularak verildi; değiştirmeden önce kullanıcıya sor.

## Proje sahibi ve çalışma biçimi

- Proje sahibi dijital oyun tasarımı bölümü 4. sınıf öğrencisi ve başlangıç seviyesinde bir geliştirici. Web geliştirmede yeni.
- Onunla Türkçe konuş. Yaptığın her adımı kısaca açıkla: ne yaptın, neden yaptın, kendisi nasıl çalıştırır.
- Kodu sade tut. Kullanıcının okuyup değiştirebileceği bir yapı, akıllıca ama anlaşılması zor bir yapıdan daha değerli. Gereksiz bağımlılık ve soyutlama ekleme.
- Kod içindeki kısa açıklama yorumlarını Türkçe yaz.
- Bilgisayarı Windows. Komutları PowerShell'de çalışacak biçimde ver.
- Repo aynı zamanda işverenlerin bakabileceği bir portfolyo parçası: küçük ve anlamlı commit'ler at. Kullanıcı istemeden push yapma.

## Amaç

Kullanıcının CV'sine ekleyeceği kişisel bir oyun geliştirici portfolyosu. Sitenin iki işi var:

1. Oyun projelerini oynanış videoları ve görsellerle göstermek.
2. Kullanıcının tarayıcıdan yazabildiği bir blog (devlog, game jam değerlendirmesi, tasarım analizi).

Hedef kitle oyun stüdyoları ve işe alım yapan kişiler. İçerik dili İngilizce olacak şekilde planlandı (sektör uluslararası); kullanıcı Türkçe isterse arayüz metinleri kolayca değiştirilebilir olmalı, bu yüzden arayüz metinlerini dağınık bırakma.

## Doldurulacak bilgiler

Bunlar henüz bilinmiyor. Gerektiği anda kullanıcıya sor, tahmin etme:

- GitHub kullanıcı adı ve repo adı (yönetim paneli ayarı için `kullanici/repo`)
- Domain adresi (`astro.config.mjs` içindeki `site` değeri için)
- Kullanıcının adı, unvanı, e-posta adresi, sosyal bağlantıları
- VDS işletim sistemi ve sürümü (Ubuntu LTS önerilmişti, doğrulanmadı)

## Verilen kararlar

| Konu | Karar | Neden |
|---|---|---|
| Site türü | Statik site, **Astro** ile üretilir | Veritabanı ve backend yok; hızlı, güvenli, bakımı kolay |
| İçerik nerede durur | Markdown dosyaları olarak **GitHub reposunda** | Kullanıcı tüm verinin ve sürüm geçmişinin GitHub'da olmasını istiyor; repo aynı zamanda yedek |
| Blog yazma | Sitede `/admin` adresinde **Git tabanlı yönetim paneli** (Sveltia CMS) | Kullanıcı yazıları tarayıcıdan, Markdown düzenler gibi yazmak istiyor |
| Barındırma | Kullanıcının **kendi VDS'i** | Kullanıcı VDS ve domain satın aldı; site GitHub Pages'te değil, VDS'te çalışacak |
| Videolar | **YouTube**'da liste dışı (unlisted) videolar, siteye gömülü oynatıcı | Videolar repoya ve sunucuya yüklenmez |
| Görseller | Panelden yüklenir, repoda içeriğin yanında durur | Astro derleme sırasında küçültür |
| Yayın | `main` dalına push → GitHub Actions derler → VDS'e kopyalar | Sürüm kontrolü GitHub'da kalır |

Veritabanlı dinamik bir yapı (Node.js + SQLite, kendi yönetim paneli) da konuşuldu ve kullanıcı Git tabanlı paneli seçti. Dinamik yapıya geçme.

### Akış

```
Kullanıcının bilgisayarı (geliştirme)
        │  git push
        ▼
GitHub reposu (kod + yazılar + görseller, sürüm geçmişi)
        │  GitHub Actions: npm ci, npm run build, dist/ klasörünü SSH ile kopyala
        ▼
VDS (Caddy, statik dosyaları HTTPS ile sunar)

Yönetim paneli (/admin): kullanıcı yazıyı kaydeder → panel repoya commit atar → aynı akış çalışır
```

Panelden yayınlanan yazı sitede bir iki dakika sonra görünür; bu bilinen ve kabul edilen bir sonuç.

## Mevcut durum

- Repo: `Baranipk/PersonalWebsite` (bilgisayarda `D:\Website\PersonalWebsite`).
- 1–4. aşamalar tamamlandı (Ekim 2026). Site yerelde çalışıyor, tema seçildi.
- 4. aşamada denenmeyen tek şey: panelden görsel yükleme (dosyanın içeriğin yanına kaydedilmesi). Kullanıcı ilk kez görsel yüklediğinde dosyanın yerini ve derlemeyi kontrol et.
- Panelde denenmeyen bir şey daha: başlıkta `ı` harfi olan içeriğin klasör adı (`slug.encoding: ascii`) `i`'ye mi dönüşüyor, siliniyor mu?
- Bilinen davranış: içerikte şemaya uymayan bir alan varsa `npm run dev` hiç açılmaz; panel de açılmaz. Terminaldeki hatayı oku.
- Domain ve VDS satın alındı, henüz hiçbir kurulum yapılmadı. Sıradaki iş 5. aşama, kullanıcı "VDS'e geçelim" deyince.
- Domain: `baranipek.com` (7 Ekim 2026'da Atak Domain'den alındı). Ad sunucuları `ns1/ns2.hostingdunyam.net`, ama o sunucularda henüz DNS bölgesi yok (sorgular REFUSED). DNS adımında Hostingdünyam panelinde bölge ve A kaydı açılmalı.
- Hâlâ bilinmeyenler: kullanıcının adı ve unvanı (YouTube kanalında "Baran İpek" görünüyor, doğrulanmadı), e-posta, VDS IP adresi ve işletim sistemi.

## Teknik notlar (Ekim 2026'da doğrulandı)

**Astro**
- Güncel sürüm 7.x (7.3.6 ile denendi). Node.js 22.12.0 ya da üstü gerekir; tek sayılı sürümler (23 gibi) desteklenmez.
- Kurulum: `npm create astro@latest`. Repo klasöründe zaten `README.md` ve `.gitignore` var; sihirbaz sorun çıkarırsa elle kur (`npm install astro`, `package.json` içine `dev`, `build`, `preview` komutları).
- İçerik koleksiyonları `src/content.config.ts` içinde tanımlanır: `defineCollection` (`astro:content`), `glob` (`astro/loaders`), `z` (`astro/zod`). Görsellerin küçültülmesi için şemada `image()` kullan.
- `.gitignore` dosyasına `.astro/` ve `dist/` ekle.

**Sveltia CMS (yönetim paneli)**
- Hâlâ beta (0.231 sürümü görüldü) ve tek bir geliştiricinin projesi. Ayar dosyası Decap CMS ile büyük ölçüde uyumlu; sorun çıkarsa Decap yedek seçenek.
- Kurulum iki dosyadan ibaret: `public/admin/index.html` ve `public/admin/config.yml`. HTML dosyasında yalnızca şu script olur:
  `<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>`
  CSS `<link>` ekleme, script'e `type="module"` ekleme; ikisi de bilinen hatalar.
- Astro geliştirme sunucusu `public` altındaki klasörler için `index.html` dosyasını otomatik sunmaz. Geliştirirken adres `http://localhost:4321/admin/index.html`; derlenmiş sitede `/admin/` çalışır.
- Astro için önerilen düzen, her içeriğin kendi klasöründe durması:
  ```yaml
  output:
    omit_empty_optional_fields: true   # yoksa boş alanlar Astro şemasında hata verir
  collections:
    - name: blog
      folder: src/content/blog
      path: '{{slug}}/index'           # src/content/blog/yazi-adi/index.md
      media_folder: ''                 # görseller yazının yanına kaydedilir
      public_folder: ''
  ```
  Böylece görseller yazının klasöründe durur ve şemadaki `image()` ile küçültülür. Bu düzende içerik kimliğinin klasör adı olarak geldiğini derleyerek doğrula.
- Yerel çalışma: Chrome ya da Edge'de paneli aç, "Work with Local Repository" düğmesine bas, proje kök klasörünü seç. Panel dosyaları doğrudan diske yazar, GitHub girişi gerekmez, commit atmaz. Firefox ve Safari bunu desteklemez. Ayar dosyası değişince paneli yenilemek gerekir.
- Yayındaki sitede giriş: "Sign In with Token" ile GitHub kişisel erişim anahtarı. İnce ayarlı (fine-grained) anahtarda yalnızca bu repo için **Contents: Read and write** izni yeterli. Anahtar tarayıcıda saklanır, repoya ya da sunucuya yazılmaz. Bu yöntem ek bir giriş sunucusu gerektirmez.
- Ayarı doğrulamak için şema: `https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json`
- Belgeler: `https://sveltiacms.app/en/docs/start` ve `https://sveltiacms.app/en/docs/frameworks/astro`

Bu notlar zamanla eskiyebilir. Bir şey beklediğin gibi çalışmazsa belgeye bak.

## İçerik modeli

`src/content.config.ts` içindeki alanlar ile `public/admin/config.yml` içindeki alanlar birebir aynı olmalı; birini değiştirince diğerini de değiştir.

**Blog yazısı** (`src/content/blog/<yazi>/index.md`)
- `title`, `description` (kısa özet), `pubDate`
- `cover` (kapak görseli, isteğe bağlı)
- `tags` (liste)
- `draft` (taslak: geliştirme sunucusunda görünür, yayındaki sitede gizlenir)
- gövde: Markdown

**Proje** (`src/content/projects/<proje>/index.md`)
- `title`, `summary`, `cover`
- Bilgi kutusu: `year`, `role` (kullanıcının projedeki rolü), `engine` (Unity, Unreal vb.), `duration`, `team` (ekip büyüklüğü), `platform`
- `order` (sıralama, küçük sayı önce)
- `links` (etiket ve adres listesi: itch.io, Steam, GitHub)
- `videos` (başlık ve YouTube bağlantısı listesi)
- `playlist` (isteğe bağlı YouTube oynatma listesi bağlantısı)
- `gallery` (görsel ve isteğe bağlı açıklama listesi)
- `draft`
- gövde: Markdown (projenin hikâyesi, tasarım kararları)

**Hakkımda** (`src/content/pages/about.md`): başlık ve Markdown gövde.

**Site ayarları** (`src/data/site.json`): ad, unvan, tanıtım cümlesi, e-posta, CV dosyası, sosyal bağlantılar. Panelden düzenlenebilmeli.

## Sayfalar

- **Ana sayfa:** kim olduğu ve ne yaptığı, öne çıkan projeler, son blog yazıları, CV indirme düğmesi (CV yüklenmişse)
- **Projeler:** kapak görselli ızgara
- **Proje sayfası:** başlık, bilgi kutusu, video oynatıcı, açıklama, galeri, dış bağlantılar
- **Blog:** başlık, tarih, özet, etiketler ve okuma süresiyle yazı listesi (tam metin değil)
- **Blog yazısı:** rahat okunur satır uzunluğu (yaklaşık 70 karakter), kapak görseli, etiketler
- **Etiket sayfaları**, **Hakkımda**, **404**, **RSS** (`/rss.xml`) ve site haritası
- **/admin:** yönetim paneli (site haritasına ve menüye girmez)

## Video oynatıcı

Kullanıcı oynanış videolarını YouTube'da liste dışı (unlisted) tutacak. "Özel" (private) videolar gömülemez; bunu kullanıcıya hatırlat.

- Her proje sayfasında büyük bir oynatıcı ve o projenin videolarının küçük resimli listesi olur. Listeden bir videoya tıklayınca oynatıcıdaki video değişir.
- Sayfa hızlı açılsın: önce yalnızca kapak resmi yüklenir, `iframe` tıklayınca eklenir.
- Gömme adresi: `https://www.youtube-nocookie.com/embed/<ID>`
- Küçük resimler: `https://i.ytimg.com/vi/<ID>/mqdefault.jpg` (her videoda bulunur). `maxresdefault.jpg` her videoda yoktur; kullanırsan `hqdefault.jpg` yedeği koy.
- Bağlantıdan video kimliğini çıkar: `youtu.be/ID`, `watch?v=ID`, `/embed/ID`, `/shorts/ID` biçimlerini destekle.
- `playlist` alanı doluysa ve tek tek video verilmemişse listeyi göm: `https://www.youtube-nocookie.com/embed/videoseries?list=<LISTE_ID>`
- YouTube API anahtarı kullanma; gerek yok.
- Klavyeyle kullanılabilir olsun, 16:9 oranını korusun, mobilde liste oynatıcının altına insin.

## Klasör yapısı

```
public/
  admin/
    index.html        → yönetim paneli
    config.yml        → panel alanları
  uploads/            → içeriğe bağlı olmayan dosyalar (CV gibi)
src/
  content.config.ts   → içerik şemaları
  content/
    blog/<yazi>/index.md (+ görseller)
    projects/<proje>/index.md (+ görseller)
    pages/about.md
  data/site.json      → site ayarları
  layouts/            → ortak sayfa şablonu
  components/         → menü, alt bilgi, kartlar, video oynatıcı, galeri
  lib/                → yardımcı işlevler (YouTube kimliği, tarih biçimi)
  pages/              → sayfalar
  styles/             → genel stil
.github/workflows/    → otomatik yayın (5. aşamada)
```

## Tasarım

- Referans: `https://www.squeakywheel.ph/blog`. Kullanıcı buna benzer bir yapı istiyor: stüdyo tanıtımı, oyunun bilgi kutulu sunumu ve gerçek deneyime dayanan uzun blog yazıları. Görsel tarzını birebir kopyalama; yapıyı örnek al.
- Referanstan farklı olarak blog listesi tam metin değil özet göstersin, etiket ve okuma süresi olsun.
- Sitede en çok öne çıkan şey oynanış videoları ve görseller olmalı; arayüz onların önüne geçmesin.
- Mobil uyumlu, klavye odağı görünür, renk kontrastı yeterli, `prefers-reduced-motion` ayarına saygılı.
- Yazı tiplerini siteyle birlikte sun (örneğin Fontsource paketleri), dış sunucudan yükleme. Türkçe karakterleri (ğ, ş, ı, İ) destekleyen yazı tipleri seç.
- Renk ve yazı tipi seçimlerini kullanıcıya göster, onayını al.
- **Seçilen tema (Ekim 2026): "Studio", yalnızca koyu.** Zemin `#0e1014`, vurgu turuncu `#ff8552`; başlıklar Space Grotesk, metin Inter (`@fontsource-variable`). Renk değişkenleri `src/styles/global.css` içinde. Açık tema şimdilik yok; kullanıcı isterse eklenebilir.

## Yol haritası

Her aşamanın sonunda `npm run build` hatasız geçmeli ve kullanıcıya ne yapıldığını, nasıl deneyeceğini anlat. Aşama bitmeden sonrakine geçme.

**1. İskelet**
Astro projesi, içerik şemaları, ortak şablon (menü, alt bilgi), boş sayfalar, iki örnek proje ve iki örnek yazı (açıkça "örnek" olarak işaretli).
Tamam sayılır: `npm run dev` ile site `http://localhost:4321` adresinde açılıyor, tüm sayfalar arasında gezilebiliyor.

**2. Blog ve projeler**
Blog listesi, yazı sayfası, etiket sayfaları, RSS; proje ızgarası ve proje sayfası (bilgi kutusu, galeri).
Tamam sayılır: yeni bir Markdown klasörü eklenince yazı ya da proje sitede görünüyor; taslaklar derlemede gizleniyor.

**3. Video oynatıcı**
Yukarıdaki gereksinimlere göre.
Tamam sayılır: birden fazla videosu olan projede videolar arasında geçiliyor; `iframe` tıklamadan önce yüklenmiyor.

**4. Yönetim paneli**
`public/admin` dosyaları, tüm içerik türleri ve site ayarları için alanlar.
Tamam sayılır: Chrome'da yerel çalışma kipinde panelden yeni yazı ve yeni proje (görsel ve video bağlantısıyla) oluşturuluyor, dosyalar doğru klasöre yazılıyor ve site hatasız derleniyor.

**5. Yayın (kullanıcı "VDS'e geçelim" deyince)**
- VDS: SSH anahtarıyla giriş, parolayla root girişini kapatma, güvenlik duvarı (22, 80, 443), otomatik güvenlik güncellemeleri, yayın için yetkisi sınırlı ayrı bir kullanıcı.
- Caddy: statik dosyaları sunar, HTTPS sertifikasını kendisi alır ve yeniler.
- DNS: domainin A kaydı VDS IP adresine.
- GitHub Actions: `main` dalına push'ta derle ve `dist/` klasörünü SSH ile kopyala. SSH anahtarı, sunucu adresi ve kullanıcı adı GitHub Secrets'ta durur.
- Panel ayarında `backend.repo` gerçek repo adıyla doldurulur; kullanıcı kişisel erişim anahtarı oluşturur.
Tamam sayılır: push sonrası site domain adresinde HTTPS ile açılıyor; panelden yayınlanan yazı birkaç dakika içinde sitede görünüyor.

## Kurallar

- Parola, erişim anahtarı, SSH anahtarı ve `.env` dosyaları repoya asla girmez. Kullanıcı bunları sohbete yapıştırırsa repoya yazma, uyar.
- Video dosyaları ve oyun build'leri repoya girmez. Videolar YouTube'a, oynanabilir build'ler itch.io'ya gider.
- VDS üzerinde geri alınması zor bir işlem (güvenlik duvarı, SSH ayarı, kullanıcı silme) yapmadan önce ne yapacağını anlat ve onay al. SSH ayarını değiştirirken mevcut oturumu kapatmadan yeni oturumla girişi dene; kullanıcı sunucunun dışında kalmasın.
- Örnek içerikleri gerçek içerikle karıştırma; kullanıcı kendi projelerini ekleyince örnekleri silmeyi öner.
- Bir kararı değiştirmen gerektiğini düşünüyorsan (farklı panel, farklı barındırma) önce nedenini anlat ve sor.
