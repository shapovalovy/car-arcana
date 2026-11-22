# CAT ARCANA — Mystical Cat Oracle

A local-first Expo / React Native MVP starter for an original 48-card cat oracle app.

## Included
- Five-tab app: Home, Ask, Collection, Journal, Profile.
- 48 original card records in `src/data/cards.ts`.
- Daily card persistence using AsyncStorage.
- One-card and three-card spreads without duplicates.
- Favorites and reading journal.
- Seven language selector: English, Ukrainian, Spanish, French, German, Brazilian Portuguese, Japanese.
- Dark mystical visual theme.

## Important MVP limitations
- Card artwork currently uses a placeholder cat glyph. Replace with commissioned/original card illustrations in `assets/` before release.
- UI navigation strings are localized. The card interpretations are currently authored in English; complete professional localization of all 48 interpretations is required before claiming full multilingual content.
- Subscription screens, RevenueCat purchases, push notifications, cloud sync, share-as-image and production privacy/legal pages are not yet integrated.
- The card draw is for entertainment and reflection, not guaranteed prediction.

## Run locally

1. Install Node.js LTS.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Expo:
   ```bash
   npx expo start
   ```
4. Install Expo Go on your iPhone and scan the QR code (same Wi-Fi network).
5. For a native iOS build, use a Mac with Xcode or EAS Build.

## Before App Store release
- Change `ios.bundleIdentifier` in `app.json` to a unique reverse-domain identifier you control.
- Add original card artwork, app icon and launch screen.
- Professionally localize every card and all UI copy in all seven languages.
- Add Privacy Policy and Terms of Use URLs.
- Add account deletion if accounts are introduced.
- Implement and test StoreKit / RevenueCat purchases and Restore Purchases.
- Test on physical devices and through TestFlight.
- Review current Apple App Store Review Guidelines and Expo EAS submission documentation.

## Build with EAS (after configuring an Expo account)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios
```

To submit a completed build:

```bash
eas submit --platform ios
```

Submission requires Apple Developer Program membership and App Store Connect setup.
