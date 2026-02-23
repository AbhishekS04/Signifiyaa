/**
 * Expo Config Plugin: Unlock High Refresh Rate on Android
 *
 * By default, Android caps rendering at 60fps even on 90/120/144Hz devices.
 * This plugin injects code into MainActivity.kt to request the device's
 * maximum supported refresh rate — making Reanimated animations, scrolling,
 * and gesture responses buttery smooth on capable hardware.
 *
 * iOS already supports ProMotion (120Hz) via CADisableMinimumFrameDurationOnPhone
 * which is set in app.json → ios.infoPlist.
 *
 * Zero-risk: on 60Hz devices this is a no-op.
 */
const {
  withMainActivity,
} = require("expo/config-plugins");

/** Code to inject at the end of onCreate, after super.onCreate(...) */
const HIGH_REFRESH_RATE_CODE = `
    // ── Unlock high refresh rate (90/120/144Hz) on capable devices ──
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
      val windowParams = window.attributes
      val display = windowManager.defaultDisplay
      val supportedModes = display.supportedModes
      val highestMode = supportedModes.maxByOrNull { it.refreshRate }
      if (highestMode != null) {
        windowParams.preferredDisplayModeId = highestMode.modeId
        window.attributes = windowParams
      }
    }`;

function withHighRefreshRate(config) {
  return withMainActivity(config, (mod) => {
    const contents = mod.modResults.contents;

    // Don't inject twice
    if (contents.includes("preferredDisplayModeId")) {
      return mod;
    }

    // Find the end of super.onCreate(null) line and inject after it
    const superOnCreateRegex = /super\.onCreate\(null\)/;
    if (superOnCreateRegex.test(contents)) {
      mod.modResults.contents = contents.replace(
        superOnCreateRegex,
        `super.onCreate(null)${HIGH_REFRESH_RATE_CODE}`
      );
    }

    return mod;
  });
}

module.exports = withHighRefreshRate;
