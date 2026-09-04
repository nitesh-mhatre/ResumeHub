const { withProjectBuildGradle } = require("expo/config-plugins");

module.exports = function withKotlinGradlePluginVersion(config) {
  return withProjectBuildGradle(config, (cfg) => {
    const classpath = "classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')";
    if (!cfg.modResults.contents.includes(classpath)) return cfg;

    cfg.modResults.contents = cfg.modResults.contents
      .replace(
        "buildscript {",
        "buildscript {\n  ext.kotlinVersion = findProperty('android.kotlinVersion') ?: '2.1.20'"
      )
      .replace(
        classpath,
        'classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}")'
      );

    // Add subprojects block to set language version to 2.1 for compatibility
    const applyBlock =
      "\nsubprojects { subproject ->\n  subproject.plugins.withId('org.jetbrains.kotlin.android') {\n    subproject.tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {\n      compilerOptions {\n        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1)\n      }\n    }\n  }\n}\n";

    if (!cfg.modResults.contents.includes("subprojects { subproject ->")) {
      // Insert after the last apply plugin line
      const lastApplyIndex = cfg.modResults.contents.lastIndexOf("apply plugin:");
      if (lastApplyIndex !== -1) {
        const lineEnd = cfg.modResults.contents.indexOf("\n", lastApplyIndex);
        cfg.modResults.contents =
          cfg.modResults.contents.slice(0, lineEnd + 1) +
          applyBlock +
          cfg.modResults.contents.slice(lineEnd + 1);
      }
    }

    return cfg;
  });
};
