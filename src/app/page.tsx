import Link from "next/link";

export const dynamic = "force-static";
type Surah = {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
};

type ApiListResponse = {
  code: number;
  message: string;
  data: Surah[];
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function toSlug(nomor: number, namaLatin: string): string {
  return `${nomor}-${slugify(namaLatin)}`;
}

async function getSurahList(): Promise<Surah[]> {
  const res = await fetch("https://equran.id/api/v2/surat", {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Gagal ambil daftar surat");
  const json: ApiListResponse = await res.json();
  return json.data;
}

const features = [
  {
    title: "Baca Al-Quran",
    desc: "Teks Arab, transliterasi, dan terjemahan bahasa Indonesia",
    icon: "fa-book-open",
    color: "text-emerald-400",
    border: "hover:border-emerald-400/50",
  },
  {
    title: "Audio Berkualitas",
    desc: "Mendengarkan dengan audio dari qari terbaik dunia",
    icon: "fa-headphones-simple",
    color: "text-blue-400",
    border: "hover:border-blue-500/50",
  },
  {
    title: "Tafsir Lengkap",
    desc: "Memahami makna dengan tafsir yang mudah dipahami",
    icon: "fa-lightbulb",
    color: "text-yellow-400",
    border: "hover:border-yellow-500/50",
  },
  {
    title: "API Developer",
    desc: "API gratis untuk developer dengan dokumentasi lengkap",
    icon: "fa-code",
    color: "text-purple-400",
    border: "hover:border-purple-500/50",
  },
  {
    title: "Game Edukatif",
    desc: "Belajar Al-Quran dengan cara yang menyenangkan",
    icon: "fa-gamepad",
    color: "text-emerald-500",
    border: "hover:border-emerald-500/50",
  },
];

export default async function HomePage() {
  const list = await getSurahList();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-darkbg)] text-white">
      <div className="bg-glow-red pointer-events-none" />
      <div className="bg-glow-blue pointer-events-none" />

      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-800/60 bg-[var(--color-darkbg)]/80 px-4 py-4 backdrop-blur-md md:px-8">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-book-open text-[var(--color-brand)] text-xl" />
          <span className="text-xl font-bold tracking-wide">EQuran.id</span>
        </div>

        <div className="hidden items-center gap-6 text-sm font-medium text-gray-400 lg:flex">
          <a
            href="#"
            className="flex items-center gap-2 rounded-full border border-[var(--color-brand)]/20 bg-[var(--color-brand)]/10 px-4 py-2 text-[var(--color-brand)] transition"
          >
            <i className="fa-solid fa-house" /> Beranda
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-white transition">
            <i className="fa-solid fa-book-quran" /> Alquran
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-white transition">
            <i className="fa-solid fa-hands-praying" /> Doa
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-white transition">
            <i className="fa-solid fa-moon" /> Imsakiyah
            <span className="ml-1 rounded-full bg-pink-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
              NEW
            </span>
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-white transition">
            <i className="fa-solid fa-clock" /> Jadwal Sholat
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-white transition">
            <i className="fa-solid fa-hand-holding-dollar" /> Donasi
          </a>
        </div>

        <button className="flex items-center gap-2 rounded-full border border-gray-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
          <i className="fa-solid fa-arrow-right-to-bracket" /> Masuk
        </button>
      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center px-4 pb-16 pt-20 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-yellow-700/50 bg-yellow-900/10 px-4 py-1.5 text-sm text-gray-300 backdrop-blur-sm">
          <i className="fa-solid fa-wand-magic-sparkles text-yellow-500" />
          Platform Al-Quran Digital Terlengkap
        </div>

        <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
          <span className="text-[var(--color-brand)]">Al-Quran Digital</span>
          <br />
          <span className="text-gray-100">Bahasa Indonesia</span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-400">
          Baca, dengarkan, dan pelajari Al-Quran dengan terjemahan Indonesia,
          audio 6 qari terbaik, tafsir lengkap, dan AI Chat
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button className="flex items-center gap-2 rounded-xl bg-[var(--color-brand)] px-8 py-3.5 font-semibold text-black shadow-[0_0_30px_rgba(52,211,153,0.3)] transition duration-300 hover:bg-emerald-400">
            <i className="fa-solid fa-book-open-reader" /> Mulai Membaca
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-[var(--color-cardborder)] bg-[var(--color-card)] px-8 py-3.5 font-semibold text-white transition duration-300 hover:border-gray-500">
            <i className="fa-solid fa-wand-magic-sparkles text-[var(--color-brand)]" /> AI Chat
          </button>
        </div>
      </section>

      <section className="z-10 w-full px-6 pb-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl border border-[var(--color-cardborder)] bg-gradient-to-b from-[var(--color-card)] to-[var(--color-darkbg)] p-6 text-center transition duration-300 ${f.border}`}
            >
              <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-2xl shadow-[0_0_20px_rgba(52,211,153,0.1)] ${f.color}`}>
                <i className={`fa-solid ${f.icon}`} />
              </div>
              <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="z-10 w-full px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Jelajahi <span className="text-[var(--color-brand)]">{list.length} Surat</span> Al-Quran
            </h2>
            <p className="text-lg text-gray-400">
              Cari berdasarkan nama surat, nomor, atau arti dalam bahasa Indonesia
            </p>
          </div>

          <div className="mx-auto mb-6 max-w-2xl">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <i className="fa-solid fa-magnifying-glass" />
              </div>
              <input
                type="text"
                className="block w-full rounded-full border border-gray-700 bg-[#111827] p-4 pl-12 text-sm text-white outline-none transition focus:border-[var(--color-brand)] focus:ring-[var(--color-brand)]"
                placeholder="Cari nama surat, nomor, atau arti..."
              />
            </div>
            <p className="mt-3 text-center text-xs text-gray-500">
              Contoh: "Al-Fatihah", "1", atau "Pembukaan"
            </p>
          </div>

          <div className="mb-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-brand)]" /> 114 Surat
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> 6.236 Ayat
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-500" /> 30 Juz
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => (
              <Link
                key={s.nomor}
                href={`/surat/${toSlug(s.nomor, s.namaLatin)}/`}
                className="group flex items-center justify-between rounded-2xl border border-[var(--color-cardborder)] bg-[var(--color-card)] p-5 transition hover:bg-gray-800/60"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-orange-500/50 text-sm font-semibold text-orange-400">
                    {s.nomor}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white transition group-hover:text-[var(--color-brand)]">
                      {s.namaLatin}
                    </h4>
                    <p className="mb-2 text-xs text-gray-500">{s.arti}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1 rounded bg-gray-800 px-2 py-1">
                        <i className="fa-solid fa-location-dot" /> {s.tempatTurun}
                      </span>
                      <span className="flex items-center gap-1 rounded bg-gray-800 px-2 py-1">
                        <i className="fa-regular fa-file-lines" /> {s.jumlahAyat}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="font-arabic text-3xl text-[var(--color-brand)]">{s.nama}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-gray-800/60 bg-[#060910] px-6 pb-6 pt-12">
        <div className="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-2 flex items-center gap-2">
              <i className="fa-solid fa-book-open text-[var(--color-brand)] text-2xl" />
              <span className="text-xl font-bold">EQuran.id</span>
            </div>
            <p className="mb-6 text-xs text-gray-500">Al-Quran Digital Indonesia</p>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Platform Al-Quran digital terlengkap dengan terjemahan bahasa Indonesia, audio berkualitas
              tinggi dari 6 qari terbaik, tafsir lengkap, doa harian, dan game edukatif.
            </p>
            <div className="flex gap-6 font-bold text-white">
              <div>
                <div className="text-xl">114</div>
                <div className="text-xs font-normal text-gray-500">Surat</div>
              </div>
              <div>
                <div className="text-xl">6.236</div>
                <div className="text-xs font-normal text-gray-500">Ayat</div>
              </div>
              <div>
                <div className="text-xl">6</div>
                <div className="text-xs font-normal text-gray-500">Qari</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-6 flex items-center gap-2 font-semibold text-white">
              <span className="h-4 w-1 rounded bg-[var(--color-brand)]" /> Fitur Utama
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-[var(--color-brand)] transition">
                  <i className="fa-solid fa-book-open w-4" /> Baca Al-Quran
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-[var(--color-brand)] transition">
                  <i className="fa-regular fa-heart w-4" /> Doa Harian
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-[var(--color-brand)] transition">
                  <i className="fa-solid fa-gamepad w-4" /> Game Edukatif
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-[var(--color-brand)] transition">
                  <i className="fa-solid fa-code w-4" /> API Developer
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-[var(--color-brand)] transition">
                  <i className="fa-solid fa-arrow-up-right-from-square w-4" /> Status Page
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 flex items-center gap-2 font-semibold text-white">
              <span className="h-4 w-1 rounded bg-[var(--color-brand)]" /> Legal
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-[var(--color-brand)] transition">
                  <i className="fa-regular fa-file-lines w-4" /> Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-[var(--color-brand)] transition">
                  <i className="fa-solid fa-shield-halved w-4" /> Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 flex items-center gap-2 font-semibold text-white">
              <span className="h-4 w-1 rounded bg-[var(--color-brand)]" /> Partner
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-[var(--color-brand)] transition">
                  <i className="fa-solid fa-arrow-up-right-from-square w-4" /> Islamic Network
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-[var(--color-brand)] transition">
                  <i className="fa-solid fa-arrow-up-right-from-square w-4" /> Verse By Verse Quran
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between border-t border-gray-800/60 pt-6 text-xs text-gray-500 md:flex-row">
          <p>
            Made by Muslim from Indonesia with <i className="fa-solid fa-heart text-red-500" />
          </p>
          <p className="mt-2 md:mt-0">
            © 2026 <span className="font-semibold text-white">EQuran.id</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

