import { defineConfig, presetIcons, presetTypography, presetUno } from "unocss"

export default defineConfig({
    content: {
        filesystem: ["./src/**/*.vue"],
    },
    presets: [
        presetUno(),
        presetTypography(),
        presetIcons({
            warn: true
        })],
})
