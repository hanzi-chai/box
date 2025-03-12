import { defineConfig, presetIcons, presetTypography, presetWind3 } from "unocss"

export default defineConfig({
    content: {
        filesystem: ["./src/**/*.vue"],
    },
    presets: [
        presetWind3(),
        presetTypography(),
        presetIcons({
            warn: true
        })],
})
