const { withAndroidManifest } = require("expo/config-plugins");

const ANDROID_APP_ID = "ca-app-pub-2889632845666311~2812266052";

module.exports = function withAdMobAppId(config) {
  return withAndroidManifest(config, (cfg) => {
    const mainApplication =
      cfg.modResults.manifest.application?.[0];

    if (!mainApplication) return cfg;

    // Ensure meta-data array exists
    if (!mainApplication["meta-data"]) {
      mainApplication["meta-data"] = [];
    }

    const meta = mainApplication["meta-data"];

    // Check if APPLICATION_ID is already present
    const alreadyPresent = meta.some(
      (m) => m.$?.["android:name"] === "com.google.android.gms.ads.APPLICATION_ID"
    );

    if (!alreadyPresent) {
      meta.push({
        $: {
          "android:name": "com.google.android.gms.ads.APPLICATION_ID",
          "android:value": ANDROID_APP_ID,
        },
      });
    }

    return cfg;
  });
};
