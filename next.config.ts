/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true, // biar aman di hosting static (hasilnya /surat/1/index.html)
};

module.exports = nextConfig;
