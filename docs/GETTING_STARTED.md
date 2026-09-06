# Motion Studio — Kurulum ve Çalıştırma Rehberi

Bu belge, Motion Studio’yu sıfırdan kurup hem CLI hem de GUI tarafını
çalıştırmak için hazırlanmıştır. Komutlar macOS/Linux kabuğu içindir. Windows
kullanıyorsanız aynı adımları PowerShell’de, yol yazımını Windows biçimine
uyarlayarak uygulayabilirsiniz.

## 1. Motion Studio ne yapar?

Motion Studio, bir `storyboard.json` dosyasını doğrular, semantic
capability’leri plugin registry üzerinden çözer, timeline/layout bilgisini
derler ve Remotion ile video üretir.

İki kullanım yolu vardır:

- CLI: doğrulama, capability keşfi, Markdown derleme, preview ve MP4 render.
- GUI: örnek projeleri görsel olarak inceleme, preview, timeline/inspector
  bilgilerini görme ve CLI render komutunu kopyalama.

GUI ve CLI aynı TypeScript compiler, registry, resolver ve renderer kodunu
kullanır.

## 2. Gereken yazılımlar

### CLI için

Şunların kurulu olması gerekir:

- Node.js
- Corepack ve pnpm
- Go 1.22 veya daha yeni bir sürüm
- Remotion render için Chromium’un çalışabileceği bir ortam

Kontrol edin:

```bash
node --version
corepack --version
pnpm --version
go version
```

### GUI için

Tarayıcı tabanlı GUI geliştirmesi için Node.js, Corepack ve pnpm yeterlidir.

Native Tauri penceresi açmak isterseniz ek olarak şunlar gerekir:

- Rust toolchain (`rustc`, `cargo`)
- Tauri CLI (`cargo tauri`)
- İşletim sisteminin native build araçları

macOS’ta Xcode Command Line Tools kurulumu:

```bash
xcode-select --install
```

Rust kurulumu için `rustup` kullanın. Kurulumdan sonra kontrol edin:

```bash
rustc --version
cargo --version
```

Tauri CLI kurulu değilse:

```bash
cargo install tauri-cli
```

Native Tauri build araçları işletim sistemine göre değişebildiği için ilk
kurulumda Tauri’nin platform gereksinimlerini de karşılamanız gerekir.

## 3. Projeyi hazırlama

Repository’yi indirdikten sonra proje köküne geçin:

```bash
cd remotion_studio
```

pnpm’i etkinleştirin:

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
```

Bağımlılıkları kurun:

```bash
pnpm install
```

Kurulumun ve bütün workspace’in sağlıklı olduğunu kontrol edin:

```bash
pnpm test
pnpm build
```

Bu iki komut sırasıyla tüm paket testlerini ve TypeScript/frontend build’lerini
çalıştırır.

## 4. CLI’yi oluşturma

CLI kaynak kodu `cmd/motion` altındadır. Proje kökünden çalıştırın:

```bash
cd cmd/motion
go build -o motion .
cd ../..
```

CLI’nin çalıştığını kontrol edin:

```bash
./cmd/motion/motion version
./cmd/motion/motion doctor --json
```

`doctor` çıktısında Node, pnpm ve storyboard bilgilerini görebilirsiniz.

CLI komutlarını proje kökünden çalıştırmanız önerilir. Böylece
`examples/...`, `packages/runtime` ve diğer workspace yolları doğru bulunur.

## 5. İlk CLI akışı

### 5.1 Hazır storyboard’u doğrulama

```bash
./cmd/motion/motion validate \
  --storyboard examples/cache-hit/storyboard.json \
  --json
```

Başarılı sonuçta `valid: true` görürsünüz.

### 5. Storyboard’u inceleme

```bash
./cmd/motion/motion inspect \
  --storyboard examples/cache-hit/storyboard.json \
  --json
```

Belirli bir sahneyi incelemek için:

```bash
./cmd/motion/motion inspect cache-flow \
  --storyboard examples/cache-hit/storyboard.json \
  --json
```

### 5. Capability’leri görme

Tüm capability’ler:

```bash
./cmd/motion/motion capabilities --json
```

Scene’e göre filtreleme:

```bash
./cmd/motion/motion capabilities \
  --scene request-flow \
  --json
```

Intent’e göre filtreleme:

```bash
./cmd/motion/motion capabilities \
  --intent show-data-flow \
  --json
```

Agent kullanımı için ilk önerilen komut capability sorgusudur. Agent, var
olmayan bir component ID’si tahmin etmek yerine bu çıktıyı kullanmalıdır.

### 5.3 Preview açma

```bash
./cmd/motion/motion preview \
  --storyboard examples/cache-hit/storyboard.json \
  --port 3000
```

Bu komut validation’dan sonra Remotion Studio’yu başlatır. Tarayıcıda komutun
gösterdiği localhost adresini açın. Preview süreci terminal açık kaldığı
sürece çalışır; kapatmak için `Ctrl+C` kullanın.

### 5.4 MP4 render alma

Önce validation, sonra render yapın:

```bash
./cmd/motion/motion validate \
  --storyboard examples/cache-hit/storyboard.json

./cmd/motion/motion render \
  --storyboard examples/cache-hit/storyboard.json \
  --output out/cache-hit.mp4
```

Başarılı render sonunda dosya burada oluşur:

```text
out/cache-hit.mp4
```

Validation başarısızsa render’a geçmeyin. Hatanın schema, timeline,
semantic veya capability katmanını düzeltip tekrar validate edin.

### 5.5 Yeni proje oluşturma

```bash
./cmd/motion/motion new my-explainer
```

Bu komut proje kökünde `my-explainer/storyboard.json` oluşturur. Sonra:

```bash
./cmd/motion/motion validate \
  --storyboard my-explainer/storyboard.json \
  --json
```

### 5.6 Markdown’dan storyboard üretme

Örnek Markdown dosyasını JSON Storyboard’a çevirin:

```bash
./cmd/motion/motion compile \
  examples/rag-explainer/explainer.md \
  --output out/rag-storyboard.json
```

Ardından normal storyboard akışını kullanın:

```bash
./cmd/motion/motion validate \
  --storyboard out/rag-storyboard.json \
  --json

./cmd/motion/motion render \
  --storyboard out/rag-storyboard.json \
  --output out/rag-explainer.mp4
```

## 6. Plugin ve marketplace komutları

Catalog’daki plugin’leri listeleyin:

```bash
./cmd/motion/motion plugins list --json
```

Arama yapın:

```bash
./cmd/motion/motion plugins search diagram --json
```

Bir plugin’i proje state’ine ekleyin:

```bash
./cmd/motion/motion plugin add @motion-studio/technical-diagrams --json
```

Bu işlem `motion-plugins.json` oluşturur veya günceller. Şu anki marketplace
katmanı plugin metadata’sını ve uyumluluğunu yönetir; native paket indirip
çalıştırmaz.

Güncelleme ve kaldırma:

```bash
./cmd/motion/motion plugin update @motion-studio/technical-diagrams --json
./cmd/motion/motion plugin remove @motion-studio/technical-diagrams --json
```

Native plugin yüklemeden önce kaynağın güvenilir olduğundan emin olun. Signed
package ve sandbox desteği gelecekteki güvenlik katmanının konusudur.

## 7. GUI’yi çalıştırma

### 7.1 Tarayıcı tabanlı GUI — önerilen geliştirme yolu

Proje kökünden:

```bash
pnpm --filter @motion-studio/desktop dev
```

Vite bir localhost adresi yazdırır; genellikle:

```text
http://localhost:5173
```

Bu adresi tarayıcıda açın.

GUI içinde hazır örnekler bulunur:

- Cache hit
- Architecture
- Product demo

GUI’deki bölümler:

- Preview: Remotion Player ile canlı görüntüleme
- Timeline: timeline event’lerini ve frame sürelerini görme
- Inspector: scene intent, theme, element ve provider bilgileri
- Plugins: registry’deki plugin’leri görme
- Agent panel: storyboard değişikliği için prompt alanı. Bu sürümde panel
  prompt arayüzüdür; gerçek agent çağrısı Claude Code, Codex veya başka bir
  dış agent üzerinden yürütülür.
- Render Manager: CLI render komutunu kopyalama

GUI preview sırasında hiçbir storyboard dosyası otomatik olarak değiştirilmez.

Durdurmak için GUI terminalinde `Ctrl+C` kullanın.

### 7.2 Native Tauri GUI

Native shell kaynakları `apps/desktop/src-tauri` altındadır. Bağımlılıklar
kurulduktan sonra:

```bash
cd apps/desktop/src-tauri
cargo tauri dev
```

Tauri, frontend için repository’de tanımlı `beforeDevCommand` komutunu
çalıştırır ve native pencereyi açar.

Native pencere açılmazsa önce tarayıcı tabanlı yolu deneyin:

```bash
cd ../../..
pnpm --filter @motion-studio/desktop dev
```

Bu ayrım önemlidir: GUI preview tarayıcıda çalışabilir; MP4 render işlemi ise
bu sürümde CLI üzerinden yapılır.

## 8. GUI’den CLI render alma

GUI’de bir proje seçin ve sağdaki Render Manager bölümündeki `Copy CLI`
butonuna basın. Kopyalanan komut benzer şekilde görünür:

```bash
motion render --storyboard examples/cache-hit/storyboard.json
```

Eğer `motion` binary’si PATH’te değilse repository kökünden şu biçimi kullanın:

```bash
./cmd/motion/motion render \
  --storyboard examples/cache-hit/storyboard.json \
  --output out/cache-hit.mp4
```

## 9. Agent ile çalışma düzeni

Bir agent storyboard üzerinde çalışırken önerilen sıra:

```text
capabilities sorgula
→ mevcut storyboard’u incele
→ küçük bir IR değişikliği yap
→ validate et
→ preview/render
```

Örnek:

```bash
./cmd/motion/motion capabilities \
  --scene request-flow \
  --intent show-data-flow \
  --json

./cmd/motion/motion validate \
  --storyboard examples/cache-hit/storyboard.json \
  --json
```

Storyboard içine raw CSS, React import’u, Remotion kodu veya piksel bazlı
animasyon değerleri eklemeyin. Agent semantic action ve capability kullanmalı;
uygulama detaylarını engine seçmelidir.

## 10. Sık karşılaşılan sorunlar

### `pnpm: command not found`

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm --version
```

### `No storyboard found`

Komutu repository kökünden çalıştırın veya tam yolu verin:

```bash
./cmd/motion/motion validate \
  --storyboard /tam/yol/remotion_studio/examples/cache-hit/storyboard.json
```

### `No provider registered` veya semantic validation hatası

Uygun capability’leri listeleyin:

```bash
./cmd/motion/motion capabilities --json
./cmd/motion/motion capabilities --scene request-flow --json
```

Storyboard’daki capability’yi mevcut ve scene ile uyumlu bir capability ile
değiştirin.

### Render sırasında Chromium başlatılamıyor

Önce storyboard validation’ını ayrı çalıştırın. Validation başarılı olduğu
halde Chromium başlatılamıyorsa işletim sistemi browser izinlerini, Chromium
kurulumunu ve Remotion’un çalışma ortamını kontrol edin. CI/sandbox ortamları
browser process başlatmayı engelleyebilir.

### GUI’de değişiklik görünmüyor

Vite terminalini kontrol edin, sayfayı yenileyin ve `pnpm install` sonrası
server’ı yeniden başlatın:

```bash
pnpm --filter @motion-studio/desktop dev
```

### Native Tauri build başarısız

Şunları kontrol edin:

```bash
rustc --version
cargo --version
cargo tauri --version
```

Sonra native shell’i doğru dizinden çalıştırın:

```bash
cd apps/desktop/src-tauri
cargo tauri dev
```

## 11. Temiz bir doğrulama akışı

Kurulumdan sonra aşağıdaki akış, projenin ana parçalarını birlikte kontrol
eder:

```bash
pnpm install
pnpm test
pnpm build
cd cmd/motion
go build -o motion .
cd ../..
./cmd/motion/motion doctor --json
./cmd/motion/motion validate \
  --storyboard examples/cache-hit/storyboard.json \
  --json
./cmd/motion/motion render \
  --storyboard examples/cache-hit/storyboard.json \
  --output out/cache-hit.mp4
pnpm --filter @motion-studio/desktop dev
```

Bu akışta son komut GUI server’ını açık bırakır. GUI’yi kontrol ettikten sonra
`Ctrl+C` ile kapatabilirsiniz.

## 12. İlgili belgeler

- [Agent workflow](AGENT_WORKFLOW.md)
- [CLI specification](CLI_SPEC.md)
- [Markdown authoring](MARKDOWN_AUTHORING.md)
- [Storyboard specification](STORYBOARD_SPEC.md)
- [Marketplace specification](MARKETPLACE_SPEC.md)
- [Architecture](ARCHITECTURE.md)
