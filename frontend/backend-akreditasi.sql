-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 21, 2026 at 06:52 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `backend-akreditasi`
--

-- --------------------------------------------------------

--
-- Table structure for table `1a1_pimpinan_dan_tupoksi`
--

CREATE TABLE `1a1_pimpinan_dan_tupoksi` (
  `id_pimpinan` int NOT NULL,
  `id_pegawai` int NOT NULL,
  `periode_mulai` year NOT NULL,
  `periode_selesai` year NOT NULL,
  `tupoksi` text,
  `sks_jabatan` decimal(4,2) DEFAULT '0.00',
  `id_jafung` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `1a1_pimpinan_dan_tupoksi`
--

INSERT INTO `1a1_pimpinan_dan_tupoksi` (`id_pimpinan`, `id_pegawai`, `periode_mulai`, `periode_selesai`, `tupoksi`, `sks_jabatan`, `id_jafung`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 2, 2023, 2024, 'blablabla', '7.00', NULL, '2026-04-15 09:18:08', 3, NULL, NULL, NULL, NULL),
(2, 1, 2024, 2026, 'bla', '0.00', NULL, '2026-04-15 09:19:41', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `1a2_sumber_pendanaan_upps`
--

CREATE TABLE `1a2_sumber_pendanaan_upps` (
  `id_sumber` int NOT NULL,
  `id_prodi` int NOT NULL,
  `nama_sumber` varchar(255) NOT NULL,
  `jumlah_dana` int NOT NULL COMMENT 'Dalam jutaan rupiah',
  `link_bukti` varchar(255) NOT NULL,
  `id_tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `1a2_sumber_pendanaan_upps`
--

INSERT INTO `1a2_sumber_pendanaan_upps` (`id_sumber`, `id_prodi`, `nama_sumber`, `jumlah_dana`, `link_bukti`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'SPP Mahasiswa', 15000000, 'https://vsdg', 3, '2026-04-13 12:08:40', 3, NULL, NULL, NULL, NULL),
(2, 1, 'SPP Mahasiswa', 5000000, 'https://ghhjh.gdrive', 2, '2026-04-29 08:01:37', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `1a3_penggunaan_dana_upps`
--

CREATE TABLE `1a3_penggunaan_dana_upps` (
  `id_penggunaan` int NOT NULL,
  `id_prodi` int NOT NULL,
  `nama_penggunaan` varchar(255) NOT NULL COMMENT 'Contoh: Pendidikan, Penelitian, PkM, dll',
  `jumlah_dana` int DEFAULT '0' COMMENT 'Dalam jutaan rupiah',
  `link_bukti` varchar(255) NOT NULL,
  `id_tahun` int NOT NULL COMMENT 'Tahun Akademik (TS)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `1a3_penggunaan_dana_upps`
--

INSERT INTO `1a3_penggunaan_dana_upps` (`id_penggunaan`, `id_prodi`, `nama_penggunaan`, `jumlah_dana`, `link_bukti`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'Lomba Mahasiswa', 3000000, 'https://ghhjh.gdrive', 3, '2026-04-14 05:36:51', 3, '2026-04-21 20:04:58', NULL, NULL, NULL),
(2, 1, 'Lomba Mahasiswa', 2000000, 'https://ghhjh.gdrive', 2, '2026-04-14 05:37:07', 3, '2026-04-21 20:07:54', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `1a4_beban_dtpr`
--

CREATE TABLE `1a4_beban_dtpr` (
  `id_beban_kerja` int NOT NULL,
  `id_dosen` int NOT NULL,
  `id_pimpinan` int DEFAULT NULL,
  `sks_ps_sendiri` decimal(4,2) DEFAULT '0.00',
  `sks_ps_lain` decimal(4,2) DEFAULT '0.00',
  `sks_pt_lain` decimal(4,2) DEFAULT '0.00',
  `sks_penelitian` decimal(4,2) DEFAULT '0.00',
  `sks_pkm` decimal(4,2) DEFAULT '0.00',
  `sks_manajemen_pt_lain` decimal(4,2) DEFAULT '0.00',
  `id_tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `1a4_beban_dtpr`
--

INSERT INTO `1a4_beban_dtpr` (`id_beban_kerja`, `id_dosen`, `id_pimpinan`, `sks_ps_sendiri`, `sks_ps_lain`, `sks_pt_lain`, `sks_penelitian`, `sks_pkm`, `sks_manajemen_pt_lain`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 2, 1, '1.00', '1.00', '1.00', '1.00', '1.00', '1.00', 1, '2026-04-08 07:02:44', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `1a5_kualifikasi_tendik`
--

CREATE TABLE `1a5_kualifikasi_tendik` (
  `id_1a5` int NOT NULL,
  `id_prodi` int NOT NULL,
  `id_tahun` int NOT NULL,
  `id_tendik` int NOT NULL,
  `pendidikan_snapshot` varchar(50) NOT NULL,
  `jenis_tendik_snapshot` varchar(100) NOT NULL,
  `nama_unit_snapshot` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `1a5_kualifikasi_tendik`
--

INSERT INTO `1a5_kualifikasi_tendik` (`id_1a5`, `id_prodi`, `id_tahun`, `id_tendik`, `pendidikan_snapshot`, `jenis_tendik_snapshot`, `nama_unit_snapshot`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 3, 2, 'S1', 'Laboran/Teknisi', 'SISFO', '2026-04-16 06:44:24', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `1b_unit_spmi_dan_sdm`
--

CREATE TABLE `1b_unit_spmi_dan_sdm` (
  `id_unit_spmi` int NOT NULL,
  `jenis_unit` varchar(50) DEFAULT NULL,
  `dokumen_spmi` varchar(255) DEFAULT NULL COMMENT 'Link Dokumen SPMI',
  `jumlah_auditor` int DEFAULT '0',
  `auditor_certified` int DEFAULT '0',
  `auditor_non_certified` int DEFAULT '0',
  `frekuensi_audit` int DEFAULT '0' COMMENT 'Frekuensi Audit per Tahun',
  `bukti_certified_auditor` varchar(255) DEFAULT NULL COMMENT 'Link Bukti Sertifikat',
  `laporan_audit` varchar(255) DEFAULT NULL COMMENT 'Link Laporan Hasil Audit',
  `unit_kerja_id_unit` int NOT NULL,
  `tahun_akademik_id_tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `1b_unit_spmi_dan_sdm`
--

INSERT INTO `1b_unit_spmi_dan_sdm` (`id_unit_spmi`, `jenis_unit`, `dokumen_spmi`, `jumlah_auditor`, `auditor_certified`, `auditor_non_certified`, `frekuensi_audit`, `bukti_certified_auditor`, `laporan_audit`, `unit_kerja_id_unit`, `tahun_akademik_id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 'Unit Penjaminan Mutu Internal', 'https://drjhgjyu', 2, 1, 1, 1, 'https://drjhgjyu', 'https://drjhgjyu', 9, 1, '2026-04-13 03:52:34', 3, '2026-05-15 03:34:00', 9, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2a1_data_mahasiswa`
--

CREATE TABLE `2a1_data_mahasiswa` (
  `id_2a1` int UNSIGNED NOT NULL,
  `prodi_id_prodi` int NOT NULL,
  `tahun_akademik_id_tahun` int NOT NULL,
  `daya_tampung` int UNSIGNED DEFAULT '0',
  `pendaftar` int UNSIGNED DEFAULT '0',
  `pendaftar_afirmasi` int UNSIGNED DEFAULT '0',
  `pendaftar_khusus` int UNSIGNED DEFAULT '0',
  `maba_reg_diterima` int UNSIGNED DEFAULT '0',
  `maba_reg_afirmasi` int UNSIGNED DEFAULT '0',
  `maba_reg_khusus` int UNSIGNED DEFAULT '0',
  `maba_rpl_diterima` int UNSIGNED DEFAULT '0',
  `maba_rpl_afirmasi` int UNSIGNED DEFAULT '0',
  `maba_rpl_khusus` int UNSIGNED DEFAULT '0',
  `aktif_reg_diterima` int UNSIGNED DEFAULT '0',
  `aktif_reg_afirmasi` int UNSIGNED DEFAULT '0',
  `aktif_reg_khusus` int UNSIGNED DEFAULT '0',
  `aktif_rpl_diterima` int UNSIGNED DEFAULT '0',
  `aktif_rpl_afirmasi` int UNSIGNED DEFAULT '0',
  `aktif_rpl_khusus` int UNSIGNED DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `pmb_deleted_at` datetime DEFAULT NULL,
  `pmb_deleted_by` int DEFAULT NULL,
  `ala_deleted_at` datetime DEFAULT NULL,
  `ala_deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `2a1_data_mahasiswa`
--

INSERT INTO `2a1_data_mahasiswa` (`id_2a1`, `prodi_id_prodi`, `tahun_akademik_id_tahun`, `daya_tampung`, `pendaftar`, `pendaftar_afirmasi`, `pendaftar_khusus`, `maba_reg_diterima`, `maba_reg_afirmasi`, `maba_reg_khusus`, `maba_rpl_diterima`, `maba_rpl_afirmasi`, `maba_rpl_khusus`, `aktif_reg_diterima`, `aktif_reg_afirmasi`, `aktif_reg_khusus`, `aktif_rpl_diterima`, `aktif_rpl_afirmasi`, `aktif_rpl_khusus`, `created_at`, `created_by`, `updated_at`, `updated_by`, `pmb_deleted_at`, `pmb_deleted_by`, `ala_deleted_at`, `ala_deleted_by`) VALUES
(40, 1, 1, 120, 180, 10, 2, 105, 8, 1, 5, NULL, NULL, 410, 25, 3, 15, 0, 0, '2026-05-13 14:18:44', 1, '2026-05-13 15:26:16', 1, NULL, NULL, NULL, NULL),
(47, 1, 2, 110, 170, 11, 3, 85, 9, 2, 6, 1, 0, 80, 9, 2, 6, 1, 0, '2026-05-13 15:40:19', 1, NULL, NULL, NULL, NULL, NULL, NULL),
(48, 1, 3, 120, 190, 12, 4, 90, 10, 3, 7, 1, 0, 85, 10, 3, 7, 1, 0, '2026-05-13 15:40:19', 1, NULL, NULL, NULL, NULL, NULL, NULL),
(49, 1, 4, 130, 210, 13, 5, 95, 11, 4, 8, 1, 0, 90, 11, 4, 8, 1, 0, '2026-05-13 15:40:19', 1, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2a2_keragaman_asal_maba`
--

CREATE TABLE `2a2_keragaman_asal_maba` (
  `id_2a2` int NOT NULL,
  `prodi_id_prodi` int NOT NULL,
  `tahun_akademik_id_tahun` int NOT NULL,
  `jml_lokal` int DEFAULT '0' COMMENT 'Kota/Kabupaten sama dengan PS',
  `jml_regional` int DEFAULT '0' COMMENT 'Luar Kabupaten, Dalam Jatim',
  `jml_nasional` int DEFAULT '0' COMMENT 'Luar Jatim, Dalam Indonesia',
  `jml_internasional` int DEFAULT '0' COMMENT 'Luar Negeri',
  `jml_afirmasi` int DEFAULT '0' COMMENT 'Jalur Afirmasi',
  `jml_khusus` int DEFAULT '0' COMMENT 'Berkebutuhan Khusus',
  `ket_lokal` text COLLATE utf8mb4_unicode_ci,
  `ket_regional` text COLLATE utf8mb4_unicode_ci,
  `ket_nasional` text COLLATE utf8mb4_unicode_ci,
  `ket_internasional` text COLLATE utf8mb4_unicode_ci,
  `ket_afirmasi` text COLLATE utf8mb4_unicode_ci,
  `ket_khusus` text COLLATE utf8mb4_unicode_ci,
  `link_lokal` text COLLATE utf8mb4_unicode_ci,
  `link_regional` text COLLATE utf8mb4_unicode_ci,
  `link_nasional` text COLLATE utf8mb4_unicode_ci,
  `link_internasional` text COLLATE utf8mb4_unicode_ci,
  `link_afirmasi` text COLLATE utf8mb4_unicode_ci,
  `link_khusus` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `pmb_deleted_at` datetime DEFAULT NULL,
  `pmb_deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `2a2_keragaman_asal_maba`
--

INSERT INTO `2a2_keragaman_asal_maba` (`id_2a2`, `prodi_id_prodi`, `tahun_akademik_id_tahun`, `jml_lokal`, `jml_regional`, `jml_nasional`, `jml_internasional`, `jml_afirmasi`, `jml_khusus`, `ket_lokal`, `ket_regional`, `ket_nasional`, `ket_internasional`, `ket_afirmasi`, `ket_khusus`, `link_lokal`, `link_regional`, `link_nasional`, `link_internasional`, `link_afirmasi`, `link_khusus`, `created_at`, `updated_at`, `created_by`, `updated_by`, `pmb_deleted_at`, `pmb_deleted_by`) VALUES
(1, 1, 1, 69, 10, 10, 1, 8, 1, '[{\"jml\":69,\"ket\":\"Banyuwangi\"}]', '[{\"jml\":5,\"ket\":\"Jember\"},{\"jml\":5,\"ket\":\"Pasuruan\"}]', '[{\"jml\":5,\"ket\":\"Jembrana\"},{\"jml\":5,\"ket\":\"Tegal\"}]', '[{\"jml\":1,\"ket\":\"Malaysia\"}]', '[{\"jml\":8,\"ket\":\"Banyuwangi\"}]', '[{\"jml\":1,\"ket\":\"Banyuwangi\"}]', 'https://hjsxbj.com', 'https://skjhijs.com', 'htpps://hwsiun.com', 'https://ajhdjhdj', 'https://hshnkjn', 'https://ajwjwh', '2026-05-17 21:34:16', '2026-05-18 04:15:48', 3, 3, NULL, NULL),
(7, 1, 2, 40, 10, 0, 0, 8, 0, '[{\"jml\":40,\"ket\":\"Banyuwangi\"}]', '[{\"jml\":5,\"ket\":\"Jember\"},{\"jml\":5,\"ket\":\"Jombang\"}]', '[{\"jml\":0,\"ket\":\"\"}]', '[{\"jml\":0,\"ket\":\"\"}]', '[{\"jml\":8,\"ket\":\"Banyuwangi\"}]', '[{\"jml\":0,\"ket\":\"\"}]', 'https://hjsxbj.com', 'https://skjhijs.com', '', '', 'https://ksjk', 'https://ajwjwh', '2026-05-18 05:21:58', '2026-05-18 05:21:58', 3, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2a3_kondisi_mahasiswa`
--

CREATE TABLE `2a3_kondisi_mahasiswa` (
  `id_2a3` int NOT NULL,
  `prodi_id_prodi` int NOT NULL,
  `id_tahun` int NOT NULL COMMENT 'Tahun Angkatan (Cohort Academic Year)',
  `maba` int NOT NULL DEFAULT '0' COMMENT 'Disinkronkan otomatis dari 2.A.1',
  `lulus` int NOT NULL DEFAULT '0' COMMENT 'Jumlah akumulatif yang lulus',
  `do` int NOT NULL DEFAULT '0' COMMENT 'Mengundurkan diri / Drop Out',
  `aktif` int NOT NULL DEFAULT '0' COMMENT 'Disinkronkan langsung dari data Mahasiswa Aktif Tabel 2.A.1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `ala_deleted_at` datetime DEFAULT NULL,
  `ala_deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `2b1_isi_pembelajaran`
--

CREATE TABLE `2b1_isi_pembelajaran` (
  `id_2b1` int NOT NULL,
  `id_mk` int NOT NULL,
  `id_pl` int NOT NULL,
  `id_tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `2b1_isi_pembelajaran`
--

INSERT INTO `2b1_isi_pembelajaran` (`id_2b1`, `id_mk`, `id_pl`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(14, 1, 5, 2, '2026-05-12 19:01:02', 3, NULL, NULL, NULL, NULL),
(15, 1, 6, 2, '2026-05-12 19:01:02', 3, NULL, NULL, NULL, NULL),
(16, 1, 9, 2, '2026-05-12 19:01:02', 3, '2026-05-12 19:01:14', 3, '2026-05-12 19:01:14', 3),
(17, 1, 5, 1, '2026-05-21 05:36:29', NULL, NULL, NULL, NULL, NULL),
(18, 1, 6, 1, '2026-05-21 05:36:29', NULL, NULL, NULL, NULL, NULL),
(19, 1, 10, 1, '2026-05-21 05:37:04', NULL, NULL, NULL, NULL, NULL),
(20, 1, 12, 1, '2026-05-21 05:37:04', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2b2_pemetaan_cpl_pl`
--

CREATE TABLE `2b2_pemetaan_cpl_pl` (
  `id_2b2` int NOT NULL,
  `id_cpl` int NOT NULL,
  `id_pl` int NOT NULL,
  `id_tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `2b2_pemetaan_cpl_pl`
--

INSERT INTO `2b2_pemetaan_cpl_pl` (`id_2b2`, `id_cpl`, `id_pl`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(191, 1, 5, 2, '2026-05-11 22:27:51', 3, NULL, NULL, NULL, NULL),
(193, 1, 9, 2, '2026-05-11 22:27:51', 3, NULL, NULL, NULL, NULL),
(199, 1, 6, 2, '2026-05-12 21:17:06', 3, NULL, NULL, NULL, NULL),
(200, 1, 10, 2, '2026-05-12 21:17:06', 3, NULL, NULL, NULL, NULL),
(201, 1, 11, 2, '2026-05-12 21:17:06', 3, NULL, NULL, NULL, NULL),
(202, 1, 12, 2, '2026-05-12 21:17:06', 3, NULL, NULL, NULL, NULL),
(203, 1, 13, 2, '2026-05-12 21:17:06', 3, NULL, NULL, NULL, NULL),
(204, 1, 17, 2, '2026-05-12 21:17:35', 3, NULL, NULL, NULL, NULL),
(205, 1, 16, 2, '2026-05-12 21:17:35', 3, NULL, NULL, NULL, NULL),
(206, 1, 15, 2, '2026-05-12 21:17:35', 3, NULL, NULL, NULL, NULL),
(207, 1, 14, 2, '2026-05-12 21:17:35', 3, NULL, NULL, NULL, NULL),
(208, 1, 18, 2, '2026-05-12 21:17:35', 3, NULL, NULL, NULL, NULL),
(209, 1, 5, 1, '2026-05-21 05:41:45', NULL, NULL, NULL, NULL, NULL),
(210, 1, 9, 1, '2026-05-21 05:41:45', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2b3_peta_pemenuhan_cpl`
--

CREATE TABLE `2b3_peta_pemenuhan_cpl` (
  `id_2b3` int NOT NULL,
  `id_cpl` int NOT NULL,
  `id_cpmk` int NOT NULL,
  `id_mk` int NOT NULL,
  `id_tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `2b3_peta_pemenuhan_cpl`
--

INSERT INTO `2b3_peta_pemenuhan_cpl` (`id_2b3`, `id_cpl`, `id_cpmk`, `id_mk`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(21, 1, 1, 1, 81, '2026-05-12 21:08:13', 1, '2026-05-12 21:08:49', NULL, '2026-05-12 21:08:49', 1),
(22, 1, 1, 2, 81, '2026-05-12 21:08:13', 1, '2026-05-12 21:08:43', NULL, '2026-05-12 21:08:43', 1),
(23, 1, 2, 5, 81, '2026-05-12 21:08:13', 1, '2026-05-12 21:10:12', NULL, '2026-05-12 21:10:12', 1),
(24, 1, 2, 6, 81, '2026-05-12 21:08:13', 1, '2026-05-12 21:10:12', NULL, '2026-05-12 21:10:12', 1),
(25, 1, 1, 1, 2, '2026-05-12 21:25:17', 1, NULL, NULL, NULL, NULL),
(26, 1, 1, 9, 2, '2026-05-12 21:25:17', 1, NULL, NULL, NULL, NULL),
(27, 1, 2, 2, 2, '2026-05-12 21:25:17', 1, NULL, NULL, NULL, NULL),
(28, 1, 2, 11, 2, '2026-05-12 21:25:17', 1, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2b4_masa_tunggu`
--

CREATE TABLE `2b4_masa_tunggu` (
  `id_2b4` int NOT NULL,
  `id_prodi` int NOT NULL,
  `id_tahun` int NOT NULL COMMENT 'TS, TS-1, atau TS-2',
  `jumlah_lulusan` int UNSIGNED DEFAULT '0',
  `jumlah_terlacak` int UNSIGNED DEFAULT '0',
  `rata_tunggu` decimal(5,2) DEFAULT '0.00' COMMENT 'Dalam satuan bulan',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `2b4_masa_tunggu`
--

INSERT INTO `2b4_masa_tunggu` (`id_2b4`, `id_prodi`, `id_tahun`, `jumlah_lulusan`, `jumlah_terlacak`, `rata_tunggu`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 3, 50, 20, '4.51', '2026-04-21 04:45:44', 3, '2026-05-13 18:11:26', 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2b5_kesesuaian_kerja`
--

CREATE TABLE `2b5_kesesuaian_kerja` (
  `id_2b5` int NOT NULL,
  `id_2b4` int NOT NULL COMMENT 'Relasi ke data masa tunggu TS yang sama',
  `profesi_infokom` int UNSIGNED DEFAULT '0',
  `profesi_non_infokom` int UNSIGNED DEFAULT '0',
  `lingkup_multinasional` int UNSIGNED DEFAULT '0',
  `lingkup_nasional` int UNSIGNED DEFAULT '0',
  `lingkup_wirausaha` int UNSIGNED DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `2b5_kesesuaian_kerja`
--

INSERT INTO `2b5_kesesuaian_kerja` (`id_2b5`, `id_2b4`, `profesi_infokom`, `profesi_non_infokom`, `lingkup_multinasional`, `lingkup_nasional`, `lingkup_wirausaha`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(2, 1, 5, 15, 4, 15, 1, '2026-04-22 04:15:32', 3, '2026-05-13 18:11:26', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2b6_kepuasan_pengguna`
--

CREATE TABLE `2b6_kepuasan_pengguna` (
  `id_2b6` int NOT NULL,
  `id_prodi` int NOT NULL,
  `id_tahun` int NOT NULL,
  `jenis_kemampuan` varchar(100) NOT NULL,
  `sangat_baik` decimal(5,2) DEFAULT '0.00',
  `baik` decimal(5,2) DEFAULT '0.00',
  `cukup` decimal(5,2) DEFAULT '0.00',
  `kurang` decimal(5,2) DEFAULT '0.00',
  `rencana_tindak_lanjut` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `2b6_kepuasan_pengguna`
--

INSERT INTO `2b6_kepuasan_pengguna` (`id_2b6`, `id_prodi`, `id_tahun`, `jenis_kemampuan`, `sangat_baik`, `baik`, `cukup`, `kurang`, `rencana_tindak_lanjut`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 3, 'Kerjasama Tim', '50.00', '10.00', '20.00', '20.00', 'eaa', '2026-04-22 07:54:49', 3, '2026-05-13 18:10:51', 3, NULL, NULL),
(2, 1, 3, 'Keahlian di Bidang Prodi', '60.00', '20.00', '5.00', '15.00', 'eaa', '2026-04-22 07:54:49', 3, '2026-05-13 15:11:35', 3, NULL, NULL),
(3, 1, 3, 'Kemampuan Berbahasa Asing (Inggris)', '70.00', '10.00', '10.00', '10.00', 'ea', '2026-04-22 07:54:49', 3, '2026-05-13 15:11:35', 3, NULL, NULL),
(4, 1, 3, 'Kemampuan Berkomunikasi', '50.00', '20.00', '10.00', '20.00', 'eaaaa', '2026-04-22 07:54:49', 3, '2026-05-13 15:11:35', 3, NULL, NULL),
(5, 1, 3, 'Pengembangan Diri', '40.00', '20.00', '20.00', '20.00', 'aaaa', '2026-04-22 07:54:49', 3, '2026-05-13 15:11:35', 3, NULL, NULL),
(6, 1, 3, 'Kepemimpinan', '60.00', '5.00', '15.00', '20.00', 'eee', '2026-04-22 07:54:49', 3, '2026-05-13 15:11:35', 3, NULL, NULL),
(7, 1, 3, 'Etos Kerja', '30.00', '50.00', '10.00', '10.00', 'aaaa', '2026-04-22 07:54:49', 3, '2026-05-13 15:11:35', 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2b6_metadata_lulusan`
--

CREATE TABLE `2b6_metadata_lulusan` (
  `id_metadata` int NOT NULL,
  `id_prodi` int NOT NULL,
  `id_tahun` int NOT NULL,
  `jml_alumni_3_tahun` int UNSIGNED DEFAULT '0',
  `jml_responden` int UNSIGNED DEFAULT '0',
  `jml_mhs_aktif_ts` int UNSIGNED DEFAULT '0',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `2b6_metadata_lulusan`
--

INSERT INTO `2b6_metadata_lulusan` (`id_metadata`, `id_prodi`, `id_tahun`, `jml_alumni_3_tahun`, `jml_responden`, `jml_mhs_aktif_ts`, `updated_at`) VALUES
(1, 1, 3, 50, 30, 0, '2026-05-13 15:12:42');

-- --------------------------------------------------------

--
-- Table structure for table `2c_fleksibilitas_pembelajaran`
--

CREATE TABLE `2c_fleksibilitas_pembelajaran` (
  `id_2c` int NOT NULL,
  `id_prodi` int NOT NULL,
  `id_tahun` int NOT NULL,
  `id_bentuk` int NOT NULL,
  `jumlah_mhs` int DEFAULT '0',
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `2c_fleksibilitas_pembelajaran`
--

INSERT INTO `2c_fleksibilitas_pembelajaran` (`id_2c`, `id_prodi`, `id_tahun`, `id_bentuk`, `jumlah_mhs`, `link_bukti`, `created_at`, `updated_at`, `created_by`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 1, 1, 410, NULL, '2026-05-15 00:43:48', '2026-05-15 01:22:23', 1, 3, NULL, NULL),
(2, 1, 1, 2, 12, NULL, '2026-05-15 00:43:48', '2026-05-15 01:22:23', 1, 3, NULL, NULL),
(3, 1, 1, 3, 5, NULL, '2026-05-15 00:43:48', '2026-05-15 01:22:23', 1, 3, NULL, NULL),
(4, 1, 1, 4, 2, NULL, '2026-05-15 00:43:48', '2026-05-15 01:22:23', 1, 3, NULL, NULL),
(5, 1, 1, 5, 15, NULL, '2026-05-15 00:43:48', '2026-05-15 01:22:23', 1, 3, NULL, NULL),
(6, 1, 2, 1, 81, 'http://127.0.0.1:3001/backend/test-2c.html?serverWindowId=712b93ef-ee45-4edc-8c44-69d066b47fde', '2026-05-15 00:43:48', '2026-05-17 17:19:06', 1, 3, NULL, NULL),
(7, 1, 2, 2, 10, NULL, '2026-05-15 00:43:48', '2026-05-15 01:22:23', 1, 3, NULL, NULL),
(8, 1, 2, 3, 4, NULL, '2026-05-15 00:43:48', '2026-05-15 01:22:23', 1, 3, NULL, NULL),
(9, 1, 2, 4, 1, NULL, '2026-05-15 00:43:48', '2026-05-15 01:22:23', 1, 3, NULL, NULL),
(10, 1, 2, 5, 8, NULL, '2026-05-15 00:43:48', '2026-05-15 01:22:23', 1, 3, NULL, NULL),
(33, 1, 3, 1, 0, NULL, '2026-05-15 01:22:23', '2026-05-15 01:22:23', 3, NULL, NULL, NULL),
(36, 1, 3, 2, 0, NULL, '2026-05-15 01:22:23', '2026-05-15 01:22:23', 3, NULL, NULL, NULL),
(39, 1, 3, 3, 0, NULL, '2026-05-15 01:22:23', '2026-05-15 01:22:23', 3, NULL, NULL, NULL),
(42, 1, 3, 4, 0, NULL, '2026-05-15 01:22:23', '2026-05-15 01:22:23', 3, NULL, NULL, NULL),
(45, 1, 3, 5, 0, NULL, '2026-05-15 01:22:23', '2026-05-15 01:22:23', 3, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2d_ref_sumber_rekognisi`
--

CREATE TABLE `2d_ref_sumber_rekognisi` (
  `id_ref_sumber` int UNSIGNED NOT NULL,
  `nama_sumber` varchar(255) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0' COMMENT '1 jika bawaan LKPS, 0 jika tambahan user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `2d_ref_sumber_rekognisi`
--

INSERT INTO `2d_ref_sumber_rekognisi` (`id_ref_sumber`, `nama_sumber`, `is_default`, `created_at`) VALUES
(1, 'Masyarakat', 1, '2026-04-24 07:30:06'),
(2, 'Dunia Usaha', 1, '2026-04-24 07:30:06'),
(3, 'Dunia Industri', 1, '2026-04-24 07:30:06'),
(4, 'Dunia Kerja', 1, '2026-04-24 07:30:06');

-- --------------------------------------------------------

--
-- Table structure for table `2d_rekognisi_lulusan`
--

CREATE TABLE `2d_rekognisi_lulusan` (
  `id_2d` int UNSIGNED NOT NULL,
  `id_prodi` int NOT NULL,
  `id_tahun` int NOT NULL,
  `id_ref_sumber` int UNSIGNED NOT NULL,
  `jenis_rekognisi` text NOT NULL,
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `2d_rekognisi_lulusan`
--

INSERT INTO `2d_rekognisi_lulusan` (`id_2d`, `id_prodi`, `id_tahun`, `id_ref_sumber`, `jenis_rekognisi`, `link_bukti`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 3, 1, 'Juara 1 Lomba Web Design Nasional', 'https://sertifikat.com/123', '2026-05-13 17:07:16', 1, NULL, NULL, NULL, NULL),
(2, 1, 3, 2, 'Pengembang Utama Aplikasi Startup', 'https://portofolio.com/456', '2026-05-13 17:07:16', 1, NULL, NULL, NULL, NULL),
(3, 1, 3, 3, 'Technical Writer untuk Tech In Asia', 'https://techinasia.com/author', '2026-05-13 17:07:16', 1, NULL, NULL, NULL, NULL),
(4, 1, 2, 4, 'Internship Software Engineer GoTo', 'https://linkedin.com/post/789', '2026-05-13 17:07:16', 1, NULL, NULL, NULL, NULL),
(5, 1, 2, 1, 'Juara 2 Hackathon BEM SI', 'https://kampus.ac.id/berita-1', '2026-05-13 17:07:16', 1, NULL, NULL, NULL, NULL),
(6, 1, 2, 2, 'Data Analyst Freelance PT ABC', 'https://upwork.com/freelancer', '2026-05-13 17:07:16', 1, NULL, NULL, NULL, NULL),
(8, 1, 1, 4, 'Penerima Beasiswa LPDP', 'https://lpdp.go.id/awardee', '2026-05-13 17:07:16', 1, NULL, NULL, NULL, NULL),
(9, 1, 1, 3, 'Juara 1 makan krupuk', 'https://www.youtube.com/watch?v=XjAiEkslZU8&list=RDXjAiEkslZU8&start_radio=1', '2026-05-13 17:37:07', 3, '2026-05-13 18:10:26', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `3a1_sarana_prasarana_penelitian`
--

CREATE TABLE `3a1_sarana_prasarana_penelitian` (
  `id_3a1` int NOT NULL,
  `id_prodi` int NOT NULL,
  `nama_prasarana` varchar(255) NOT NULL COMMENT 'Diisi nama laboratorium',
  `daya_tampung` int UNSIGNED DEFAULT '0',
  `luas_ruang` decimal(10,2) DEFAULT '0.00' COMMENT 'Dalam satuan m2',
  `status_milik` enum('M','W') NOT NULL DEFAULT 'M',
  `status_lisensi` enum('L','P','T') NOT NULL DEFAULT 'L',
  `perangkat` text COMMENT 'Hard/Soft-ware, bandwidth, device, tool, dll',
  `info_tambahan` text COMMENT 'Untuk mengisi kolom ..... di gambar',
  `link_bukti` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `3a1_sarana_prasarana_penelitian`
--

INSERT INTO `3a1_sarana_prasarana_penelitian` (`id_3a1`, `id_prodi`, `nama_prasarana`, `daya_tampung`, `luas_ruang`, `status_milik`, `status_lisensi`, `perangkat`, `info_tambahan`, `link_bukti`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'Laboratorium AI/Citra', 30, '100.00', 'M', 'L', 'PC, HP', 'info info', 'https://ghhjh.gdrive', '2026-04-16 07:59:41', 3, '2026-05-13 17:54:39', 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `3a2_penelitian_dtpr`
--

CREATE TABLE `3a2_penelitian_dtpr` (
  `id_3a2` int NOT NULL,
  `id_dosen` int NOT NULL,
  `id_tahun` int NOT NULL,
  `id_roadmap` int NOT NULL,
  `judul_penelitian` varchar(255) NOT NULL,
  `jumlah_mahasiswa` int DEFAULT '0',
  `jenis_hibah` varchar(100) DEFAULT NULL,
  `sumber` varchar(100) DEFAULT NULL,
  `durasi` int DEFAULT NULL,
  `jumlah_dana` int DEFAULT '0',
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `3a2_penelitian_dtpr`
--

INSERT INTO `3a2_penelitian_dtpr` (`id_3a2`, `id_dosen`, `id_tahun`, `id_roadmap`, `judul_penelitian`, `jumlah_mahasiswa`, `jenis_hibah`, `sumber`, `durasi`, `jumlah_dana`, `link_bukti`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES
(2, 1, 81, 2, 'Pengembangan Sistem Cerdas Berbasis AI untuk Pertanian 2100', 2, 'Hibah DIKTI', 'Perguruan Tinggi Mandiri', 12, 50000000, 'https://example.com/bukti-0', '2026-05-13 18:18:23', '2026-05-13 20:45:30', NULL, 4, 3, NULL),
(3, 1, 80, 2, 'Analisis Algoritma Machine Learning pada Big Data 2099', 3, 'Mandiri', 'Internasional', 6, 15000000, 'https://example.com/bukti-1', '2026-05-13 18:18:23', '2026-05-13 20:27:12', NULL, 4, NULL, NULL),
(4, 1, 79, 2, 'Keamanan Jaringan Menggunakan Blockchain 2098', 1, 'Kerjasama Internasional', 'Lokal/Wilayah', 24, 120000000, 'https://example.com/bukti-2', '2026-05-13 18:18:23', '2026-05-13 20:31:14', NULL, 4, NULL, NULL),
(5, 2, 81, 2, 'Implementasi IoT untuk Smart City 2100', 4, 'Hibah Internal', 'Internasional', 12, 20000000, 'https://example.com/bukti-3', '2026-05-13 18:18:23', '2026-05-13 20:27:15', NULL, 4, NULL, NULL),
(6, 2, 80, 2, 'Sistem Rekomendasi E-Commerce dengan Collaborative Filtering 2099', 2, 'Hibah Perusahaan', 'Lokal/Wilayah', 6, 30000000, 'https://example.com/bukti-4', '2026-05-13 18:18:23', '2026-05-13 20:31:17', NULL, 4, NULL, NULL),
(7, 2, 79, 2, 'Pengembangan Sistem Cerdas Berbasis AI untuk Pertanian 2098', 2, 'Hibah DIKTI', 'Internasional', 12, 50000000, 'https://example.com/bukti-0', '2026-05-13 18:18:23', '2026-05-13 20:27:33', NULL, 4, NULL, NULL),
(8, 1, 81, 2, 'Pengembangan Sistem Cerdas Berbasis AI untuk Pertanian 2100', 2, 'Hibah DIKTI', 'Lokal/Wilayah', 12, 50000000, 'https://example.com/bukti-0', '2026-05-13 20:25:54', '2026-05-13 20:31:19', NULL, 3, NULL, NULL),
(9, 2, 2, 4, 'Push rank', 3, 'Mytic', 'Nasional', 1, 5000000, 'http://localhost/phpmyadmin', '2026-05-13 21:02:05', '2026-05-13 21:02:05', NULL, 3, NULL, NULL),
(10, 1, 1, 3, 'Pengembangan Website', 2, 'Terapan', 'Nasional', 1, 10000000, 'http://localhost:3000/dashboard/penelitian-dtpr?tab=3c1', '2026-05-21 05:29:12', '2026-05-21 05:29:12', NULL, 2, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `3a3_pengembangan_dtpr`
--

CREATE TABLE `3a3_pengembangan_dtpr` (
  `id_pengembangan` int NOT NULL,
  `id_dosen` int NOT NULL,
  `jenis_pengembangan` varchar(255) DEFAULT NULL,
  `nama_pengembangan` varchar(255) DEFAULT NULL,
  `link_bukti` varchar(255) DEFAULT NULL,
  `id_tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `3a3_pengembangan_dtpr`
--

INSERT INTO `3a3_pengembangan_dtpr` (`id_pengembangan`, `id_dosen`, `jenis_pengembangan`, `nama_pengembangan`, `link_bukti`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 2, 'sertifikasi auditor', 'auditor nasional indonesia raya', 'https://ghhjh.gdrive', 3, '2026-04-09 03:19:19', 3, '2026-05-13 18:12:13', NULL, '2026-05-13 18:12:13', 3),
(2, 2, 'sertifikasi marah marah', 'auditor marah marah', 'https://ghhjh.gdrive', 3, '2026-04-09 03:25:04', 3, '2026-05-13 18:07:54', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `3c1_kerjasama_penelitian`
--

CREATE TABLE `3c1_kerjasama_penelitian` (
  `id_3c1` int NOT NULL,
  `id_3a2` int NOT NULL,
  `id_tahun` int NOT NULL,
  `judul_kerjasama` varchar(255) NOT NULL,
  `mitra_kerja_sama` varchar(255) NOT NULL,
  `sumber` varchar(100) DEFAULT NULL,
  `durasi` int DEFAULT NULL,
  `jumlah_dana` int DEFAULT '0',
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `3c1_kerjasama_penelitian`
--

INSERT INTO `3c1_kerjasama_penelitian` (`id_3c1`, `id_3a2`, `id_tahun`, `judul_kerjasama`, `mitra_kerja_sama`, `sumber`, `durasi`, `jumlah_dana`, `link_bukti`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES
(2, 7, 81, 'Kerjasama AI Research 2', 'Universitas Gadjah Mada', 'Nasional', 2, 30000000, 'https://example.com/kerjasama-2', '2026-05-13 19:42:58', '2026-05-13 19:55:45', NULL, 4, NULL, NULL),
(3, 6, 80, 'Smart Farming Partnership 3', 'BRIN Indonesia', 'Internasional', 1, 80000000, 'https://example.com/kerjasama-3', '2026-05-13 19:42:58', '2026-05-13 19:55:53', NULL, 4, NULL, NULL),
(4, 5, 79, 'Kerjasama AI Research 4', 'Universitas Gadjah Mada', 'Lokal/Wilayah', 2, 30000000, 'https://example.com/kerjasama-4', '2026-05-13 19:42:58', '2026-05-13 20:30:33', NULL, 4, NULL, NULL),
(5, 4, 81, 'Smart Farming Partnership 5', 'BRIN Indonesia', 'Internasional', 1, 80000000, 'https://example.com/kerjasama-5', '2026-05-13 19:42:58', '2026-05-13 19:56:02', NULL, 4, NULL, NULL),
(7, 5, 79, 'Smart Farming Partnership 7', 'BRIN Indonesia', 'Lokal/Wilayah', 1, 80000000, 'https://example.com/kerjasama-7', '2026-05-13 19:42:58', '2026-05-13 20:30:38', NULL, 4, NULL, NULL),
(8, 8, 81, 'Kerjasama AI Research 6', 'Universitas Gadjah Mada', 'Nasional', 2, 30000000, 'https://example.com/kerjasama-6', '2026-05-13 20:25:54', '2026-05-13 20:25:54', NULL, 3, NULL, NULL),
(10, 2, 81, 'Kerjasama AI Research 6', 'Universitas Gadjah Mada', 'Internasional', 2, 30000000, 'https://example.com/kerjasama-6', '2026-05-13 20:45:30', '2026-05-13 20:45:30', NULL, 3, NULL, NULL),
(11, 9, 2, 'Kerjasama SMA', 'DC coffe', 'Internasional', 0, 0, 'https://www.youtube.com/', '2026-05-13 21:02:05', '2026-05-13 21:02:05', NULL, 3, NULL, NULL),
(12, 10, 1, 'Pengembangan Website', 'UNTAG', 'Nasional', 0, 0, 'http://localhost:3000/dashboard/penelitian-dtpr?tab=3c1', '2026-05-21 05:29:12', '2026-05-21 05:29:12', NULL, 2, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `3c2_publikasi_penelitian`
--

CREATE TABLE `3c2_publikasi_penelitian` (
  `id_3c2` int NOT NULL,
  `id_3a2` int NOT NULL,
  `id_tahun` int NOT NULL,
  `judul_publikasi` varchar(255) NOT NULL,
  `jenis_publikasi` varchar(100) DEFAULT NULL,
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `3c2_publikasi_penelitian`
--

INSERT INTO `3c2_publikasi_penelitian` (`id_3c2`, `id_3a2`, `id_tahun`, `judul_publikasi`, `jenis_publikasi`, `link_bukti`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES
(2, 3, 80, 'Blockchain Security: A Systematic Review (3)', 'IB', 'https://example.com/publikasi-3', '2026-05-13 19:42:58', '2026-05-13 19:42:58', NULL, 4, NULL, NULL),
(3, 4, 79, 'IoT-based Smart Monitoring System (4)', 'S2', 'https://example.com/publikasi-4', '2026-05-13 19:42:58', '2026-05-13 19:42:58', NULL, 4, NULL, NULL),
(4, 5, 81, 'Implementasi Deep Learning untuk Klasifikasi Tanaman (5)', 'S1', 'https://example.com/publikasi-5', '2026-05-13 19:42:58', '2026-05-13 19:42:58', NULL, 4, NULL, NULL),
(5, 6, 80, 'Blockchain Security: A Systematic Review (6)', 'IB', 'https://example.com/publikasi-6', '2026-05-13 19:42:58', '2026-05-13 19:42:58', NULL, 4, NULL, NULL),
(6, 7, 79, 'IoT-based Smart Monitoring System (7)', 'S2', 'https://example.com/publikasi-7', '2026-05-13 19:42:58', '2026-05-13 19:42:58', NULL, 4, NULL, NULL),
(7, 8, 81, 'Implementasi Deep Learning untuk Klasifikasi Tanaman (2)', 'S1', 'https://example.com/publikasi-2', '2026-05-13 20:25:54', '2026-05-13 20:25:54', NULL, 3, NULL, NULL),
(9, 2, 81, 'Implementasi Deep Learning untuk Klasifikasi Tanaman (2)', 'S1', 'https://example.com/publikasi-2', '2026-05-13 20:45:30', '2026-05-13 20:45:30', NULL, 3, NULL, NULL),
(10, 9, 2, 'Jurnal Penyesuaian', 'IB', 'https://www.facebook.com/', '2026-05-13 21:02:05', '2026-05-13 21:02:05', NULL, 3, NULL, NULL),
(11, 10, 1, 'Pengembangan Website', 'S4', 'http://localhost:3000/dashboard/penelitian-dtpr?tab=3c1', '2026-05-21 05:29:12', '2026-05-21 05:29:12', NULL, 2, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `3c3_perolehan_hki`
--

CREATE TABLE `3c3_perolehan_hki` (
  `id_3c3` int NOT NULL,
  `id_3a2` int NOT NULL,
  `id_tahun` int NOT NULL,
  `judul_hki` varchar(255) NOT NULL,
  `jenis_hki` varchar(100) NOT NULL,
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `3c3_perolehan_hki`
--

INSERT INTO `3c3_perolehan_hki` (`id_3c3`, `id_3a2`, `id_tahun`, `judul_hki`, `jenis_hki`, `link_bukti`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES
(2, 3, 80, 'Modul Pembelajaran Berbasis AI #3', 'Hak Cipta', 'https://example.com/hki-3', '2026-05-13 19:42:58', '2026-05-13 19:42:58', NULL, 4, NULL, NULL),
(3, 4, 79, 'Sistem Klasifikasi Gambar Berbasis CNN #4', 'Paten', 'https://example.com/hki-4', '2026-05-13 19:42:58', '2026-05-13 19:42:58', NULL, 4, NULL, NULL),
(4, 5, 81, 'Modul Pembelajaran Berbasis AI #5', 'Hak Cipta', 'https://example.com/hki-5', '2026-05-13 19:42:58', '2026-05-13 19:42:58', NULL, 4, NULL, NULL),
(5, 6, 80, 'Sistem Klasifikasi Gambar Berbasis CNN #6', 'Paten', 'https://example.com/hki-6', '2026-05-13 19:42:58', '2026-05-13 19:42:58', NULL, 4, NULL, NULL),
(6, 7, 79, 'Modul Pembelajaran Berbasis AI #7', 'Hak Cipta', 'https://example.com/hki-7', '2026-05-13 19:42:58', '2026-05-13 19:42:58', NULL, 4, NULL, NULL),
(7, 8, 81, 'Sistem Klasifikasi Gambar Berbasis CNN #2', 'Paten', 'https://example.com/hki-2', '2026-05-13 20:25:54', '2026-05-13 20:25:54', NULL, 3, NULL, NULL),
(9, 2, 81, 'Sistem Klasifikasi Gambar Berbasis CNN #2', 'Paten', 'https://example.com/hki-2', '2026-05-13 20:45:30', '2026-05-13 20:45:30', NULL, 3, NULL, NULL),
(10, 9, 2, 'One piece', 'Paten', 'https://www.tiktok.com/', '2026-05-13 21:02:05', '2026-05-13 21:02:05', NULL, 3, NULL, NULL),
(11, 10, 1, 'Hak Cipta', 'Hak Cipta', 'http://localhost:3000/dashboard/penelitian-dtpr?tab=3c1', '2026-05-21 05:29:12', '2026-05-21 05:29:12', NULL, 2, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `4a1_sarana_prasarana_pkm`
--

CREATE TABLE `4a1_sarana_prasarana_pkm` (
  `id_4a1` int NOT NULL,
  `id_prodi` int NOT NULL,
  `nama_prasarana` varchar(255) NOT NULL COMMENT 'Diisi nama laboratorium, bengkel, dll',
  `daya_tampung` int UNSIGNED DEFAULT '0',
  `luas_ruang` decimal(10,2) DEFAULT '0.00',
  `status_milik` enum('M','W') NOT NULL DEFAULT 'M',
  `status_lisensi` enum('L','P','T') NOT NULL DEFAULT 'L',
  `perangkat` text COMMENT 'Hard/Soft-ware, bandwidth, device, tool, dll',
  `info_tambahan` text COMMENT 'Untuk mengisi kolom ..... di gambar',
  `link_bukti` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `4a1_sarana_prasarana_pkm`
--

INSERT INTO `4a1_sarana_prasarana_pkm` (`id_4a1`, `id_prodi`, `nama_prasarana`, `daya_tampung`, `luas_ruang`, `status_milik`, `status_lisensi`, `perangkat`, `info_tambahan`, `link_bukti`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'Laboratorium Basis Data', 30, '50.00', 'M', 'L', 'Meja dan Kursi', '', 'https://ghhjh.gdrive', '2026-04-16 08:31:42', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `4a2_pkm_dtpr`
--

CREATE TABLE `4a2_pkm_dtpr` (
  `id_4a2` int NOT NULL,
  `id_dosen` int NOT NULL,
  `id_tahun` int NOT NULL,
  `id_roadmap` int NOT NULL,
  `judul_pkm` varchar(255) NOT NULL,
  `jumlah_mahasiswa` int DEFAULT '0',
  `jenis_hibah` varchar(100) DEFAULT NULL,
  `sumber` varchar(100) DEFAULT NULL,
  `durasi` int DEFAULT NULL,
  `jumlah_dana` int DEFAULT '0',
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `4a2_pkm_dtpr`
--

INSERT INTO `4a2_pkm_dtpr` (`id_4a2`, `id_dosen`, `id_tahun`, `id_roadmap`, `judul_pkm`, `jumlah_mahasiswa`, `jenis_hibah`, `sumber`, `durasi`, `jumlah_dana`, `link_bukti`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES
(1, 1, 81, 2, 'Pelatihan Literasi Digital untuk Masyarakat Pedesaan', 4, 'Mandiri', 'Perguruan Tinggi Mandiri', 1, 22000000, 'https://example.com/pkm-1', '2026-05-13 19:45:51', '2026-05-13 19:45:51', NULL, 4, NULL, NULL),
(2, 2, 81, 2, 'Pemberdayaan UMKM Melalui Teknologi E-Commerce', 1, 'Hibah Dikti', 'Lembaga Dalam Negeri', 1, 21000000, 'https://example.com/pkm-2', '2026-05-13 19:45:51', '2026-05-13 19:45:51', NULL, 4, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `4c1_kerjasama_pkm`
--

CREATE TABLE `4c1_kerjasama_pkm` (
  `id_4c1` int NOT NULL,
  `id_4a2` int NOT NULL,
  `id_tahun` int NOT NULL,
  `judul_kerjasama` varchar(255) NOT NULL,
  `mitra_kerja_sama` varchar(255) NOT NULL,
  `sumber` varchar(100) DEFAULT NULL,
  `durasi` int DEFAULT NULL,
  `jumlah_dana` int DEFAULT '0',
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `4c1_kerjasama_pkm`
--

INSERT INTO `4c1_kerjasama_pkm` (`id_4c1`, `id_4a2`, `id_tahun`, `judul_kerjasama`, `mitra_kerja_sama`, `sumber`, `durasi`, `jumlah_dana`, `link_bukti`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES
(1, 1, 81, 'Kerjasama Pelatihan Digital Bersama #1', 'Dinas Koperasi Banyuwangi', 'Lokal/Wilayah', 1, 10000000, 'https://example.com/kerjasama-pkm-1', '2026-05-13 19:45:51', '2026-05-13 20:30:14', NULL, 4, NULL, NULL),
(2, 2, 81, 'Pemberdayaan UMKM via Platform Digital #2', 'Kementerian UMKM', 'Nasional', 2, 25000000, 'https://example.com/kerjasama-pkm-2', '2026-05-13 19:45:52', '2026-05-13 19:45:52', NULL, 4, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `4c2_diseminasi_hasil_pkm`
--

CREATE TABLE `4c2_diseminasi_hasil_pkm` (
  `id_4c2` int NOT NULL,
  `id_4a2` int NOT NULL,
  `id_tahun` int NOT NULL,
  `judul_diseminasi` varchar(255) NOT NULL,
  `tingkat_diseminasi` varchar(100) DEFAULT NULL,
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `4c3_perolehan_hki_pkm`
--

CREATE TABLE `4c3_perolehan_hki_pkm` (
  `id_4c3` int NOT NULL,
  `id_4a2` int NOT NULL,
  `id_tahun` int NOT NULL,
  `judul_hki` varchar(255) NOT NULL,
  `jenis_hki` varchar(100) NOT NULL,
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `5_1_sistem_tata_kelola`
--

CREATE TABLE `5_1_sistem_tata_kelola` (
  `id_5_1` int NOT NULL,
  `jenis_tata_kelola` varchar(255) DEFAULT NULL,
  `nama_sistem` varchar(255) DEFAULT NULL,
  `akses` varchar(255) DEFAULT NULL,
  `id_unit` int DEFAULT NULL,
  `link_bukti` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `5_1_sistem_tata_kelola`
--

INSERT INTO `5_1_sistem_tata_kelola` (`id_5_1`, `jenis_tata_kelola`, `nama_sistem`, `akses`, `id_unit`, `link_bukti`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES
(1, 'Sistem Informasi Akademik', 'SIAKAD', 'Internet', 9, 'https://siakad.stikom-banyuwangi.ac.id', '2026-05-17 16:45:36', '2026-05-17 16:45:36', NULL, 3, NULL, NULL),
(2, 'Sistem Penerimaan Mahasiswa Baru', 'PMB Online', 'Internet', 3, 'https://pmb.stikom-banyuwangi.ac.id', '2026-05-17 16:45:36', '2026-05-17 16:45:36', NULL, 3, NULL, NULL),
(3, 'Sistem Penjaminan Mutu Internal', 'SI-SPMI', 'Internet', 2, 'https://spmi.stikom-banyuwangi.ac.id', '2026-05-17 16:45:36', '2026-05-17 16:45:36', NULL, 3, NULL, NULL),
(4, 'Sistem Informasi Pengelolaan Keuangan', 'SIAKUL', 'Internet', 8, 'https://keuangan.stikom-banyuwangi.ac.id', '2026-05-17 16:45:36', '2026-05-17 16:45:36', NULL, 3, NULL, NULL),
(5, 'Sistem Informasi Perpustakaan', 'SILIWANGI OPAC', 'Lokal', 4, 'https://perpus.stikom-banyuwangi.ac.id', '2026-05-17 16:45:36', '2026-05-17 16:45:36', NULL, 3, NULL, NULL),
(6, 'Sistem Informasi Kepegawaian', 'SIMPEG', 'Internet', 12, 'https://simpeg.stikom-banyuwangi.ac.id', '2026-05-17 16:45:36', '2026-05-17 16:45:36', NULL, 3, NULL, NULL),
(7, 'Sistem Informasi Penelitian & PkM', 'SIM-LPPM', 'Internet', 11, 'https://lppm.stikom-banyuwangi.ac.id', '2026-05-17 16:45:36', '2026-05-17 16:45:36', NULL, 3, NULL, NULL),
(8, 'Sistem Informasi Kemahasiswaan & Alumni', 'SIMAWA', 'Internet', 10, 'https://simawa.stikom-banyuwangi.ac.id', '2026-05-17 16:45:36', '2026-05-17 16:45:36', NULL, 3, NULL, NULL),
(9, 'Sistem Tata Kelola Administrasi & Dokumen', 'SI-TATA KELOLA', 'Internet', 5, 'https://sisfo.stikom-banyuwangi.ac.id', '2026-05-17 16:45:36', '2026-05-17 16:45:36', NULL, 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `5_2_sarana_prasarana_pendidikan`
--

CREATE TABLE `5_2_sarana_prasarana_pendidikan` (
  `id_5_2` int NOT NULL,
  `id_prodi` int NOT NULL,
  `nama_prasarana` varchar(255) NOT NULL COMMENT 'Ruang kelas, Lab, Perpustakaan, dsb',
  `daya_tampung` int UNSIGNED DEFAULT '0',
  `luas_ruang` decimal(10,2) DEFAULT '0.00',
  `status_milik` enum('M','W') NOT NULL DEFAULT 'M',
  `status_lisensi` enum('L','P','T') NOT NULL DEFAULT 'L',
  `perangkat` text COMMENT 'Hard/Soft-ware, bandwidth, device, tool, dll',
  `info_tambahan` text COMMENT 'Untuk mengisi kolom ..... di gambar',
  `link_bukti` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `5_2_sarana_prasarana_pendidikan`
--

INSERT INTO `5_2_sarana_prasarana_pendidikan` (`id_5_2`, `id_prodi`, `nama_prasarana`, `daya_tampung`, `luas_ruang`, `status_milik`, `status_lisensi`, `perangkat`, `info_tambahan`, `link_bukti`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'Laboratorium Pemrograman', 51, '200.00', 'M', 'L', 'Proyektor', 'yahahhaa', 'https://ghhjh.gdrive', '2026-04-16 09:13:10', 3, '2026-05-14 20:48:21', 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `6_visi_misi`
--

CREATE TABLE `6_visi_misi` (
  `id_vm` int NOT NULL,
  `id_prodi` int NOT NULL,
  `visi_pt` text,
  `misi_pt` text,
  `visi_upps` text,
  `misi_upps` text,
  `visi_keilmuan_ps` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `6_visi_misi`
--

INSERT INTO `6_visi_misi` (`id_vm`, `id_prodi`, `visi_pt`, `misi_pt`, `visi_upps`, `misi_upps`, `visi_keilmuan_ps`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'blablablaasdasda', 'blablabla', 'blabla', 'blabla', 'blabla', '2026-04-09 08:38:21', 3, '2026-05-14 21:00:50', 3, NULL, NULL),
(5, 2, 'SIPALING MI', 'SIPALING MI', 'SIPALING MI', 'SIPALING MI', 'SIPALING MI', '2026-05-14 21:05:48', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `dosen`
--

CREATE TABLE `dosen` (
  `id_dosen` int NOT NULL,
  `id_pegawai` int NOT NULL,
  `nidn` varchar(20) DEFAULT NULL,
  `nuptk` varchar(20) DEFAULT NULL,
  `id_prodi` int DEFAULT NULL,
  `perguruan_tinggi` varchar(150) DEFAULT 'STIKOM PGRI Banyuwangi',
  `id_jabatan_fungsional` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `dosen`
--

INSERT INTO `dosen` (`id_dosen`, `id_pegawai`, `nidn`, `nuptk`, `id_prodi`, `perguruan_tinggi`, `id_jabatan_fungsional`) VALUES
(1, 1, '0701018001', 'NUPTK001', 1, 'STIKOM PGRI Banyuwangi', 2),
(2, 2, '0702028502', 'NUPTK002', 1, 'STIKOM PGRI Banyuwangi', 2);

-- --------------------------------------------------------

--
-- Table structure for table `jabatan_fungsional`
--

CREATE TABLE `jabatan_fungsional` (
  `id_jafung` int NOT NULL,
  `nama_jafung` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `jabatan_fungsional`
--

INSERT INTO `jabatan_fungsional` (`id_jafung`, `nama_jafung`) VALUES
(1, 'Asisten Ahli'),
(2, 'Lektor'),
(3, 'Lektor Kepala');

-- --------------------------------------------------------

--
-- Table structure for table `jabatan_struktural`
--

CREATE TABLE `jabatan_struktural` (
  `id_jabatan_struktural` int NOT NULL,
  `nama_jabatan` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `jabatan_struktural`
--

INSERT INTO `jabatan_struktural` (`id_jabatan_struktural`, `nama_jabatan`) VALUES
(1, 'Ketua'),
(2, 'Staff');

-- --------------------------------------------------------

--
-- Table structure for table `master_bentuk_pembelajaran`
--

CREATE TABLE `master_bentuk_pembelajaran` (
  `id_bentuk` int NOT NULL,
  `nama_bentuk` varchar(255) NOT NULL,
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `master_bentuk_pembelajaran`
--

INSERT INTO `master_bentuk_pembelajaran` (`id_bentuk`, `nama_bentuk`, `keterangan`, `created_at`) VALUES
(1, 'Micro-credensial', NULL, '2026-05-13 16:31:51'),
(2, 'RPL tipe A-2', NULL, '2026-05-13 16:31:51'),
(3, 'Pembelajaran di PS lain', NULL, '2026-05-13 16:31:51'),
(4, 'Pembelajaran di PT lain', NULL, '2026-05-13 16:31:51'),
(5, 'CBL/ PBL', NULL, '2026-05-13 16:31:51');

-- --------------------------------------------------------

--
-- Table structure for table `master_cpl`
--

CREATE TABLE `master_cpl` (
  `id_cpl` int NOT NULL,
  `id_prodi` int NOT NULL,
  `kode_cpl` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `deskripsi_cpl` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `master_cpl`
--

INSERT INTO `master_cpl` (`id_cpl`, `id_prodi`, `kode_cpl`, `deskripsi_cpl`) VALUES
(1, 1, 'CPL-01', 'Mampu merancang dan mengembangkan perangkat lunak berkualitas'),
(2, 1, 'CPL-02', 'Mampu menganalisis kebutuhan sistem dan desain arsitektur perangkat lunak'),
(3, 2, 'CPL-03', 'Mampu mengelola sistem informasi berbasis komputer'),
(4, 2, 'CPL-04', 'Mampu menganalisis proses bisnis dan mengimplementasikan solusi TI'),
(5, 1, 'CPL-05', 'Bertaqwa kepada Tuhan Yang Maha Esa dan mampu menunjukkan sikap religius serta menjunjung tinggi nilai-nilai kemanusiaan dalam menjalankan tugas berdasarkan agama, moral, dan etika.'),
(6, 1, 'CPL-06', 'Mampu mengelola proyek perangkat lunak dengan metode agile'),
(7, 1, 'CPL-07', 'Mampu merancang antarmuka pengguna yang interaktif (UI/UX)'),
(8, 1, 'CPL-08', 'Mampu mengimplementasikan kecerdasan buatan dalam aplikasi'),
(9, 1, 'CPL-09', 'Mampu menjaga keamanan dan privasi data aplikasi'),
(10, 1, 'CPL-10', 'Mampu melakukan pengujian dan penjaminan kualitas perangkat lunak'),
(11, 1, 'CPL-11', 'Mampu mengelola infrastruktur jaringan dan komputasi awan'),
(12, 1, 'CPL-12', 'Mampu memecahkan masalah komputasi kompleks dengan algoritma efisien'),
(13, 1, 'CPL-13', 'Mampu menggunakan teknologi big data untuk analisis data'),
(14, 1, 'CPL-14', 'Mampu menerapkan etika profesi dalam bidang teknologi informasi'),
(15, 2, 'CPL-15', 'Mampu merumuskan strategi bisnis berbasis teknologi informasi'),
(16, 2, 'CPL-16', 'Mampu mengaudit sistem informasi perusahaan'),
(17, 2, 'CPL-17', 'Mampu mengelola tata kelola TI dengan standar industri (COBIT/ITIL)'),
(18, 2, 'CPL-18', 'Mampu merancang sistem ERP untuk efisiensi bisnis'),
(19, 2, 'CPL-19', 'Mampu menganalisis tren bisnis digital dan e-commerce'),
(20, 2, 'CPL-20', 'Mampu menerapkan sistem pendukung keputusan untuk manajemen'),
(21, 2, 'CPL-21', 'Mampu mengelola hubungan pelanggan (CRM) menggunakan teknologi'),
(22, 2, 'CPL-22', 'Mampu melakukan analisis risiko sistem informasi'),
(23, 2, 'CPL-23', 'Mampu menyusun rencana kesinambungan bisnis (BCP)'),
(24, 2, 'CPL-24', 'Mampu berkomunikasi secara efektif di lingkungan profesional');

-- --------------------------------------------------------

--
-- Table structure for table `master_cpmk`
--

CREATE TABLE `master_cpmk` (
  `id_cpmk` int NOT NULL,
  `id_prodi` int NOT NULL,
  `kode_cpmk` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `deskripsi_cpmk` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `master_cpmk`
--

INSERT INTO `master_cpmk` (`id_cpmk`, `id_prodi`, `kode_cpmk`, `deskripsi_cpmk`) VALUES
(1, 1, 'CPMK-01', 'Mampu menguasai konsep teoritis bidang pengetahuan Ilmu Komputer secara umum dan konsep teoritis bagian khusus dalam bidang pengetahuan tersebut secara mendalam.'),
(2, 1, 'CPMK-02', 'Mampu memformulasikan penyelesaian masalah prosedural dan memanfaatkan prinsip-prinsip rekayasa perangkat lunak.'),
(3, 1, 'CPMK-03', 'Mampu menerapkan pemikiran logis, kritis, sistematis, dan inovatif dalam konteks pengembangan atau implementasi ilmu pengetahuan dan teknologi.'),
(4, 1, 'CPMK-04', 'Mampu menunjukkan kinerja mandiri, bermutu, dan terukur.'),
(5, 1, 'CPMK-05', 'Mampu merancang dan mengembangkan sistem informasi yang memenuhi kebutuhan pengguna dan bisnis.'),
(6, 1, 'CPMK-06', 'Mampu menganalisis dan mendesain basis data untuk menyimpan dan mengelola data organisasi dengan efisien.'),
(7, 2, 'CPMK-01', 'Mampu memahami konsep dasar jaringan komputer dan penerapannya.'),
(8, 2, 'CPMK-02', 'Mampu mengkonfigurasi dan mengelola infrastruktur jaringan dan sistem keamanan.'),
(9, 2, 'CPMK-03', 'Mampu mendeteksi dan menyelesaikan permasalahan keamanan siber secara mandiri.');

-- --------------------------------------------------------

--
-- Table structure for table `master_mata_kuliah`
--

CREATE TABLE `master_mata_kuliah` (
  `id_mk` int NOT NULL,
  `id_prodi` int NOT NULL,
  `kode_mk` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nama_mk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sks` int NOT NULL,
  `semester` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `master_mata_kuliah`
--

INSERT INTO `master_mata_kuliah` (`id_mk`, `id_prodi`, `kode_mk`, `nama_mk`, `sks`, `semester`) VALUES
(1, 1, 'IF101', 'Algoritma dan Pemrograman', 3, 1),
(2, 1, 'IF102', 'Struktur Data', 3, 2),
(3, 2, 'MI101', 'Pengantar Manajemen', 3, 1),
(4, 2, 'MI102', 'Sistem Informasi Manajemen', 3, 2),
(5, 1, 'IF101', 'Algoritma dan Pemrograman', 3, 1),
(6, 1, 'IF102', 'Struktur Data', 3, 2),
(7, 2, 'MI101', 'Pengantar Manajemen', 3, 1),
(8, 2, 'MI102', 'Sistem Informasi Manajemen', 3, 2),
(9, 1, 'IF201', 'Basis Data', 3, 3),
(10, 2, 'MI201', 'Analisis dan Perancangan Sistem', 3, 3),
(11, 1, 'IF202', 'Pemrograman Berorientasi Objek', 3, 4),
(12, 2, 'MI202', 'Manajemen Basis Data', 3, 4),
(13, 1, 'IF301', 'Jaringan Komputer', 3, 5),
(14, 2, 'MI301', 'E-Business', 3, 5),
(15, 1, 'IF302', 'Rekayasa Perangkat Lunak', 3, 6),
(16, 2, 'MI302', 'Audit Sistem Informasi', 3, 6),
(17, 1, 'IF401', 'Kecerdasan Buatan', 3, 7),
(18, 2, 'MI401', 'Metodologi Penelitian', 2, 6),
(19, 1, 'IF402', 'Skripsi / Tugas Akhir', 6, 8),
(20, 2, 'MI402', 'Skripsi / Tugas Akhir', 6, 6);

-- --------------------------------------------------------

--
-- Table structure for table `master_profil_lulusan`
--

CREATE TABLE `master_profil_lulusan` (
  `id_pl` int NOT NULL,
  `id_prodi` int NOT NULL,
  `kode_pl` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `deskripsi_pl` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `master_profil_lulusan`
--

INSERT INTO `master_profil_lulusan` (`id_pl`, `id_prodi`, `kode_pl`, `deskripsi_pl`) VALUES
(5, 1, 'PL001', 'Mampu mengembangkan perangkat lunak'),
(6, 1, 'PL002', 'Mampu mengamankan sistem jaringan'),
(7, 2, 'PL003', 'Mampu mengelola sistem informasi'),
(8, 2, 'PL004', 'Mampu menganalisis kebutuhan bisnis'),
(9, 1, 'PL005', 'Software Engineer / Programmer'),
(10, 1, 'PL006', 'System Analyst / Systems Engineer'),
(11, 1, 'PL007', 'Database Administrator'),
(12, 1, 'PL008', 'Network Administrator'),
(13, 1, 'PL009', 'UI/UX Designer'),
(14, 1, 'PL010', 'Data Scientist / Data Analyst'),
(15, 1, 'PL011', 'DevOps Engineer'),
(16, 1, 'PL012', 'Cloud Solutions Architect'),
(17, 1, 'PL013', 'Artificial Intelligence Engineer'),
(18, 1, 'PL014', 'Cyber Security Specialist'),
(19, 2, 'PL015', 'IT Project Manager'),
(20, 2, 'PL016', 'Business Analyst'),
(21, 2, 'PL017', 'IT Consultant / Auditor'),
(22, 2, 'PL018', 'ERP Specialist'),
(23, 2, 'PL019', 'IT Support / Helpdesk Supervisor'),
(24, 2, 'PL020', 'E-Commerce Manager'),
(25, 2, 'PL021', 'Digital Marketing Strategist'),
(26, 2, 'PL022', 'IS/IT Manager'),
(27, 2, 'PL023', 'Risk Management Analyst'),
(28, 2, 'PL024', 'IT Compliance Officer');

-- --------------------------------------------------------

--
-- Table structure for table `master_sks_jabatan`
--

CREATE TABLE `master_sks_jabatan` (
  `id_sks_jabatan` int NOT NULL,
  `nama_pencarian` varchar(100) DEFAULT NULL,
  `sks` decimal(4,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `master_sks_jabatan`
--

INSERT INTO `master_sks_jabatan` (`id_sks_jabatan`, `nama_pencarian`, `sks`) VALUES
(1, 'Ketua STIKOM', '12.00'),
(2, 'Wakil Ketua STIKOM', '10.00'),
(3, 'Ketua Jurusan', '8.00'),
(4, 'Sekretaris Jurusan', '7.00'),
(5, 'Ketua Prodi', '7.00'),
(6, 'Sekretaris Prodi', '5.00'),
(7, 'Kepala Bagian', '4.00'),
(8, 'Kepala Sub Bagian', '2.00'),
(9, 'Ketua TPM', '4.00'),
(10, 'Staf', '0.00'),
(11, 'Non Struktural', '0.00');

-- --------------------------------------------------------

--
-- Table structure for table `pegawai`
--

CREATE TABLE `pegawai` (
  `id_pegawai` int NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `nikp` varchar(50) DEFAULT NULL,
  `id_unit` int DEFAULT NULL,
  `id_jabatan_struktural` int DEFAULT NULL,
  `pendidikan_terakhir` varchar(50) DEFAULT NULL,
  `perguruan_tinggi` varchar(255) DEFAULT 'STIKOM PGRI BANYUWANGI'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `pegawai`
--

INSERT INTO `pegawai` (`id_pegawai`, `nama_lengkap`, `nikp`, `id_unit`, `id_jabatan_struktural`, `pendidikan_terakhir`, `perguruan_tinggi`) VALUES
(1, 'Erdiyanto, M.Kom.', 'NIKP.001.2024', 1, 1, 'S2', 'STIKOM PGRI BANYUWANGI'),
(2, 'Rhegysa, M.T.', 'NIKP.002.2024', 9, 1, 'S2', 'STIKOM PGRI BANYUWANGI'),
(3, 'Budi Santoso, S.Kom.', 'NIKP.003.2024', 5, 2, 'S1', 'STIKOM PGRI BANYUWANGI');

-- --------------------------------------------------------

--
-- Table structure for table `prodi`
--

CREATE TABLE `prodi` (
  `id_prodi` int NOT NULL,
  `nama_prodi` varchar(100) NOT NULL,
  `id_unit` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `prodi`
--

INSERT INTO `prodi` (`id_prodi`, `nama_prodi`, `id_unit`) VALUES
(1, 'Teknik Informatika', 9),
(2, 'Manajemen Informatika', 9);

-- --------------------------------------------------------

--
-- Table structure for table `roadmap_lppm`
--

CREATE TABLE `roadmap_lppm` (
  `id_roadmap` int NOT NULL,
  `id_prodi` int NOT NULL,
  `id_tahun` int NOT NULL,
  `jenis_roadmap` varchar(100) NOT NULL,
  `link_dokumen` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roadmap_lppm`
--

INSERT INTO `roadmap_lppm` (`id_roadmap`, `id_prodi`, `id_tahun`, `jenis_roadmap`, `link_dokumen`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES
(2, 1, 81, 'Penelitian', 'https://example.com/roadmap-ai', '2026-05-13 18:18:23', '2026-05-14 22:26:20', NULL, 4, NULL, NULL),
(3, 1, 1, 'PKM', 'https://example.com/roadmap-cybersecurity-2098', '2026-05-13 20:52:22', '2026-05-14 22:26:25', NULL, 1, 3, NULL),
(4, 1, 2, 'Penelitian', 'https://example.com/roadmap-smartcity-2099', '2026-05-13 20:52:22', '2026-05-14 22:26:28', NULL, 1, NULL, NULL),
(5, 1, 3, 'PKM', 'https://example.com/roadmap-ai-agriculture-2100', '2026-05-13 20:52:22', '2026-05-14 22:26:32', NULL, 1, NULL, NULL),
(6, 1, 1, 'Penelitian', 'https://lppm.ummetro.ac.id/assets/manager/documents/de734aec402e310517e8dd921273f81b.pdf', '2026-05-14 23:09:13', '2026-05-14 23:09:13', NULL, 3, NULL, NULL),
(7, 2, 1, 'Penelitian', 'http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=backend-akreditasi&table=roadmap_lppm', '2026-05-21 05:21:50', '2026-05-21 05:21:50', NULL, 2, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tahun_akademik`
--

CREATE TABLE `tahun_akademik` (
  `id_tahun` int NOT NULL,
  `tahun` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `tahun_akademik`
--

INSERT INTO `tahun_akademik` (`id_tahun`, `tahun`) VALUES
(1, 2020),
(2, 2021),
(3, 2022),
(4, 2023),
(5, 2024),
(6, 2025),
(7, 2026),
(8, 2027),
(9, 2028),
(10, 2029),
(11, 2030),
(12, 2031),
(13, 2032),
(14, 2033),
(15, 2034),
(16, 2035),
(17, 2036),
(18, 2037),
(19, 2038),
(20, 2039),
(21, 2040),
(22, 2041),
(23, 2042),
(24, 2043),
(25, 2044),
(26, 2045),
(27, 2046),
(28, 2047),
(29, 2048),
(30, 2049),
(31, 2050),
(32, 2051),
(33, 2052),
(34, 2053),
(35, 2054),
(36, 2055),
(37, 2056),
(38, 2057),
(39, 2058),
(40, 2059),
(41, 2060),
(42, 2061),
(43, 2062),
(44, 2063),
(45, 2064),
(46, 2065),
(47, 2066),
(48, 2067),
(49, 2068),
(50, 2069),
(51, 2070),
(52, 2071),
(53, 2072),
(54, 2073),
(55, 2074),
(56, 2075),
(57, 2076),
(58, 2077),
(59, 2078),
(60, 2079),
(61, 2080),
(62, 2081),
(63, 2082),
(64, 2083),
(65, 2084),
(66, 2085),
(67, 2086),
(68, 2087),
(69, 2088),
(70, 2089),
(71, 2090),
(72, 2091),
(73, 2092),
(74, 2093),
(75, 2094),
(76, 2095),
(77, 2096),
(78, 2097),
(79, 2098),
(80, 2099),
(81, 2100);

-- --------------------------------------------------------

--
-- Table structure for table `tenaga_kependidikan`
--

CREATE TABLE `tenaga_kependidikan` (
  `id_tendik` int NOT NULL,
  `id_pegawai` int NOT NULL,
  `jenis_tendik` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `tenaga_kependidikan`
--

INSERT INTO `tenaga_kependidikan` (`id_tendik`, `id_pegawai`, `jenis_tendik`) VALUES
(2, 3, 'Laboran/Teknisi');

-- --------------------------------------------------------

--
-- Table structure for table `unit_kerja`
--

CREATE TABLE `unit_kerja` (
  `id_unit` int NOT NULL,
  `nama_unit` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `unit_kerja`
--

INSERT INTO `unit_kerja` (`id_unit`, `nama_unit`) VALUES
(1, 'UPPS'),
(2, 'TPM'),
(3, 'PMB'),
(4, 'SARPRAS'),
(5, 'SISFO'),
(6, 'ALA'),
(7, 'WAKET 2'),
(8, 'KEUANGAN'),
(9, 'PRODI'),
(10, 'KEMAHASISWAAN'),
(11, 'LPPM'),
(12, 'KEPEGAWAIAN'),
(13, 'ADMIN');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int NOT NULL,
  `id_unit` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('Aktif','Nonaktif') NOT NULL DEFAULT 'Aktif'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `id_unit`, `username`, `password`, `status`) VALUES
(1, 5, 'sisfo', '$2b$10$R.zh9bsVykHEKByW8i3CgeSqSq10diBjxqEkvl5sBRt/.HjQ9zkli', 'Aktif'),
(2, 11, 'lppm', '$2a$12$OV4aMPsI8KpzgyuLtbn.heVQiSsrYqfFliGmfOPd4BvlbUY.B.oa6', 'Aktif'),
(3, 13, 'admin', '$2a$12$OV4aMPsI8KpzgyuLtbn.heVQiSsrYqfFliGmfOPd4BvlbUY.B.oa6', 'Aktif'),
(4, 3, 'pmb', '$2a$12$OV4aMPsI8KpzgyuLtbn.heVQiSsrYqfFliGmfOPd4BvlbUY.B.oa6', 'Aktif'),
(5, 6, 'ala', '$2a$12$OV4aMPsI8KpzgyuLtbn.heVQiSsrYqfFliGmfOPd4BvlbUY.B.oa6', 'Aktif'),
(6, 1, 'UPPS', '$2b$10$Q6N3uGZSUImEIvwRY.oH/uJ71GPiSBlv.FOFYvZwin9t4fmQ3h1kK', 'Aktif'),
(7, 7, 'WAKET2', '$2b$10$YDVwtnnBY.SvzLu7NVwgteKsC08VAJpxZDS9JXuY1WVv43n5ZnOaK', 'Aktif'),
(8, 4, 'SARPRAS', '$2b$10$jUbZ3PVC.2nNEO.Ax6oQzOL/XsH4A0yxj37Cj2SPzzFumzGwgeDwi', 'Aktif'),
(9, 2, 'TPM', '$2b$10$m/cm3G7W90Zq4eiCAysdFONjouMD5684sOU0RGbw51vxvh68SSr2u', 'Aktif'),
(10, 9, 'PRODI-TI', '$2b$10$u4withZkFuBQF5TDGzhBqe5LvCCHkxhRTwxc1rEEtFfXHlzj.beHa', 'Aktif'),
(11, 9, 'PRODI-MI', '$2b$10$6nHSz5yIowA0ZTanDNEwRu.NFhHGyVfp3Al/GlZkxu3/siwpZ7squ', 'Aktif'),
(12, 10, 'KEMAHASISWAAN', '$2b$10$Q1TzHYJgtoE6AsKgLTl1cOo70qtwHCZ/vjDLIMZFUEj3.q3i8O7Ie', 'Aktif'),
(14, 8, 'KEUANGAN', '$2b$10$aoHFOtL5ldlK6n6M.f1lBeVXYHbM9TH9RCDuyFIfgWFIzXS5yaIAW', 'Aktif'),
(15, 12, 'KEPEGAWAIAN', '$2b$10$rPJTCW5/nSah/EMIytlWreiwrNR8iBDLsEP7p5yEhrj2UtXrTVRGy', 'Aktif');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `1a1_pimpinan_dan_tupoksi`
--
ALTER TABLE `1a1_pimpinan_dan_tupoksi`
  ADD PRIMARY KEY (`id_pimpinan`),
  ADD KEY `id_pegawai` (`id_pegawai`),
  ADD KEY `fk_1a1_jafung` (`id_jafung`);

--
-- Indexes for table `1a2_sumber_pendanaan_upps`
--
ALTER TABLE `1a2_sumber_pendanaan_upps`
  ADD PRIMARY KEY (`id_sumber`),
  ADD KEY `fk_1a2_tahun` (`id_tahun`);

--
-- Indexes for table `1a3_penggunaan_dana_upps`
--
ALTER TABLE `1a3_penggunaan_dana_upps`
  ADD PRIMARY KEY (`id_penggunaan`),
  ADD KEY `fk_1a3_tahun` (`id_tahun`);

--
-- Indexes for table `1a4_beban_dtpr`
--
ALTER TABLE `1a4_beban_dtpr`
  ADD PRIMARY KEY (`id_beban_kerja`),
  ADD KEY `id_dosen` (`id_dosen`),
  ADD KEY `id_pimpinan` (`id_pimpinan`),
  ADD KEY `id_tahun` (`id_tahun`);

--
-- Indexes for table `1a5_kualifikasi_tendik`
--
ALTER TABLE `1a5_kualifikasi_tendik`
  ADD PRIMARY KEY (`id_1a5`),
  ADD KEY `fk_1a5_prodi` (`id_prodi`),
  ADD KEY `fk_1a5_tahun` (`id_tahun`),
  ADD KEY `fk_1a5_tendik` (`id_tendik`);

--
-- Indexes for table `1b_unit_spmi_dan_sdm`
--
ALTER TABLE `1b_unit_spmi_dan_sdm`
  ADD PRIMARY KEY (`id_unit_spmi`),
  ADD KEY `fk_spmi_unit` (`unit_kerja_id_unit`),
  ADD KEY `fk_spmi_tahun` (`tahun_akademik_id_tahun`);

--
-- Indexes for table `2a1_data_mahasiswa`
--
ALTER TABLE `2a1_data_mahasiswa`
  ADD PRIMARY KEY (`id_2a1`),
  ADD UNIQUE KEY `idx_prodi_tahun` (`prodi_id_prodi`,`tahun_akademik_id_tahun`),
  ADD UNIQUE KEY `idx_unique_prodi_tahun` (`prodi_id_prodi`,`tahun_akademik_id_tahun`),
  ADD KEY `idx_2a1_prodi_tahun` (`prodi_id_prodi`,`tahun_akademik_id_tahun`),
  ADD KEY `fk_2a1_tahun` (`tahun_akademik_id_tahun`);

--
-- Indexes for table `2a2_keragaman_asal_maba`
--
ALTER TABLE `2a2_keragaman_asal_maba`
  ADD PRIMARY KEY (`id_2a2`),
  ADD UNIQUE KEY `unique_prodi_tahun_2a2` (`prodi_id_prodi`,`tahun_akademik_id_tahun`),
  ADD KEY `fk_2a2_tahun` (`tahun_akademik_id_tahun`);

--
-- Indexes for table `2a3_kondisi_mahasiswa`
--
ALTER TABLE `2a3_kondisi_mahasiswa`
  ADD PRIMARY KEY (`id_2a3`),
  ADD UNIQUE KEY `unique_prodi_tahun_2a3` (`prodi_id_prodi`,`id_tahun`),
  ADD KEY `fk_2a3_tahun` (`id_tahun`);

--
-- Indexes for table `2b1_isi_pembelajaran`
--
ALTER TABLE `2b1_isi_pembelajaran`
  ADD PRIMARY KEY (`id_2b1`),
  ADD KEY `fk_2b1_mk` (`id_mk`),
  ADD KEY `fk_2b1_pl` (`id_pl`),
  ADD KEY `fk_2b1_tahun` (`id_tahun`);

--
-- Indexes for table `2b2_pemetaan_cpl_pl`
--
ALTER TABLE `2b2_pemetaan_cpl_pl`
  ADD PRIMARY KEY (`id_2b2`),
  ADD KEY `fk_2b2_cpl` (`id_cpl`),
  ADD KEY `fk_2b2_pl` (`id_pl`),
  ADD KEY `fk_2b2_tahun` (`id_tahun`);

--
-- Indexes for table `2b3_peta_pemenuhan_cpl`
--
ALTER TABLE `2b3_peta_pemenuhan_cpl`
  ADD PRIMARY KEY (`id_2b3`),
  ADD KEY `fk_2b3_cpl` (`id_cpl`),
  ADD KEY `fk_2b3_cpmk` (`id_cpmk`),
  ADD KEY `fk_2b3_mk` (`id_mk`),
  ADD KEY `fk_2b3_tahun` (`id_tahun`);

--
-- Indexes for table `2b4_masa_tunggu`
--
ALTER TABLE `2b4_masa_tunggu`
  ADD PRIMARY KEY (`id_2b4`),
  ADD KEY `fk_2b4_prodi` (`id_prodi`),
  ADD KEY `fk_2b4_tahun` (`id_tahun`);

--
-- Indexes for table `2b5_kesesuaian_kerja`
--
ALTER TABLE `2b5_kesesuaian_kerja`
  ADD PRIMARY KEY (`id_2b5`),
  ADD KEY `fk_2b5_to_2b4` (`id_2b4`);

--
-- Indexes for table `2b6_kepuasan_pengguna`
--
ALTER TABLE `2b6_kepuasan_pengguna`
  ADD PRIMARY KEY (`id_2b6`);

--
-- Indexes for table `2b6_metadata_lulusan`
--
ALTER TABLE `2b6_metadata_lulusan`
  ADD PRIMARY KEY (`id_metadata`);

--
-- Indexes for table `2c_fleksibilitas_pembelajaran`
--
ALTER TABLE `2c_fleksibilitas_pembelajaran`
  ADD PRIMARY KEY (`id_2c`),
  ADD UNIQUE KEY `unique_2c` (`id_prodi`,`id_tahun`,`id_bentuk`),
  ADD KEY `id_tahun` (`id_tahun`),
  ADD KEY `id_bentuk` (`id_bentuk`);

--
-- Indexes for table `2d_ref_sumber_rekognisi`
--
ALTER TABLE `2d_ref_sumber_rekognisi`
  ADD PRIMARY KEY (`id_ref_sumber`);

--
-- Indexes for table `2d_rekognisi_lulusan`
--
ALTER TABLE `2d_rekognisi_lulusan`
  ADD PRIMARY KEY (`id_2d`),
  ADD KEY `fk_2d_prodi_idx` (`id_prodi`),
  ADD KEY `fk_2d_tahun_idx` (`id_tahun`),
  ADD KEY `fk_2d_sumber_idx` (`id_ref_sumber`);

--
-- Indexes for table `3a1_sarana_prasarana_penelitian`
--
ALTER TABLE `3a1_sarana_prasarana_penelitian`
  ADD PRIMARY KEY (`id_3a1`),
  ADD KEY `fk_3a1_prodi` (`id_prodi`);

--
-- Indexes for table `3a2_penelitian_dtpr`
--
ALTER TABLE `3a2_penelitian_dtpr`
  ADD PRIMARY KEY (`id_3a2`),
  ADD KEY `fk_3a2_roadmap` (`id_roadmap`);

--
-- Indexes for table `3a3_pengembangan_dtpr`
--
ALTER TABLE `3a3_pengembangan_dtpr`
  ADD PRIMARY KEY (`id_pengembangan`),
  ADD KEY `id_dosen` (`id_dosen`),
  ADD KEY `id_tahun` (`id_tahun`);

--
-- Indexes for table `3c1_kerjasama_penelitian`
--
ALTER TABLE `3c1_kerjasama_penelitian`
  ADD PRIMARY KEY (`id_3c1`),
  ADD KEY `id_3a2` (`id_3a2`),
  ADD KEY `fk_3c1_tahun` (`id_tahun`);

--
-- Indexes for table `3c2_publikasi_penelitian`
--
ALTER TABLE `3c2_publikasi_penelitian`
  ADD PRIMARY KEY (`id_3c2`),
  ADD KEY `id_3a2` (`id_3a2`),
  ADD KEY `fk_3c2_tahun` (`id_tahun`);

--
-- Indexes for table `3c3_perolehan_hki`
--
ALTER TABLE `3c3_perolehan_hki`
  ADD PRIMARY KEY (`id_3c3`),
  ADD KEY `id_3a2` (`id_3a2`),
  ADD KEY `fk_3c3_tahun` (`id_tahun`);

--
-- Indexes for table `4a1_sarana_prasarana_pkm`
--
ALTER TABLE `4a1_sarana_prasarana_pkm`
  ADD PRIMARY KEY (`id_4a1`),
  ADD KEY `fk_4a1_prodi` (`id_prodi`);

--
-- Indexes for table `4a2_pkm_dtpr`
--
ALTER TABLE `4a2_pkm_dtpr`
  ADD PRIMARY KEY (`id_4a2`),
  ADD KEY `fk_4a2_roadmap` (`id_roadmap`);

--
-- Indexes for table `4c1_kerjasama_pkm`
--
ALTER TABLE `4c1_kerjasama_pkm`
  ADD PRIMARY KEY (`id_4c1`),
  ADD KEY `id_4a2` (`id_4a2`),
  ADD KEY `fk_4c1_tahun` (`id_tahun`);

--
-- Indexes for table `4c2_diseminasi_hasil_pkm`
--
ALTER TABLE `4c2_diseminasi_hasil_pkm`
  ADD PRIMARY KEY (`id_4c2`),
  ADD KEY `id_4a2` (`id_4a2`),
  ADD KEY `fk_4c2_tahun` (`id_tahun`);

--
-- Indexes for table `4c3_perolehan_hki_pkm`
--
ALTER TABLE `4c3_perolehan_hki_pkm`
  ADD PRIMARY KEY (`id_4c3`),
  ADD KEY `id_4a2` (`id_4a2`),
  ADD KEY `fk_4c3_tahun` (`id_tahun`);

--
-- Indexes for table `5_1_sistem_tata_kelola`
--
ALTER TABLE `5_1_sistem_tata_kelola`
  ADD PRIMARY KEY (`id_5_1`),
  ADD KEY `fk_51_unit` (`id_unit`);

--
-- Indexes for table `5_2_sarana_prasarana_pendidikan`
--
ALTER TABLE `5_2_sarana_prasarana_pendidikan`
  ADD PRIMARY KEY (`id_5_2`),
  ADD KEY `fk_5_2_prodi` (`id_prodi`);

--
-- Indexes for table `6_visi_misi`
--
ALTER TABLE `6_visi_misi`
  ADD PRIMARY KEY (`id_vm`),
  ADD KEY `id_prodi` (`id_prodi`);

--
-- Indexes for table `dosen`
--
ALTER TABLE `dosen`
  ADD PRIMARY KEY (`id_dosen`),
  ADD UNIQUE KEY `nidn` (`nidn`),
  ADD UNIQUE KEY `nuptk` (`nuptk`),
  ADD KEY `id_pegawai` (`id_pegawai`),
  ADD KEY `id_prodi` (`id_prodi`),
  ADD KEY `id_jabatan_fungsional` (`id_jabatan_fungsional`);

--
-- Indexes for table `jabatan_fungsional`
--
ALTER TABLE `jabatan_fungsional`
  ADD PRIMARY KEY (`id_jafung`);

--
-- Indexes for table `jabatan_struktural`
--
ALTER TABLE `jabatan_struktural`
  ADD PRIMARY KEY (`id_jabatan_struktural`);

--
-- Indexes for table `master_bentuk_pembelajaran`
--
ALTER TABLE `master_bentuk_pembelajaran`
  ADD PRIMARY KEY (`id_bentuk`);

--
-- Indexes for table `master_cpl`
--
ALTER TABLE `master_cpl`
  ADD PRIMARY KEY (`id_cpl`),
  ADD KEY `fk_cpl_prodi` (`id_prodi`);

--
-- Indexes for table `master_cpmk`
--
ALTER TABLE `master_cpmk`
  ADD PRIMARY KEY (`id_cpmk`),
  ADD KEY `fk_cpmk_prodi` (`id_prodi`);

--
-- Indexes for table `master_mata_kuliah`
--
ALTER TABLE `master_mata_kuliah`
  ADD PRIMARY KEY (`id_mk`),
  ADD KEY `fk_mk_prodi` (`id_prodi`);

--
-- Indexes for table `master_profil_lulusan`
--
ALTER TABLE `master_profil_lulusan`
  ADD PRIMARY KEY (`id_pl`),
  ADD KEY `fk_pl_prodi` (`id_prodi`);

--
-- Indexes for table `master_sks_jabatan`
--
ALTER TABLE `master_sks_jabatan`
  ADD PRIMARY KEY (`id_sks_jabatan`),
  ADD UNIQUE KEY `nama_pencarian` (`nama_pencarian`);

--
-- Indexes for table `pegawai`
--
ALTER TABLE `pegawai`
  ADD PRIMARY KEY (`id_pegawai`),
  ADD UNIQUE KEY `nikp` (`nikp`),
  ADD KEY `id_unit` (`id_unit`),
  ADD KEY `id_jabatan_struktural` (`id_jabatan_struktural`);

--
-- Indexes for table `prodi`
--
ALTER TABLE `prodi`
  ADD PRIMARY KEY (`id_prodi`),
  ADD KEY `id_unit` (`id_unit`);

--
-- Indexes for table `roadmap_lppm`
--
ALTER TABLE `roadmap_lppm`
  ADD PRIMARY KEY (`id_roadmap`);

--
-- Indexes for table `tahun_akademik`
--
ALTER TABLE `tahun_akademik`
  ADD PRIMARY KEY (`id_tahun`);

--
-- Indexes for table `tenaga_kependidikan`
--
ALTER TABLE `tenaga_kependidikan`
  ADD PRIMARY KEY (`id_tendik`),
  ADD KEY `id_pegawai` (`id_pegawai`);

--
-- Indexes for table `unit_kerja`
--
ALTER TABLE `unit_kerja`
  ADD PRIMARY KEY (`id_unit`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `id_unit` (`id_unit`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `1a1_pimpinan_dan_tupoksi`
--
ALTER TABLE `1a1_pimpinan_dan_tupoksi`
  MODIFY `id_pimpinan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `1a2_sumber_pendanaan_upps`
--
ALTER TABLE `1a2_sumber_pendanaan_upps`
  MODIFY `id_sumber` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `1a3_penggunaan_dana_upps`
--
ALTER TABLE `1a3_penggunaan_dana_upps`
  MODIFY `id_penggunaan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `1a4_beban_dtpr`
--
ALTER TABLE `1a4_beban_dtpr`
  MODIFY `id_beban_kerja` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `1a5_kualifikasi_tendik`
--
ALTER TABLE `1a5_kualifikasi_tendik`
  MODIFY `id_1a5` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `1b_unit_spmi_dan_sdm`
--
ALTER TABLE `1b_unit_spmi_dan_sdm`
  MODIFY `id_unit_spmi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `2a1_data_mahasiswa`
--
ALTER TABLE `2a1_data_mahasiswa`
  MODIFY `id_2a1` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `2a2_keragaman_asal_maba`
--
ALTER TABLE `2a2_keragaman_asal_maba`
  MODIFY `id_2a2` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `2a3_kondisi_mahasiswa`
--
ALTER TABLE `2a3_kondisi_mahasiswa`
  MODIFY `id_2a3` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `2b1_isi_pembelajaran`
--
ALTER TABLE `2b1_isi_pembelajaran`
  MODIFY `id_2b1` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `2b2_pemetaan_cpl_pl`
--
ALTER TABLE `2b2_pemetaan_cpl_pl`
  MODIFY `id_2b2` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=211;

--
-- AUTO_INCREMENT for table `2b3_peta_pemenuhan_cpl`
--
ALTER TABLE `2b3_peta_pemenuhan_cpl`
  MODIFY `id_2b3` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `2b4_masa_tunggu`
--
ALTER TABLE `2b4_masa_tunggu`
  MODIFY `id_2b4` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `2b5_kesesuaian_kerja`
--
ALTER TABLE `2b5_kesesuaian_kerja`
  MODIFY `id_2b5` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `2b6_kepuasan_pengguna`
--
ALTER TABLE `2b6_kepuasan_pengguna`
  MODIFY `id_2b6` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `2b6_metadata_lulusan`
--
ALTER TABLE `2b6_metadata_lulusan`
  MODIFY `id_metadata` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `2c_fleksibilitas_pembelajaran`
--
ALTER TABLE `2c_fleksibilitas_pembelajaran`
  MODIFY `id_2c` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `2d_ref_sumber_rekognisi`
--
ALTER TABLE `2d_ref_sumber_rekognisi`
  MODIFY `id_ref_sumber` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `2d_rekognisi_lulusan`
--
ALTER TABLE `2d_rekognisi_lulusan`
  MODIFY `id_2d` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `3a1_sarana_prasarana_penelitian`
--
ALTER TABLE `3a1_sarana_prasarana_penelitian`
  MODIFY `id_3a1` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `3a2_penelitian_dtpr`
--
ALTER TABLE `3a2_penelitian_dtpr`
  MODIFY `id_3a2` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `3a3_pengembangan_dtpr`
--
ALTER TABLE `3a3_pengembangan_dtpr`
  MODIFY `id_pengembangan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `3c1_kerjasama_penelitian`
--
ALTER TABLE `3c1_kerjasama_penelitian`
  MODIFY `id_3c1` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `3c2_publikasi_penelitian`
--
ALTER TABLE `3c2_publikasi_penelitian`
  MODIFY `id_3c2` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `3c3_perolehan_hki`
--
ALTER TABLE `3c3_perolehan_hki`
  MODIFY `id_3c3` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `4a1_sarana_prasarana_pkm`
--
ALTER TABLE `4a1_sarana_prasarana_pkm`
  MODIFY `id_4a1` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `4a2_pkm_dtpr`
--
ALTER TABLE `4a2_pkm_dtpr`
  MODIFY `id_4a2` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `4c1_kerjasama_pkm`
--
ALTER TABLE `4c1_kerjasama_pkm`
  MODIFY `id_4c1` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `4c2_diseminasi_hasil_pkm`
--
ALTER TABLE `4c2_diseminasi_hasil_pkm`
  MODIFY `id_4c2` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `4c3_perolehan_hki_pkm`
--
ALTER TABLE `4c3_perolehan_hki_pkm`
  MODIFY `id_4c3` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `5_1_sistem_tata_kelola`
--
ALTER TABLE `5_1_sistem_tata_kelola`
  MODIFY `id_5_1` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `5_2_sarana_prasarana_pendidikan`
--
ALTER TABLE `5_2_sarana_prasarana_pendidikan`
  MODIFY `id_5_2` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `6_visi_misi`
--
ALTER TABLE `6_visi_misi`
  MODIFY `id_vm` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `dosen`
--
ALTER TABLE `dosen`
  MODIFY `id_dosen` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jabatan_fungsional`
--
ALTER TABLE `jabatan_fungsional`
  MODIFY `id_jafung` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `jabatan_struktural`
--
ALTER TABLE `jabatan_struktural`
  MODIFY `id_jabatan_struktural` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `master_bentuk_pembelajaran`
--
ALTER TABLE `master_bentuk_pembelajaran`
  MODIFY `id_bentuk` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `master_cpl`
--
ALTER TABLE `master_cpl`
  MODIFY `id_cpl` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `master_cpmk`
--
ALTER TABLE `master_cpmk`
  MODIFY `id_cpmk` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `master_mata_kuliah`
--
ALTER TABLE `master_mata_kuliah`
  MODIFY `id_mk` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `master_profil_lulusan`
--
ALTER TABLE `master_profil_lulusan`
  MODIFY `id_pl` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `master_sks_jabatan`
--
ALTER TABLE `master_sks_jabatan`
  MODIFY `id_sks_jabatan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `pegawai`
--
ALTER TABLE `pegawai`
  MODIFY `id_pegawai` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `prodi`
--
ALTER TABLE `prodi`
  MODIFY `id_prodi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roadmap_lppm`
--
ALTER TABLE `roadmap_lppm`
  MODIFY `id_roadmap` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tahun_akademik`
--
ALTER TABLE `tahun_akademik`
  MODIFY `id_tahun` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `tenaga_kependidikan`
--
ALTER TABLE `tenaga_kependidikan`
  MODIFY `id_tendik` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `unit_kerja`
--
ALTER TABLE `unit_kerja`
  MODIFY `id_unit` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `1a1_pimpinan_dan_tupoksi`
--
ALTER TABLE `1a1_pimpinan_dan_tupoksi`
  ADD CONSTRAINT `1a1_pimpinan_dan_tupoksi_ibfk_1` FOREIGN KEY (`id_pegawai`) REFERENCES `pegawai` (`id_pegawai`),
  ADD CONSTRAINT `fk_1a1_jafung` FOREIGN KEY (`id_jafung`) REFERENCES `jabatan_fungsional` (`id_jafung`);

--
-- Constraints for table `1a2_sumber_pendanaan_upps`
--
ALTER TABLE `1a2_sumber_pendanaan_upps`
  ADD CONSTRAINT `fk_1a2_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `1a3_penggunaan_dana_upps`
--
ALTER TABLE `1a3_penggunaan_dana_upps`
  ADD CONSTRAINT `fk_1a3_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `1a4_beban_dtpr`
--
ALTER TABLE `1a4_beban_dtpr`
  ADD CONSTRAINT `1a4_beban_dtpr_ibfk_1` FOREIGN KEY (`id_dosen`) REFERENCES `dosen` (`id_dosen`),
  ADD CONSTRAINT `1a4_beban_dtpr_ibfk_2` FOREIGN KEY (`id_pimpinan`) REFERENCES `1a1_pimpinan_dan_tupoksi` (`id_pimpinan`),
  ADD CONSTRAINT `1a4_beban_dtpr_ibfk_3` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `1a5_kualifikasi_tendik`
--
ALTER TABLE `1a5_kualifikasi_tendik`
  ADD CONSTRAINT `fk_1a5_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `fk_1a5_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`),
  ADD CONSTRAINT `fk_1a5_tendik` FOREIGN KEY (`id_tendik`) REFERENCES `tenaga_kependidikan` (`id_tendik`);

--
-- Constraints for table `1b_unit_spmi_dan_sdm`
--
ALTER TABLE `1b_unit_spmi_dan_sdm`
  ADD CONSTRAINT `fk_spmi_tahun` FOREIGN KEY (`tahun_akademik_id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`),
  ADD CONSTRAINT `fk_spmi_unit` FOREIGN KEY (`unit_kerja_id_unit`) REFERENCES `unit_kerja` (`id_unit`);

--
-- Constraints for table `2a1_data_mahasiswa`
--
ALTER TABLE `2a1_data_mahasiswa`
  ADD CONSTRAINT `fk_2a1_prodi` FOREIGN KEY (`prodi_id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `fk_2a1_tahun` FOREIGN KEY (`tahun_akademik_id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `2a2_keragaman_asal_maba`
--
ALTER TABLE `2a2_keragaman_asal_maba`
  ADD CONSTRAINT `fk_2a2_prodi` FOREIGN KEY (`prodi_id_prodi`) REFERENCES `prodi` (`id_prodi`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_2a2_tahun` FOREIGN KEY (`tahun_akademik_id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `2a3_kondisi_mahasiswa`
--
ALTER TABLE `2a3_kondisi_mahasiswa`
  ADD CONSTRAINT `fk_2a3_prodi` FOREIGN KEY (`prodi_id_prodi`) REFERENCES `prodi` (`id_prodi`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_2a3_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `2b1_isi_pembelajaran`
--
ALTER TABLE `2b1_isi_pembelajaran`
  ADD CONSTRAINT `fk_2b1_mk` FOREIGN KEY (`id_mk`) REFERENCES `master_mata_kuliah` (`id_mk`),
  ADD CONSTRAINT `fk_2b1_pl` FOREIGN KEY (`id_pl`) REFERENCES `master_profil_lulusan` (`id_pl`),
  ADD CONSTRAINT `fk_2b1_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `2b2_pemetaan_cpl_pl`
--
ALTER TABLE `2b2_pemetaan_cpl_pl`
  ADD CONSTRAINT `fk_2b2_cpl` FOREIGN KEY (`id_cpl`) REFERENCES `master_cpl` (`id_cpl`),
  ADD CONSTRAINT `fk_2b2_pl` FOREIGN KEY (`id_pl`) REFERENCES `master_profil_lulusan` (`id_pl`),
  ADD CONSTRAINT `fk_2b2_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `2b3_peta_pemenuhan_cpl`
--
ALTER TABLE `2b3_peta_pemenuhan_cpl`
  ADD CONSTRAINT `fk_2b3_cpl` FOREIGN KEY (`id_cpl`) REFERENCES `master_cpl` (`id_cpl`),
  ADD CONSTRAINT `fk_2b3_cpmk` FOREIGN KEY (`id_cpmk`) REFERENCES `master_cpmk` (`id_cpmk`),
  ADD CONSTRAINT `fk_2b3_mk` FOREIGN KEY (`id_mk`) REFERENCES `master_mata_kuliah` (`id_mk`),
  ADD CONSTRAINT `fk_2b3_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `2b4_masa_tunggu`
--
ALTER TABLE `2b4_masa_tunggu`
  ADD CONSTRAINT `fk_2b4_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `fk_2b4_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `2b5_kesesuaian_kerja`
--
ALTER TABLE `2b5_kesesuaian_kerja`
  ADD CONSTRAINT `fk_2b5_to_2b4` FOREIGN KEY (`id_2b4`) REFERENCES `2b4_masa_tunggu` (`id_2b4`) ON DELETE CASCADE;

--
-- Constraints for table `2c_fleksibilitas_pembelajaran`
--
ALTER TABLE `2c_fleksibilitas_pembelajaran`
  ADD CONSTRAINT `2c_fleksibilitas_pembelajaran_ibfk_1` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `2c_fleksibilitas_pembelajaran_ibfk_2` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`),
  ADD CONSTRAINT `2c_fleksibilitas_pembelajaran_ibfk_3` FOREIGN KEY (`id_bentuk`) REFERENCES `master_bentuk_pembelajaran` (`id_bentuk`);

--
-- Constraints for table `2d_rekognisi_lulusan`
--
ALTER TABLE `2d_rekognisi_lulusan`
  ADD CONSTRAINT `fk_2d_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `fk_2d_sumber` FOREIGN KEY (`id_ref_sumber`) REFERENCES `2d_ref_sumber_rekognisi` (`id_ref_sumber`),
  ADD CONSTRAINT `fk_2d_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `3a1_sarana_prasarana_penelitian`
--
ALTER TABLE `3a1_sarana_prasarana_penelitian`
  ADD CONSTRAINT `fk_3a1_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `3a2_penelitian_dtpr`
--
ALTER TABLE `3a2_penelitian_dtpr`
  ADD CONSTRAINT `fk_3a2_roadmap` FOREIGN KEY (`id_roadmap`) REFERENCES `roadmap_lppm` (`id_roadmap`) ON UPDATE CASCADE;

--
-- Constraints for table `3a3_pengembangan_dtpr`
--
ALTER TABLE `3a3_pengembangan_dtpr`
  ADD CONSTRAINT `3a3_pengembangan_dtpr_ibfk_1` FOREIGN KEY (`id_dosen`) REFERENCES `dosen` (`id_dosen`),
  ADD CONSTRAINT `3a3_pengembangan_dtpr_ibfk_2` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `3c1_kerjasama_penelitian`
--
ALTER TABLE `3c1_kerjasama_penelitian`
  ADD CONSTRAINT `3c1_kerjasama_penelitian_ibfk_1` FOREIGN KEY (`id_3a2`) REFERENCES `3a2_penelitian_dtpr` (`id_3a2`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_3c1_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `3c2_publikasi_penelitian`
--
ALTER TABLE `3c2_publikasi_penelitian`
  ADD CONSTRAINT `3c2_publikasi_penelitian_ibfk_1` FOREIGN KEY (`id_3a2`) REFERENCES `3a2_penelitian_dtpr` (`id_3a2`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_3c2_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `3c3_perolehan_hki`
--
ALTER TABLE `3c3_perolehan_hki`
  ADD CONSTRAINT `3c3_perolehan_hki_ibfk_1` FOREIGN KEY (`id_3a2`) REFERENCES `3a2_penelitian_dtpr` (`id_3a2`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_3c3_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `4a1_sarana_prasarana_pkm`
--
ALTER TABLE `4a1_sarana_prasarana_pkm`
  ADD CONSTRAINT `fk_4a1_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `4a2_pkm_dtpr`
--
ALTER TABLE `4a2_pkm_dtpr`
  ADD CONSTRAINT `fk_4a2_roadmap` FOREIGN KEY (`id_roadmap`) REFERENCES `roadmap_lppm` (`id_roadmap`) ON UPDATE CASCADE;

--
-- Constraints for table `4c1_kerjasama_pkm`
--
ALTER TABLE `4c1_kerjasama_pkm`
  ADD CONSTRAINT `4c1_kerjasama_pkm_ibfk_1` FOREIGN KEY (`id_4a2`) REFERENCES `4a2_pkm_dtpr` (`id_4a2`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_4c1_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `4c2_diseminasi_hasil_pkm`
--
ALTER TABLE `4c2_diseminasi_hasil_pkm`
  ADD CONSTRAINT `4c2_diseminasi_hasil_pkm_ibfk_1` FOREIGN KEY (`id_4a2`) REFERENCES `4a2_pkm_dtpr` (`id_4a2`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_4c2_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `4c3_perolehan_hki_pkm`
--
ALTER TABLE `4c3_perolehan_hki_pkm`
  ADD CONSTRAINT `4c3_perolehan_hki_pkm_ibfk_1` FOREIGN KEY (`id_4a2`) REFERENCES `4a2_pkm_dtpr` (`id_4a2`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_4c3_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `5_1_sistem_tata_kelola`
--
ALTER TABLE `5_1_sistem_tata_kelola`
  ADD CONSTRAINT `fk_51_unit` FOREIGN KEY (`id_unit`) REFERENCES `unit_kerja` (`id_unit`) ON DELETE SET NULL;

--
-- Constraints for table `5_2_sarana_prasarana_pendidikan`
--
ALTER TABLE `5_2_sarana_prasarana_pendidikan`
  ADD CONSTRAINT `fk_5_2_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `6_visi_misi`
--
ALTER TABLE `6_visi_misi`
  ADD CONSTRAINT `6_visi_misi_ibfk_1` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `dosen`
--
ALTER TABLE `dosen`
  ADD CONSTRAINT `dosen_ibfk_1` FOREIGN KEY (`id_pegawai`) REFERENCES `pegawai` (`id_pegawai`),
  ADD CONSTRAINT `dosen_ibfk_2` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `dosen_ibfk_3` FOREIGN KEY (`id_jabatan_fungsional`) REFERENCES `jabatan_fungsional` (`id_jafung`);

--
-- Constraints for table `master_cpl`
--
ALTER TABLE `master_cpl`
  ADD CONSTRAINT `fk_cpl_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `master_cpmk`
--
ALTER TABLE `master_cpmk`
  ADD CONSTRAINT `fk_cpmk_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `master_mata_kuliah`
--
ALTER TABLE `master_mata_kuliah`
  ADD CONSTRAINT `fk_mk_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `master_profil_lulusan`
--
ALTER TABLE `master_profil_lulusan`
  ADD CONSTRAINT `fk_pl_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `pegawai`
--
ALTER TABLE `pegawai`
  ADD CONSTRAINT `pegawai_ibfk_1` FOREIGN KEY (`id_unit`) REFERENCES `unit_kerja` (`id_unit`),
  ADD CONSTRAINT `pegawai_ibfk_2` FOREIGN KEY (`id_jabatan_struktural`) REFERENCES `jabatan_struktural` (`id_jabatan_struktural`);

--
-- Constraints for table `prodi`
--
ALTER TABLE `prodi`
  ADD CONSTRAINT `prodi_ibfk_1` FOREIGN KEY (`id_unit`) REFERENCES `unit_kerja` (`id_unit`);

--
-- Constraints for table `tenaga_kependidikan`
--
ALTER TABLE `tenaga_kependidikan`
  ADD CONSTRAINT `tenaga_kependidikan_ibfk_1` FOREIGN KEY (`id_pegawai`) REFERENCES `pegawai` (`id_pegawai`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_unit`) REFERENCES `unit_kerja` (`id_unit`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
