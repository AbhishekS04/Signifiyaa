module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        // Reanimated plugin disabled due to Metro bundler hanging at 99.9%
        // Animations will still work, just not optimized by babel transform
        plugins: [
            [
                "react-native-reanimated/plugin",
                {
                    globals: ["__scanCodes"],
                },
            ],
        ],
    };
};
