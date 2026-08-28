/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },

  async redirects() {
    // Las páginas legales cambiaron de dirección. Las viejas circularon en el
    // pie del sitio, así que redirigen en vez de dar 404. Permanente: es la
    // dirección definitiva y conviene que los buscadores la aprendan.
    return [
      { source: "/legales/terminos", destination: "/terminos-y-condiciones", permanent: true },
      { source: "/legales/privacidad", destination: "/politica-de-privacidad", permanent: true },
    ];
  },
};
export default nextConfig;
