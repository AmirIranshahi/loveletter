
import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import {
  Heart,
  ImagePlus,
  Download,
  Sparkles,
  CalendarDays,
  RotateCcw,
  Camera,
  HeartHandshake,
  Check,
  LoaderCircle,
} from 'lucide-react'

const themes = {
  rose: {
    name: 'رز عاشقانه',
    background: '#fff1ee',
    color: '#713b48',
    accent: '#b84f68',
    muted: '#966b72',
    border: '#edc6c9',
  },
  midnight: {
    name: 'شب عاشقی',
    background: '#332637',
    color: '#fff0ee',
    accent: '#f0a2b3',
    muted: '#e0bec8',
    border: '#755568',
  },
  paper: {
    name: 'نامه قدیمی',
    background: '#f5ead7',
    color: '#5c4434',
    accent: '#a65c43',
    muted: '#8e735e',
    border: '#d8c1a0',
  },
}

function PhotoPicker({ label, image, onChange }) {
  const inputRef = useRef(null)

  function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری انتخاب کن.')
      event.target.value = ''
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('حجم هر عکس باید کمتر از ۱۰ مگابایت باشه.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      onChange(reader.result)
    }

    reader.readAsDataURL(file)
    event.target.value = ''
  }

  return (
    <div className="min-w-0">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group flex min-h-36 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed border-rose-200 bg-rose-50/60 p-3 transition hover:border-rose-400 hover:bg-rose-50"
        aria-label={`انتخاب ${label}`}
      >
        {image ? (
          <img
            src={image}
            alt={label}
            className="h-28 w-full rounded-xl object-cover"
          />
        ) : (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-rose-400 shadow-sm transition group-hover:scale-105">
              <ImagePlus size={22} />
            </span>
            <span className="text-sm font-medium text-rose-800">
              انتخاب {label}
            </span>
            <span className="text-xs text-rose-400">
              JPG، PNG یا WEBP
            </span>
          </>
        )}

        {image && (
          <span className="text-xs font-medium text-rose-700">
            تغییر عکس
          </span>
        )}
      </button>
    </div>
  )
}

function App() {
  const cardRef = useRef(null)

  const [yourName, setYourName] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [date, setDate] = useState('')
  const [message, setMessage] = useState(
    'بین تمام اتفاق‌های قشنگ دنیا، تو قشنگ‌ترین اتفاق زندگی منی. ❤️',
  )

  const [yourPhoto, setYourPhoto] = useState('')
  const [partnerPhoto, setPartnerPhoto] = useState('')
  const [themeName, setThemeName] = useState('rose')
  const [downloading, setDownloading] = useState(false)

  const theme = themes[themeName]

  async function downloadCard() {
    if (!cardRef.current || downloading) return

    setDownloading(true)

    try {
      // اجازه می‌ده عکس‌ها قبل از گرفتن خروجی آماده بشن.
      await document.fonts.ready

      const images = Array.from(
        cardRef.current.querySelectorAll('img'),
      )

      await Promise.all(
        images.map((image) => {
          if (image.complete) return Promise.resolve()

          return new Promise((resolve) => {
            image.onload = resolve
            image.onerror = resolve
          })
        }),
      )

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: theme.background,
      })

      const link = document.createElement('a')
      link.download = 'loveletter.png'
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('PNG export failed:', error)
      alert(
        'ساخت تصویر با مشکل مواجه شد. لطفاً دوباره امتحان کن.',
      )
    } finally {
      setDownloading(false)
    }
  }

  function resetForm() {
    setYourName('')
    setPartnerName('')
    setDate('')
    setMessage(
      'بین تمام اتفاق‌های قشنگ دنیا، تو قشنگ‌ترین اتفاق زندگی منی. ❤️',
    )
    setYourPhoto('')
    setPartnerPhoto('')
    setThemeName('rose')
  }

  return (
    <main
      dir="rtl"
      className="app-background min-h-screen overflow-x-hidden"
    >
      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8">
        <a href="#" className="flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <Heart size={23} fill="currentColor" />
          </span>

          <span>
            <span className="block text-xl font-black tracking-tight text-rose-950">
              LoveLetter
            </span>
            <span className="block text-[11px] text-rose-500">
              یه تکه از قلب من
            </span>
          </span>
        </a>

        <span className="hidden items-center gap-1.5 rounded-full border border-rose-100 bg-white/80 px-4 py-2 text-xs text-rose-600 sm:flex">
          <Sparkles size={15} />
          ساخته‌شده با عشق
        </span>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-8 sm:pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="heart-float mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-rose-100 text-rose-500 shadow-sm">
            <HeartHandshake size={32} />
          </div>

          <p className="mb-3 text-sm font-bold text-rose-500">
            برای آدمی که دنیاته
          </p>

          <h1 className="text-3xl font-black leading-[1.6] tracking-tight text-rose-950 sm:text-5xl sm:leading-normal">
            یه خاطره بساز،
            <br className="sm:hidden" />
            <span className="text-rose-500">
              {' '}برای همیشه
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-stone-500 sm:text-base">
            دوتا عکس، چند کلمه از ته دل و یه عالمه عشق؛
            کارت‌پستال خودتون رو بساز و به کسی که دوستش داری هدیه بده.
          </p>
        </div>
      </section>

      {/* Main workspace */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 px-4 pb-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        {/* Editor */}
        <div className="soft-shadow rounded-3xl border border-rose-100/80 bg-white/90 p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-rose-950">
                کارتت رو بساز
              </h2>
              <p className="mt-1 text-xs leading-6 text-stone-400">
                هر چیزی که می‌نویسی، زنده پیش‌نمایش داده می‌شه.
              </p>
            </div>

            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <Sparkles size={22} />
            </span>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block min-w-0">
              <span className="mb-2 block text-sm font-bold text-stone-700">
                اسم تو
              </span>
              <input
                className="form-field"
                value={yourName}
                onChange={(event) => setYourName(event.target.value)}
                placeholder="مثلاً امیر"
                maxLength={35}
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-2 block text-sm font-bold text-stone-700">
                اسم عشق تو
              </span>
              <input
                className="form-field"
                value={partnerName}
                onChange={(event) =>
                  setPartnerName(event.target.value)
                }
                placeholder="مثلاً عشق من"
                maxLength={35}
              />
            </label>
          </div>

          {/* Photos */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-stone-700">
                عکس‌های خاطره‌انگیزتون
              </span>
              <span className="text-xs text-stone-400">
                حداکثر ۱۰ مگابایت
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <PhotoPicker
                label="عکس تو"
                image={yourPhoto}
                onChange={setYourPhoto}
              />
              <PhotoPicker
                label="عکس عشق تو"
                image={partnerPhoto}
                onChange={setPartnerPhoto}
              />
            </div>
          </div>

          {/* Date */}
          <label className="mt-6 block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-700">
              <CalendarDays size={17} className="text-rose-400" />
              تاریخ خاص شما (اختیاری)
            </span>

            <input
              className="form-field"
              type="date"
              dir="ltr"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>

          {/* Message */}
          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-bold text-stone-700">
              حرفی که از دلت میاد ❤️
            </span>

            <textarea
              className="form-field min-h-32 resize-y leading-8"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="هر چیزی که دوست داری بهش بگی..."
              maxLength={400}
            />

            <span className="mt-1 block text-left text-xs text-stone-400">
              {message.length}/400
            </span>
          </label>

          {/* Themes */}
          <div className="mt-6">
            <span className="mb-3 block text-sm font-bold text-stone-700">
              حال‌وهوای کارت
            </span>

            <div className="grid grid-cols-3 gap-2">
              {Object.entries(themes).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setThemeName(key)}
                  aria-pressed={themeName === key}
                  className={`rounded-2xl border p-3 text-center transition ${
                    themeName === key
                      ? 'border-rose-400 bg-rose-50 ring-2 ring-rose-100'
                      : 'border-stone-100 bg-white hover:border-rose-200'
                  }`}
                >
                  <span
                    className="mx-auto mb-2 block h-8 w-8 rounded-full border border-black/5"
                    style={{ backgroundColor: item.background }}
                  />

                  <span className="block text-xs font-bold text-stone-700">
                    {item.name}
                  </span>

                  {themeName === key && (
                    <Check
                      size={14}
                      className="mx-auto mt-1 text-rose-500"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={downloadCard}
              disabled={downloading}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 font-bold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-700 disabled:cursor-wait disabled:opacity-70"
            >
              {downloading ? (
                <LoaderCircle size={19} className="animate-spin" />
              ) : (
                <Download size={19} />
              )}

              {downloading
                ? 'در حال ساخت کارت...'
                : 'دانلود کارت عاشقانه'}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-rose-100 px-5 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
            >
              <RotateCcw size={17} />
              از نو
            </button>
          </div>

          <p className="mt-4 text-center text-xs leading-6 text-stone-400">
            عکس‌ها در همین مرورگر پردازش می‌شن و به سرور آپلود نمی‌شن.
          </p>
        </div>

        {/* Preview */}
        <div className="min-w-0 lg:sticky lg:top-6">
          <div className="mb-4 flex items-center justify-between px-1">
            <div>
              <h2 className="font-black text-rose-950">
                پیش‌نمایش عشق شما
              </h2>
              <p className="mt-1 text-xs text-stone-400">
                کارت نهایی تقریباً همین شکلی خواهد بود.
              </p>
            </div>

            <span className="rounded-full border border-rose-100 bg-white px-3 py-1.5 text-xs font-medium text-rose-500">
              زنده
            </span>
          </div>

          <div className="soft-shadow overflow-hidden rounded-3xl border border-rose-100 bg-white p-3 sm:p-5">
            {/* This element is exported as PNG */}
            <div
              ref={cardRef}
              className="love-card mx-auto w-full max-w-140 rounded-3xl px-5 py-7 sm:px-9 sm:py-9"
              style={{
                backgroundColor: theme.background,
                color: theme.color,
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2">
                  <span
                    className="h-px w-8"
                    style={{ backgroundColor: theme.border }}
                  />
                  <Heart
                    size={17}
                    style={{ color: theme.accent }}
                    fill={theme.accent}
                  />
                  <span
                    className="h-px w-8"
                    style={{ backgroundColor: theme.border }}
                  />
                </div>

                <p
                  className="mt-4 text-center text-xs font-medium tracking-wide"
                  style={{ color: theme.muted }}
                >
                  برای تو، با تمام قلبم
                </p>

                <h3
                  className="mt-2 text-center text-2xl font-black leading-relaxed sm:text-3xl"
                  style={{ color: theme.color }}
                >
                  {partnerName.trim()
                    ? `برای ${partnerName.trim()}`
                    : 'برای عشق زندگی‌م'}
                </h3>

                <p
                  className="mt-1 text-center text-sm"
                  style={{ color: theme.muted }}
                >
                  یه تکه از دنیای من
                </p>

                <div className="mx-auto my-6 grid max-w-sm grid-cols-2 gap-3 sm:gap-4">
                  <div className="-rotate-3 rounded-xl bg-white p-2 pb-3 shadow-md">
                    <div className="card-photo">
                      {yourPhoto ? (
                        <img src={yourPhoto} alt="عکس اول" />
                      ) : (
                        <div className="photo-placeholder">
                          <Camera size={24} />
                          <span>خاطره‌ی اول</span>
                        </div>
                      )}
                    </div>

                    <p className="mt-2 truncate text-center text-xs font-bold text-stone-600">
                      {yourName.trim() || 'من'}
                    </p>
                  </div>

                  <div className="rotate-3 rounded-xl bg-white p-2 pb-3 shadow-md">
                    <div className="card-photo">
                      {partnerPhoto ? (
                        <img src={partnerPhoto} alt="عکس دوم" />
                      ) : (
                        <div className="photo-placeholder">
                          <Camera size={24} />
                          <span>خاطره‌ی دوم</span>
                        </div>
                      )}
                    </div>

                    <p className="mt-2 truncate text-center text-xs font-bold text-stone-600">
                      {partnerName.trim() || 'تو'}
                    </p>
                  </div>
                </div>

                <div className="mx-auto max-w-md">
                  <p
                    className="whitespace-pre-wrap wrap-break-word text-center text-sm leading-8 sm:text-base sm:leading-9"
                    style={{ color: theme.color }}
                  >
                    {message || 'اینجا نامه‌ی عاشقانه‌ی شما قرار می‌گیره...'}
                  </p>
                </div>

                {date && (
                  <p
                    className="mt-5 text-center text-xs"
                    style={{ color: theme.muted }}
                  >
                    روزی که یادمون می‌مونه: {date}
                  </p>
                )}

                <div className="mt-7 flex items-center justify-center gap-2">
                  <Heart
                    size={15}
                    fill={theme.accent}
                    style={{ color: theme.accent }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ color: theme.accent }}
                  >
                    {yourName.trim() || 'من'} ♥{' '}
                    {partnerName.trim() || 'تو'}
                  </span>
                  <Heart
                    size={15}
                    fill={theme.accent}
                    style={{ color: theme.accent }}
                  />
                </div>

                <p
                  className="mt-3 text-center text-[10px]"
                  style={{ color: theme.muted }}
                >
                  ساخته‌شده با عشق، برای تو
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-rose-100 bg-white/80 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <Sparkles size={18} />
            </span>

            <div>
              <p className="text-sm font-bold text-rose-950">
                یه هدیه‌ی کوچیک، یه حس بزرگ
              </p>
              <p className="mt-1 text-xs leading-6 text-stone-500">
                بعد از دانلود، می‌تونی تصویر کارت رو برای عشق‌ت
                بفرستی یا چاپش کنی و بهش هدیه بدی.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-rose-100/80 px-4 py-7 text-center">
        <p className="text-sm font-bold text-rose-800">
          LoveLetter <Heart size={13} className="inline" />
        </p>
        <p className="mt-2 text-xs text-stone-400">
          بعضی حس‌ها رو باید نوشت. با عشق ساخته شده.
        </p>
         
<p className="mt-2 text-center text-xs text-stone-400">
  Made with love by <span className="font-medium text-rose-400">Amir Mahan Iranshahi</span> ♥
</p>


      </footer>
    </main>
  )
}

export default App
