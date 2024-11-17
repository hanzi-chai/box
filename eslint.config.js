import { sxzz } from "@sxzz/eslint-config"
import unocss from '@unocss/eslint-config/flat'

export default sxzz(
    [
        unocss,
        // your custom config
        {
            rules: {
                "unicorn/prefer-add-event-listener": "off",
                "vue/html-indent": "off",
                "unicorn/no-new-array": "off",
            }
        },
    ],
    {
        vue: true,
        unocss: true,
        prettier: false,
        sortKeys: true,
    },
)
