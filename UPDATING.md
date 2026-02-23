# How to Update the App (EAS Updates)

Since we have configured `expo-updates`, you can push "Over-The-Air" (OTA) updates to your app without users needing to download a new APK/IPA, provided the changes are only in JavaScript/TypeScript or assets (images, fonts).

## Important: One-Time Setup

**If you built your APK/AAB *before* we added `expo-updates` (before today), you MUST rebuild it one last time.**
The `expo-updates` library is "native" code, so it needs to be compiled into the binary.

1. Rebuild the Android Preview:

   ```bash
   eas build --profile preview --platform android
   ```

2. Install this new APK on your device.

## How to Push Updates

Once the app with `expo-updates` is installed on the device, you can push changes instantly using:

```bash
npx eas update --channel preview
```

### When to use this?

- ✅ **Use for**: Changing text, logic, colors, UI components (JS/TS code), or updating images/fonts.
- ❌ **Do NOT use for**: Installing new npm packages that require native code (e.g., camera, maps, native modules) or changing `app.json` / `eas.json` configuration significantly. In these cases, you must run `eas build` again.

### Troubleshooting

- If the update doesn't show up, try force-closing and reopening the app twice.
- Ensure your `eas.json` channel matches the command (we are using `preview`).
