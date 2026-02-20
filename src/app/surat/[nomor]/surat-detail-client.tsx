"use client";

import { useMemo, useRef, useState } from "react";

type Ayat = {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
};

type TafsirItem = {
  ayat: number;
  teks: string;
};

type Props = {
  ayat: Ayat[];
  audioFull: Record<string, string>;
  deskripsi: string;
  tafsir: TafsirItem[];
  jumlahAyat: number;
  suratSelanjutnya: { nomor: number; nama: string; namaLatin: string; jumlahAyat: number } | false;
  suratSebelumnya: { nomor: number; nama: string; namaLatin: string; jumlahAyat: number } | false;
};

const qariOptions = [
  { key: "01", label: "Abdullah Al-Juhany" },
  { key: "02", label: "Abdul Muhsin Al-Qasim" },
  { key: "03", label: "Abdurrahman As-Sudais" },
  { key: "04", label: "Ibrahim Al-Dossari" },
  { key: "05", label: "Misyari Rasyid Al-Afasi" },
  { key: "06", label: "Yasser Al-Dosari" },
];

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

export default function SuratDetailClient({
  ayat,
  audioFull,
  deskripsi,
  tafsir,
  jumlahAyat,
  suratSelanjutnya,
  suratSebelumnya,
}: Props) {
  const [selectedQari, setSelectedQari] = useState("05");
  const [showLatin, setShowLatin] = useState(true);
  const [showTerjemah, setShowTerjemah] = useState(true);
  const [showTafsir, setShowTafsir] = useState(false);
  const [currentAyatAudio, setCurrentAyatAudio] = useState<string | null>(null);
  const [selectedAyat, setSelectedAyat] = useState("Semua");
  const ayatAudioRef = useRef<HTMLAudioElement | null>(null);

  const fullAudioSrc = audioFull?.[selectedQari];
  const tafsirByAyat = useMemo(() => {
    const map = new Map<number, string>();
    tafsir.forEach((t) => map.set(t.ayat, t.teks));
    return map;
  }, [tafsir]);

  const handlePlayAyat = (src?: string) => {
    if (!src) return;
    setCurrentAyatAudio(src);
    if (ayatAudioRef.current) {
      ayatAudioRef.current.pause();
      ayatAudioRef.current.src = src;
      ayatAudioRef.current.play().catch(() => undefined);
    }
  };

  const ayatList = useMemo(() => {
    if (selectedAyat === "Semua") return ayat;
    const num = Number(selectedAyat);
    return ayat.filter((a) => a.nomorAyat === num);
  }, [ayat, selectedAyat]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Ayat:</span>
          <select
            className="bg-transparent border border-gray-700 text-white rounded-lg px-3 py-1.5 outline-none appearance-none cursor-pointer pr-8"
            value={selectedAyat}
            onChange={(e) => setSelectedAyat(e.target.value)}
          >
            <option>Semua</option>
            {Array.from({ length: jumlahAyat }).map((_, idx) => (
              <option key={idx + 1} value={String(idx + 1)}>
                {idx + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400">Qari:</span>
          <select
            className="bg-transparent border border-gray-700 text-white rounded-lg px-3 py-1.5 outline-none appearance-none cursor-pointer pr-8"
            value={selectedQari}
            onChange={(e) => setSelectedQari(e.target.value)}
          >
            {qariOptions.map((q) => (
              <option key={q.key} value={q.key}>
                {q.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-6 ml-auto">
          <button
            type="button"
            onClick={() => setShowLatin((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-language text-gray-400" />
            <span className="text-gray-300">Transliterasi</span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <span
                className={`absolute block w-5 h-5 rounded-full bg-[var(--color-darkbg)] border-4 appearance-none transition-all duration-300 z-10 top-0.5 ${
                  showLatin ? "right-0 border-[var(--color-brand)]" : "left-0 border-gray-600"
                }`}
              />
              <span
                className={`block overflow-hidden h-6 rounded-full ${
                  showLatin ? "bg-[var(--color-brand)]" : "bg-gray-700"
                }`}
              />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setShowTerjemah((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-t text-gray-400" />
            <span className="text-gray-300">Terjemahan</span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <span
                className={`absolute block w-5 h-5 rounded-full bg-[var(--color-darkbg)] border-4 appearance-none transition-all duration-300 z-10 top-0.5 ${
                  showTerjemah ? "right-0 border-[var(--color-brand)]" : "left-0 border-gray-600"
                }`}
              />
              <span
                className={`block overflow-hidden h-6 rounded-full ${
                  showTerjemah ? "bg-[var(--color-brand)]" : "bg-gray-700"
                }`}
              />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setShowTafsir((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-book text-gray-400" />
            <span className="text-gray-300">Tafsir</span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <span
                className={`absolute block w-5 h-5 rounded-full bg-[var(--color-darkbg)] border-4 appearance-none transition-all duration-300 z-10 top-0.5 ${
                  showTafsir ? "right-0 border-[var(--color-brand)]" : "left-0 border-gray-600"
                }`}
              />
              <span
                className={`block overflow-hidden h-6 rounded-full ${
                  showTafsir ? "bg-[var(--color-brand)]" : "bg-gray-700"
                }`}
              />
            </div>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 text-[var(--color-brand)] hover:text-emerald-400 transition font-medium"
            onClick={() => {
              if (fullAudioSrc) handlePlayAyat(fullAudioSrc);
            }}
          >
            <i className="fa-regular fa-circle-play" /> Play Audio Full
          </button>
        </div>
      </div>

      {deskripsi ? (
        <div className="text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: deskripsi }} />
      ) : null}

      <audio ref={ayatAudioRef} className="hidden" />

      <div className="space-y-6">
        {ayatList.map((a) => {
          const tafsirText = tafsirByAyat.get(a.nomorAyat);
          const ayatAudio = a.audio?.[selectedQari];
          return (
            <div
              key={a.nomorAyat}
              className="bg-transparent border border-gray-800/60 rounded-2xl p-6 md:p-8 hover:border-gray-700 transition relative"
            >
              <div className="flex items-center gap-4 text-gray-400 text-sm mb-8">
                <div className="w-8 h-8 rounded-full border border-dashed border-orange-500/50 flex items-center justify-center text-orange-400 font-semibold text-xs">
                  {a.nomorAyat}
                </div>
                <button type="button" onClick={() => handlePlayAyat(ayatAudio)} className="hover:text-[var(--color-brand)] transition">
                  <i className="fa-solid fa-play" />
                </button>
                <button type="button" className="hover:text-[var(--color-brand)] transition">
                  <i className="fa-solid fa-arrow-right-to-bracket" />
                </button>
                <button type="button" className="hover:text-[var(--color-brand)] transition">
                  <i className="fa-regular fa-copy" />
                </button>
                <button type="button" className="hover:text-[var(--color-brand)] transition">
                  <i className="fa-solid fa-share-nodes" />
                </button>
              </div>

              <div className="text-right mb-8">
                <p className="font-arabic text-4xl md:text-5xl leading-loose text-white">{a.teksArab}</p>
              </div>

              <div className="space-y-3">
                {showLatin ? <p className="text-gray-400 italic font-medium">{a.teksLatin}</p> : null}
                {showTerjemah ? (
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">{a.teksIndonesia}</p>
                ) : null}
                {showTafsir && tafsirText ? (
                  <div className="text-sm text-gray-400 whitespace-pre-line">{tafsirText}</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          {suratSebelumnya ? (
            <a
              href={`/surat/${toSlug(suratSebelumnya.nomor, suratSebelumnya.namaLatin)}/`}
              className="flex items-center gap-2 rounded-full border border-gray-800 px-4 py-2 text-sm text-gray-300 hover:text-white"
            >
              <i className="fa-solid fa-arrow-left" /> Surat Sebelumnya
            </a>
          ) : null}
        </div>
        <div>
          {suratSelanjutnya ? (
            <a
              href={`/surat/${toSlug(suratSelanjutnya.nomor, suratSelanjutnya.namaLatin)}/`}
              className="flex items-center gap-2 rounded-full border border-gray-800 px-4 py-2 text-sm text-gray-300 hover:text-white"
            >
              Surat Selanjutnya <i className="fa-solid fa-arrow-right" />
            </a>
          ) : null}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-[#060910] border-t border-gray-800 flex items-center justify-between px-4 md:px-8 z-50">
        <div className="flex items-center gap-4 w-1/4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-black shadow-[0_0_15px_rgba(52,211,153,0.3)]">
            <i className="fa-solid fa-volume-high" />
          </div>
          <div className="hidden md:block">
            <h4 className="text-white font-semibold text-sm">Now Playing</h4>
            <p className="text-gray-500 text-xs">
              {qariOptions.find((q) => q.key === selectedQari)?.label ?? ""}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center w-2/4 gap-2">
          <div className="flex items-center gap-6 text-gray-400">
            <button className="hover:text-white transition" type="button">
              <i className="fa-solid fa-backward-step" />
            </button>
            <button className="hover:text-white transition" type="button">
              <i className="fa-solid fa-rotate-left" />
            </button>
            <button
              className="w-10 h-10 bg-[var(--color-brand)] text-black rounded-full flex items-center justify-center hover:bg-emerald-400 transition transform hover:scale-105"
              type="button"
              onClick={() => {
                if (fullAudioSrc) handlePlayAyat(fullAudioSrc);
              }}
            >
              <i className="fa-solid fa-play ml-1" />
            </button>
            <button className="hover:text-white transition" type="button">
              <i className="fa-solid fa-forward-step" />
            </button>
            <button className="hover:text-white transition" type="button">
              <i className="fa-solid fa-volume-high" />
            </button>
          </div>
          <div className="w-full flex items-center gap-3 text-[10px] text-gray-500 font-medium">
            <span>0:00</span>
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full relative cursor-pointer group">
              <div className="absolute left-0 top-0 h-full w-[15%] bg-[var(--color-brand)] rounded-full" />
              <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-3 h-3 bg-[var(--color-brand)] rounded-full shadow opacity-0 group-hover:opacity-100 transition" />
            </div>
            <span>1:25:39</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 w-1/4 text-gray-400">
          <button className="hover:text-white transition hidden md:block" type="button">
            <i className="fa-solid fa-up-right-and-down-left-from-center" />
          </button>
          <button className="hover:text-white transition" type="button">
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
