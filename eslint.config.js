import { sxzz } from "@sxzz/eslint-config"
export default sxzz(
    [
        // your custom config
        {
            "unicorn/prefer-add-event-listener": "off",
        },
    ],
    {
        vue: true,
        unocss: true,
        prettier: false,
        sortKeys: true,
    },
)
