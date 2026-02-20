import Link from "next/link";
import SuratDetailClient from "./surat-detail-client";

export const dynamic = "force-static";

type SurahListItem = {
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
  data: SurahListItem[];
};

type Ayat = {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
};

type SurahDetail = {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
  ayat: Ayat[];
  suratSelanjutnya: { nomor: number; nama: string; namaLatin: string; jumlahAyat: number } | false;
  suratSebelumnya: { nomor: number; nama: string; namaLatin: string; jumlahAyat: number } | false;
};

type ApiDetailResponse = {
  code: number;
  message: string;
  data: SurahDetail;
};

type TafsirItem = {
  ayat: number;
  teks: string;
};

type ApiTafsirResponse = {
  code: number;
  message: string;
  data: {
    tafsir: TafsirItem[];
  };
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

function nomorFromSlug(slug?: string | null): string {
  if (!slug) return "";
  const head = slug.split("-")[0];
  if (!head || Number.isNaN(Number(head))) return slug;
  return head;
}

async function getSurahList(): Promise<SurahListItem[]> {
  const res = await fetch("https://equran.id/api/v2/surat", {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Gagal ambil daftar surat");
  const json: ApiListResponse = await res.json();
  return json.data;
}

async function getSurahDetail(nomor: string): Promise<SurahDetail> {
  const res = await fetch(`https://equran.id/api/v2/surat/${nomor}`, {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Gagal ambil detail surat");
  const json: ApiDetailResponse = await res.json();
  return json.data;
}

async function getSurahTafsir(nomor: string): Promise<TafsirItem[]> {
  const res = await fetch(`https://equran.id/api/v2/tafsir/${nomor}`, {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Gagal ambil tafsir surat");
  const json: ApiTafsirResponse = await res.json();
  return json.data.tafsir ?? [];
}

export async function generateStaticParams() {
  const list = await getSurahList();
  return list.map((s) => ({ nomor: toSlug(s.nomor, s.namaLatin) }));
}

export default async function SuratDetailPage({
  params,
}: {
  params: { nomor: string } | Promise<{ nomor: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const nomor = nomorFromSlug(resolvedParams?.nomor);
  if (!nomor) {
    throw new Error("Param nomor tidak ditemukan");
  }
  const [list, data, tafsir] = await Promise.all([
    getSurahList(),
    getSurahDetail(nomor),
    getSurahTafsir(nomor),
  ]);

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
          <Link href="/" className="flex items-center gap-2 hover:text-white transition">
            <i className="fa-solid fa-house" /> Beranda
          </Link>
          <span className="flex items-center gap-2 text-[var(--color-brand)]">
            <i className="fa-solid fa-book-quran" /> Alquran
          </span>
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

      <div className="flex-1 flex overflow-hidden relative">
        <aside className="hidden md:flex flex-col w-[320px] lg:w-[350px] border-r border-gray-800/60 bg-[#0a0e17] flex-none z-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Daftar Surat</h2>
            <span className="text-xs text-gray-500">{list.length} surat</span>
          </div>
          <div className="relative mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <i className="fa-solid fa-magnifying-glass" />
            </div>
            <input
              type="text"
              placeholder="Cari surat..."
              className="block w-full rounded-xl border border-gray-800 bg-[#0b1220] py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-[var(--color-brand)]"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {list.map((s) => {
              const slug = toSlug(s.nomor, s.namaLatin);
              const active = s.nomor === data.nomor;
              return (
                <Link
                  key={s.nomor}
                  href={`/surat/${slug}/`}
                  className={`rounded-xl p-4 flex items-center justify-between cursor-pointer transition ${
                    active
                      ? "bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/50"
                      : "border border-transparent hover:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-orange-500/50 text-sm font-semibold text-orange-400">
                      {s.nomor}
                    </div>
                    <div>
                      <h4 className={`font-semibold text-sm ${active ? "text-white" : "text-gray-300"}`}>
                        {s.namaLatin}
                      </h4>
                      <p className={`text-xs mb-1 ${active ? "text-gray-400" : "text-gray-500"}`}>
                        {s.arti}
                      </p>
                      <div className={`flex items-center gap-2 text-[9px] ${active ? "text-[var(--color-brand)]" : "text-gray-500"}`}>
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-location-dot" /> {s.tempatTurun}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fa-regular fa-file-lines" /> {s.jumlahAyat}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`font-arabic text-xl ${active ? "text-[var(--color-brand)]" : "text-[var(--color-brand)]/70"}`}>
                    {s.nama}
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-y-auto pb-28 relative">
          <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition">
              <i className="fa-solid fa-arrow-left" /> Kembali ke Beranda
            </Link>

            <div className="bg-[#0f1522] border border-gray-800 rounded-2xl p-6 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-dashed border-orange-500/50 flex items-center justify-center text-orange-400 font-bold text-lg">
                  {data.nomor}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-white font-bold text-xl md:text-2xl">{data.namaLatin}</h1>
                    <span className="text-gray-500 text-sm">• {data.arti}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-location-dot text-gray-500" /> {data.tempatTurun}
                    </span>
                    <span>•</span>
                    <span>{data.jumlahAyat} Ayat</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-[var(--color-brand)] font-arabic text-4xl hidden md:block">{data.nama}</div>
                <i className="fa-solid fa-chevron-down text-gray-500 cursor-pointer hover:text-white" />
              </div>
            </div>

            <SuratDetailClient
              ayat={data.ayat}
              audioFull={data.audioFull}
              deskripsi={data.deskripsi}
              tafsir={tafsir}
              jumlahAyat={data.jumlahAyat}
              suratSelanjutnya={data.suratSelanjutnya}
              suratSebelumnya={data.suratSebelumnya}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
