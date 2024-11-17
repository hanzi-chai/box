import { defineConfig, presetUno, presetTypography } from 'unocss';

export default defineConfig({
    content: {
        filesystem: ['./src/**/*.vue'],
    },
    presets: [presetUno(), presetTypography()],
});