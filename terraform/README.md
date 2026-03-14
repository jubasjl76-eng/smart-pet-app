# React Native App - Infrastructure Notes
# 
# The React Native app requires special handling for deployment:
#
# OPTION 1: Expo EAS (Recommended for Expo apps)
# - EAS Build: Automated builds for iOS/Android
# - EAS Submit: Auto-submit to App Stores
# - Requires: expo account, eas CLI
#
# OPTION 2: Bare React Native with Fastlane
# - Build .ipa locally or in CI
# - Use Fastlane for App Store deployment
# - Requires: Apple Developer account, certificates
#
# OPTION 3: GitHub Actions (No Expo)
# - Build Android APK/AAB
# - Build iOS (requires Mac runner or external service)
# - Can deploy to Firebase App Distribution
#
# For now, we'll use manual builds or EAS when ready.
# 
# Required secrets for CI/CD:
# - APPLE_ID
# - APPLE_APP_SPECIFIC_PASSWORD
# - APPLE_TEAM_ID
# - ANDROID_KEYSTORE (base64)
# - ANDROID_KEY_ALIAS

terraform {
  # Placeholder - not applicable for mobile apps
}
