import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DACS Favor Swapper",
    short_name: "Favor Swapper",
    theme_color: "#22c55e",
    background_color: "#0c0a09",
    icons:  [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/icon512_maskable.png",
        type: "image/png"
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "/icon512_rounded.png",
        type: "image/png"
      }
    ],
    orientation: "portrait",
    display: "standalone",
    lang: "en-US",
    start_url: "/",
    scope: "/",
  }
}