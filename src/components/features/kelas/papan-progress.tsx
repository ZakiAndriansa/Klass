"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  CircleDot,
  GripVertical,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { TombolKertas } from "@/components/shared/tombol-kertas";
import { cn } from "@/lib/utils";

import type {
  AnggotaKelas,
  AnggotaProgress,
  MataKuliah,
  PeranKelas,
  StatusTugas,
  TugasProgress,
} from "./data-contoh";

const kolom: { id: StatusTugas; judul: string }[] = [
  { id: "todo", judul: "Belum mulai" },
  { id: "doing", judul: "Sedang dikerjakan" },
  { id: "done", judul: "Selesai" },
];

const prioritasKelas: Record<TugasProgress["prioritas"], string> = {
  Rendah: "kelas-prioritas--rendah",
  Sedang: "kelas-prioritas--sedang",
  Tinggi: "kelas-prioritas--tinggi",
};

function statusAnggota(
  anggota: AnggotaProgress,
  tugasId: string,
  idSaya: string,
  statusSaya: Record<string, StatusTugas>,
): StatusTugas {
  if (anggota.id === idSaya) return statusSaya[tugasId] ?? "todo";
  return anggota.status[tugasId] ?? "todo";
}

/**
 * Papan progress tugas kelas.
 *
 * Aturan peran:
 * - semua anggota boleh memindahkan status tugasnya sendiri, lewat drag atau
 *   select (select adalah jalur keyboard dan sentuh yang setara);
 * - PJ dan admin kelas boleh menambah tugas baru dan menghapus tugas;
 * - hanya PJ/admin yang melihat tab "Progres anggota" berisi ringkasan semua
 *   anggota dan rekap per tugas.
 *
 * TODO(api): state masih lokal. Saat endpoint tersedia, ganti `useState` awal
 * dengan data server dan kirim perubahan status/tugas lewat aksi:
 *   PATCH /api/v1/classes/{classId}/progress/{taskId}
 *   POST  /api/v1/classes/{classId}/tasks
 *   DELETE /api/v1/classes/{classId}/tasks/{taskId}
 */
export function PapanProgress({
  tugasAwal,
  statusAwal,
  anggotaProgres,
  anggota,
  mataKuliah,
  peran,
  idSaya,
  namaSaya,
}: {
  tugasAwal: TugasProgress[];
  statusAwal: Record<string, StatusTugas>;
  anggotaProgres: AnggotaProgress[];
  anggota: AnggotaKelas[];
  mataKuliah: MataKuliah[];
  peran: PeranKelas;
  idSaya: string;
  namaSaya: string;
}) {
  const pengelola = peran === "PJ" || peran === "Admin kelas";
  const [tugas, setTugas] = useState<TugasProgress[]>(tugasAwal);
  const [statusSaya, setStatusSaya] = useState<Record<string, StatusTugas>>(statusAwal);
  const [tampilan, setTampilan] = useState<"papan" | "anggota">("papan");
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [judulBaru, setJudulBaru] = useState("");
  const [mapelBaru, setMapelBaru] = useState(mataKuliah[0]?.nama ?? "");
  const [deadlineBaru, setDeadlineBaru] = useState("");
  const [prioritasBaru, setPrioritasBaru] = useState<TugasProgress["prioritas"]>("Sedang");
  const [seretId, setSeretId] = useState<string | null>(null);
  const [kolomHover, setKolomHover] = useState<StatusTugas | null>(null);

  const jumlah = useMemo(() => {
    return {
      todo: tugas.filter((item) => (statusSaya[item.id] ?? "todo") === "todo").length,
      doing: tugas.filter((item) => statusSaya[item.id] === "doing").length,
      done: tugas.filter((item) => statusSaya[item.id] === "done").length,
    };
  }, [statusSaya, tugas]);

  const persenSaya = tugas.length === 0 ? 0 : Math.round((jumlah.done / tugas.length) * 100);

  const barisAnggota = useMemo<AnggotaProgress[]>(() => {
    if (anggotaProgres.length > 0) return anggotaProgres;

    return anggota.map((anggota: AnggotaKelas) => ({
      ...anggota,
      status: {},
    }));
  }, [anggotaProgres, anggota]);

  const statistikAnggota = useMemo(() => {
    const nilai = barisAnggota.map((anggota) => {
      const selesai = tugas.filter(
        (item) => statusAnggota(anggota, item.id, idSaya, statusSaya) === "done",
      ).length;
      const dikerjakan = tugas.filter(
        (item) => statusAnggota(anggota, item.id, idSaya, statusSaya) === "doing",
      ).length;

      return {
        anggota,
        selesai,
        dikerjakan,
        belum: tugas.length - selesai - dikerjakan,
        persen: tugas.length === 0 ? 0 : Math.round((selesai / tugas.length) * 100),
      };
    });

    const rata =
      nilai.length === 0
        ? 0
        : Math.round(nilai.reduce((total, item) => total + item.persen, 0) / nilai.length);

    return {
      nilai,
      rata,
      tuntas: nilai.filter((item) => tugas.length > 0 && item.selesai === tugas.length).length,
      berjalan: nilai.filter((item) => item.persen > 0 && item.selesai < tugas.length).length,
      belumMulai: nilai.filter((item) => item.persen === 0).length,
    };
  }, [barisAnggota, idSaya, statusSaya, tugas]);

  const rekapTugas = useMemo(() => {
    return tugas.map((item) => {
      const nilai = barisAnggota.map((anggota) =>
        statusAnggota(anggota, item.id, idSaya, statusSaya),
      );
      return {
        tugas: item,
        selesai: nilai.filter((status) => status === "done").length,
        dikerjakan: nilai.filter((status) => status === "doing").length,
        belum: nilai.filter((status) => status === "todo").length,
        total: nilai.length,
      };
    });
  }, [barisAnggota, idSaya, statusSaya, tugas]);

  function ubahStatus(tugasId: string, status: StatusTugas) {
    setStatusSaya((lama) => ({ ...lama, [tugasId]: status }));
  }

  function tambahTugas(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const judul = judulBaru.trim();
    if (!judul) return;

    const id = `tugas-baru-${Date.now()}`;
    const baru: TugasProgress = {
      id,
      judul,
      mataKuliah: mapelBaru,
      deadline: deadlineBaru.trim() || "Tanpa tenggat",
      prioritas: prioritasBaru,
      status: "todo",
      deskripsi: "Ditambahkan dari papan progress.",
    };

    setTugas((lama) => [baru, ...lama]);
    setStatusSaya((lama) => ({ ...lama, [id]: "todo" }));
    setJudulBaru("");
    setDeadlineBaru("");
    setPrioritasBaru("Sedang");
    setFormTerbuka(false);
  }

  function hapusTugas(tugasId: string) {
    if (!pengelola) return;
    setTugas((lama) => lama.filter((item) => item.id !== tugasId));
    setStatusSaya((lama) => {
      const salinan = { ...lama };
      delete salinan[tugasId];
      return salinan;
    });
  }

  function jatuhkan(e: React.DragEvent<HTMLDivElement>, status: StatusTugas) {
    e.preventDefault();
    const id = seretId ?? e.dataTransfer.getData("text/plain");
    if (id) ubahStatus(id, status);
    setSeretId(null);
    setKolomHover(null);
  }

  return (
    <div className="papan">
      <div className="papan__ringkas">
        <div className="papan__ringkas-utama">
          <span className="papan__ringkas-label">Progres saya</span>
          <strong className="papan__ringkas-angka">
            {persenSaya}
            <span>%</span>
          </strong>
          <div
            className="kelas-progres-bar kelas-progres-bar--tebal"
            role="progressbar"
            aria-valuenow={persenSaya}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progres tugas pribadi"
          >
            <span style={{ width: `${persenSaya}%` }} />
          </div>
          <span className="papan__ringkas-ket">
            {jumlah.done} dari {tugas.length} tugas selesai · {namaSaya}
          </span>
        </div>

        <ul className="papan__stat">
          <li>
            <Circle size={15} aria-hidden="true" className="kelas-ikon-todo" />
            <strong>{jumlah.todo}</strong>
            <span>Belum mulai</span>
          </li>
          <li>
            <CircleDot size={15} aria-hidden="true" className="kelas-ikon-doing" />
            <strong>{jumlah.doing}</strong>
            <span>Dikerjakan</span>
          </li>
          <li>
            <CheckCircle2 size={15} aria-hidden="true" className="kelas-ikon-done" />
            <strong>{jumlah.done}</strong>
            <span>Selesai</span>
          </li>
        </ul>
      </div>

      <div className="papan__toolbar">
        <div className="papan__tablist" role="group" aria-label="Tampilan papan progress">
          <button
            type="button"
            aria-pressed={tampilan === "papan"}
            className={cn("papan__tab", tampilan === "papan" && "is-active")}
            onClick={() => setTampilan("papan")}
          >
            Papan saya
          </button>
          {pengelola ? (
            <button
              type="button"
              aria-pressed={tampilan === "anggota"}
              className={cn("papan__tab", tampilan === "anggota" && "is-active")}
              onClick={() => setTampilan("anggota")}
            >
              <Users size={15} aria-hidden="true" />
              Progres anggota
              <span className="papan__tab-hitung">{barisAnggota.length}</span>
            </button>
          ) : null}
        </div>

        {pengelola && tampilan === "papan" ? (
          <TombolKertas
            variant={formTerbuka ? "secondary" : "primary"}
            size="sm"
            onClick={() => setFormTerbuka((nilai) => !nilai)}
            aria-expanded={formTerbuka}
            aria-controls="form-tugas-baru"
          >
            {formTerbuka ? (
              <>
                <X size={15} aria-hidden="true" />
                Tutup
              </>
            ) : (
              <>
                <Plus size={15} aria-hidden="true" />
                Tambah tugas
              </>
            )}
          </TombolKertas>
        ) : null}
      </div>

      {tampilan === "papan" ? (
        <div className="papan__kolom-grid" role="region" aria-label="Papan progress saya">
          {kolom.map((item) => {
            const daftar = tugas.filter(
              (tugasItem) => (statusSaya[tugasItem.id] ?? "todo") === item.id,
            );

            return (
              <section key={item.id} className="papan-kolom" aria-labelledby={`kolom-${item.id}`}>
                <header className="papan-kolom__kepala">
                  <h2 id={`kolom-${item.id}`} className="papan-kolom__judul">
                    <span
                      className={`papan-kolom__titik papan-kolom__titik--${item.id}`}
                      aria-hidden="true"
                    />
                    {item.judul}
                  </h2>
                  <span className="papan-kolom__hitung">{daftar.length}</span>
                </header>

                <div
                  className={cn("papan-kolom__isi", kolomHover === item.id && "is-drag-over")}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (kolomHover !== item.id) setKolomHover(item.id);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setKolomHover(null);
                  }}
                  onDrop={(e) => jatuhkan(e, item.id)}
                >
                  {item.id === "todo" && formTerbuka && pengelola ? (
                    <form id="form-tugas-baru" className="papan-form" onSubmit={tambahTugas}>
                      <h3 className="papan-form__judul">Tugas baru</h3>

                      <label className="papan-form__label" htmlFor="judul-tugas-baru">
                        Judul tugas
                      </label>
                      <input
                        id="judul-tugas-baru"
                        className="kelas-input"
                        value={judulBaru}
                        onChange={(e) => setJudulBaru(e.target.value)}
                        placeholder="Misalnya: ringkasan bab 5"
                        required
                        autoFocus
                      />

                      <label className="papan-form__label" htmlFor="mapel-tugas-baru">
                        Mata kuliah
                      </label>
                      <select
                        id="mapel-tugas-baru"
                        className="kelas-pilih"
                        value={mapelBaru}
                        onChange={(e) => setMapelBaru(e.target.value)}
                      >
                        {mataKuliah.map((mapel: MataKuliah) => (
                          <option key={mapel.id} value={mapel.nama}>
                            {mapel.nama}
                          </option>
                        ))}
                      </select>

                      <div className="papan-form__baris">
                        <div>
                          <label className="papan-form__label" htmlFor="deadline-tugas-baru">
                            Tenggat
                          </label>
                          <input
                            id="deadline-tugas-baru"
                            className="kelas-input"
                            value={deadlineBaru}
                            onChange={(e) => setDeadlineBaru(e.target.value)}
                            placeholder="28 Nov 2026"
                          />
                        </div>
                        <div>
                          <label className="papan-form__label" htmlFor="prioritas-tugas-baru">
                            Prioritas
                          </label>
                          <select
                            id="prioritas-tugas-baru"
                            className="kelas-pilih"
                            value={prioritasBaru}
                            onChange={(e) =>
                              setPrioritasBaru(e.target.value as TugasProgress["prioritas"])
                            }
                          >
                            <option value="Rendah">Rendah</option>
                            <option value="Sedang">Sedang</option>
                            <option value="Tinggi">Tinggi</option>
                          </select>
                        </div>
                      </div>

                      <div className="papan-form__aksi">
                        <TombolKertas type="submit" size="sm">
                          Simpan tugas
                        </TombolKertas>
                        <button
                          type="button"
                          className="kelas-tombol-teks"
                          onClick={() => setFormTerbuka(false)}
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  ) : null}

                  {daftar.map((itemTugas) => {
                    const status = statusSaya[itemTugas.id] ?? "todo";

                    return (
                      <article
                        key={itemTugas.id}
                        className={cn("papan-kartu", seretId === itemTugas.id && "is-dragging")}
                        draggable
                        onDragStart={(e) => {
                          setSeretId(itemTugas.id);
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", itemTugas.id);
                        }}
                        onDragEnd={() => {
                          setSeretId(null);
                          setKolomHover(null);
                        }}
                      >
                        <div className="papan-kartu__atas">
                          <span className="kelas-lencana kelas-lencana--lembut">
                            {itemTugas.mataKuliah}
                          </span>
                          {pengelola ? (
                            <button
                              type="button"
                              className="papan-kartu__hapus"
                              onClick={() => hapusTugas(itemTugas.id)}
                              aria-label={`Hapus tugas ${itemTugas.judul}`}
                            >
                              <Trash2 size={14} aria-hidden="true" />
                            </button>
                          ) : null}
                        </div>

                        <h3 className="papan-kartu__judul">{itemTugas.judul}</h3>
                        {itemTugas.deskripsi ? (
                          <p className="papan-kartu__deskripsi">{itemTugas.deskripsi}</p>
                        ) : null}

                        <div className="papan-kartu__meta">
                          <span
                            className={`kelas-prioritas ${prioritasKelas[itemTugas.prioritas]}`}
                          >
                            {itemTugas.prioritas}
                          </span>
                          <span>
                            <CalendarDays size={13} aria-hidden="true" />
                            {itemTugas.deadline}
                          </span>
                        </div>

                        <div className="papan-kartu__kaki">
                          <label className="sr-only" htmlFor={`status-${itemTugas.id}`}>
                            Status tugas {itemTugas.judul}
                          </label>
                          <select
                            id={`status-${itemTugas.id}`}
                            className="kelas-pilih kelas-pilih--kecil"
                            value={status}
                            onChange={(e) =>
                              ubahStatus(itemTugas.id, e.target.value as StatusTugas)
                            }
                          >
                            {kolom.map((pilihan) => (
                              <option key={pilihan.id} value={pilihan.id}>
                                {pilihan.judul}
                              </option>
                            ))}
                          </select>
                          <span className="papan-kartu__pegangan" aria-hidden="true">
                            <GripVertical size={15} />
                          </span>
                        </div>
                      </article>
                    );
                  })}

                  {daftar.length === 0 && !(item.id === "todo" && formTerbuka) ? (
                    <p className="papan-kolom__kosong">
                      {item.id === "todo"
                        ? "Tidak ada tugas yang menunggu."
                        : item.id === "doing"
                          ? "Tarik kartu ke sini saat mulai mengerjakan."
                          : "Kartu yang selesai akan muncul di sini."}
                    </p>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="papan-anggota" role="region" aria-label="Progres seluruh anggota">
          <dl className="papan-anggota__ringkas">
            <div>
              <dt>Rata-rata progres</dt>
              <dd>{statistikAnggota.rata}%</dd>
            </div>
            <div>
              <dt>Tuntas</dt>
              <dd>{statistikAnggota.tuntas} anggota</dd>
            </div>
            <div>
              <dt>Sedang berjalan</dt>
              <dd>{statistikAnggota.berjalan} anggota</dd>
            </div>
            <div>
              <dt>Belum mulai</dt>
              <dd>{statistikAnggota.belumMulai} anggota</dd>
            </div>
          </dl>

          <section className="kelas-panel" aria-labelledby="judul-progres-anggota">
            <div className="kelas-panel__kepala">
              <h2 id="judul-progres-anggota" className="kelas-panel__judul">
                Progres per anggota
              </h2>
              <span className="kelas-panel__catatan">
                {tugas.length} tugas · {barisAnggota.length} anggota
              </span>
            </div>

            <ul className="papan-anggota__daftar">
              {statistikAnggota.nilai.map((item) => {
                const label =
                  tugas.length > 0 && item.selesai === tugas.length
                    ? "Selesai"
                    : item.persen === 0 && item.dikerjakan === 0
                      ? "Belum mulai"
                      : "Sedang berjalan";
                const nada =
                  label === "Selesai" ? "selesai" : label === "Belum mulai" ? "belum" : "jalan";

                return (
                  <li key={item.anggota.id} className="papan-anggota__baris">
                    <span className="kelas-avatar" aria-hidden="true">
                      {item.anggota.inisial}
                    </span>

                    <span className="papan-anggota__nama">
                      <strong>
                        {item.anggota.nama}
                        {item.anggota.id === idSaya ? (
                          <span className="papan-anggota__saya"> (saya)</span>
                        ) : null}
                      </strong>
                      <span>
                        {item.anggota.peran}
                        {item.anggota.mataKuliah ? ` · ${item.anggota.mataKuliah}` : ""}
                      </span>
                    </span>

                    <span className="papan-anggota__angka">
                      <strong>
                        {item.selesai}/{tugas.length}
                      </strong>
                      <span>selesai</span>
                    </span>

                    <span className="papan-anggota__bar">
                      <span
                        className="kelas-progres-bar"
                        role="progressbar"
                        aria-valuenow={item.persen}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Progres ${item.anggota.nama}`}
                      >
                        <span style={{ width: `${item.persen}%` }} />
                      </span>
                      <span className="papan-anggota__persen">{item.persen}%</span>
                    </span>

                    <span className={`papan-status papan-status--${nada}`}>{label}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="kelas-panel" aria-labelledby="judul-rekap-tugas">
            <div className="kelas-panel__kepala">
              <h2 id="judul-rekap-tugas" className="kelas-panel__judul">
                Progres per tugas
              </h2>
              <span className="kelas-panel__catatan">Dihitung dari seluruh anggota</span>
            </div>

            <ul className="papan-rekap">
              {rekapTugas.map((item) => {
                const persen = item.total === 0 ? 0 : Math.round((item.selesai / item.total) * 100);

                return (
                  <li key={item.tugas.id} className="papan-rekap__baris">
                    <div className="papan-rekap__atas">
                      <span className="papan-rekap__judul">
                        <strong>{item.tugas.judul}</strong>
                        <span>{item.tugas.mataKuliah}</span>
                      </span>
                      <span className="papan-rekap__angka">
                        {item.selesai}/{item.total} selesai
                      </span>
                    </div>
                    <span
                      className="papan-stack"
                      role="img"
                      aria-label={`${item.selesai} selesai, ${item.dikerjakan} dikerjakan, ${item.belum} belum mulai`}
                    >
                      <span
                        className="papan-stack__selesai"
                        style={{ width: `${(item.selesai / item.total) * 100}%` }}
                      />
                      <span
                        className="papan-stack__jalan"
                        style={{ width: `${(item.dikerjakan / item.total) * 100}%` }}
                      />
                    </span>
                    <p className="papan-rekap__ket">
                      {item.selesai} selesai · {item.dikerjakan} dikerjakan · {item.belum} belum
                      mulai
                      <span className="papan-rekap__persen">{persen}%</span>
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      )}

      <p className="kelas-catatan-kaki">
        Tarik kartu antar-kolom atau ubah lewat menu status. Perubahan hanya bertahan selama halaman
        terbuka sampai API progress tersedia.
      </p>
    </div>
  );
}
