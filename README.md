<div align="center">

<br/>

# Finora

### Your finances, in your pocket.

A secure, multilingual React Native app for **loans, invoices, repayments and spend tracking**, built for customers who want everything in one tap.

<br/>

![React Native](https://img.shields.io/badge/React_Native-0.86-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-57-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-State-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![EAS Build](https://img.shields.io/badge/EAS-Build-4630EB?style=for-the-badge&logo=expo&logoColor=white)

![iOS](https://img.shields.io/badge/iOS-000000?style=flat-square&logo=apple&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android&logoColor=white)
![Languages](https://img.shields.io/badge/Languages-8-orange?style=flat-square)
![License](https://img.shields.io/badge/License-Proprietary-lightgrey?style=flat-square)

<br/>

<img src="https://skillicons.dev/icons?i=react,typescript,redux,nodejs,androidstudio,apple&theme=dark" alt="tech stack icons" />

</div>

<br/>

---

## Tech Stack

<div align="center">

| Layer | Technology |
| --- | --- |
| Framework | React Native 0.86 + Expo 57 |
| Language | TypeScript (strict) |
| Navigation | Expo Router + React Navigation (Stack + Bottom Tabs) |
| State Management | Redux Toolkit + React Query |
| Forms | React Hook Form + Zod |
| Localisation | i18next + react-i18next (8 languages) |
| Animations | Reanimated + Animated API + Lottie |
| Product Tour | Native spotlight walkthrough (`TourContext`) |
| Biometrics | `expo-local-authentication` |
| Secure Storage | `expo-secure-store` |
| Notifications | `expo-notifications` |
| Build & Release | EAS Build |

</div>

---

## Project Structure

```
Finora/
├── app/                          ← Expo Router entry
│   ├── _layout.tsx               ← root layout (GestureHandler + SafeArea)
│   ├── index.tsx                 ← app entry, all providers mounted here
│   └── [...unmatched].tsx        ← wildcard redirect to /
│
├── assets/
│   ├── png/                      ← all app icons and splash images
│   │   ├── icon.png              ← 1024×1024, transparent
│   │   ├── splash-icon.png       ← 1024×1024, transparent
│   │   ├── favicon.png           ← 512×512, transparent
│   │   ├── android-icon-foreground.png   ← 432×432, transparent
│   │   ├── android-icon-background.png   ← 432×432, Finora orange
│   │   ├── android-icon-monochrome.png   ← 432×432, white mark
│   │   └── notification-icon.png         ← 96×96, white mark
│   ├── illustration/             ← static illustration images
│   ├── json/                     ← Lottie animation files
│   ├── sounds/                   ← success / failure / notification mp3
│   └── svgs/                     ← Logo.tsx, TabIcons.tsx
│
├── src/
│   ├── animations/               ← reusable animation primitives
│   │   ├── animated-bar/
│   │   ├── scroll-reveal/
│   │   └── spring-reveal/
│   │
│   ├── components/               ← generic, feature-agnostic UI components
│   │   ├── chart/bar-chart/
│   │   ├── confetti/
│   │   ├── date-range-picker/
│   │   ├── legal-content/
│   │   ├── loaders/
│   │   ├── menu-row/
│   │   ├── product-tour/
│   │   ├── profile-card/
│   │   ├── screen-header/
│   │   ├── service-request/
│   │   ├── tab-bar/
│   │   └── toast-config/
│   │
│   ├── context/                  ← React context providers
│   │   ├── language/             ← i18next init + SUPPORTED_LANGUAGES
│   │   ├── Loading/              ← global loading overlay
│   │   ├── Notifications/        ← push notification state
│   │   └── Theme/                ← color tokens + ThemeProvider
│   │
│   ├── helpers/                  ← shared render helpers (not pure utils)
│   │   ├── button/               ← PrimaryButton, SecondaryButton, etc.
│   │   ├── model/                ← reusable modal/bottom-sheet wrapper
│   │   └── sounds/               ← expo-audio playback helpers
│   │
│   ├── hooks/                    ← custom React hooks
│   │   ├── useLoadingAction/
│   │   └── useSpendSummary/
│   │
│   ├── locales/                  ← translation JSON files
│   │   ├── en.json  hi.json  bn.json  mr.json
│   │   ├── ta.json  te.json  kn.json  guj.json
│   │
│   ├── mock/                     ← local mock data for development
│   │   └── track-spend/
│   │
│   ├── routes/
│   │   └── index.tsx             ← single Tab.Navigator, all screens registered
│   │
│   ├── screens/                  ← one folder per screen / feature
│   │   ├── credit/
│   │   ├── home/
│   │   ├── invoices/
│   │   ├── money/
│   │   ├── more/
│   │   ├── payment-history/
│   │   ├── profile/              ← profile + all sub-screens
│   │   │   ├── about-app/
│   │   │   ├── company/
│   │   │   ├── documents/
│   │   │   ├── nach-cancellation/
│   │   │   ├── ndc-certificate/
│   │   │   ├── personal/
│   │   │   ├── privacy-policy/
│   │   │   ├── quick-review/
│   │   │   ├── rate-us/
│   │   │   ├── refund-cancellation/
│   │   │   ├── settings/
│   │   │   ├── terms-conditions/
│   │   │   └── update-contact/
│   │   └── track-spend/          ← spend analytics screen + sub-components
│   │
│   ├── shared/                   ← components shared across multiple screens
│   │   ├── card/
│   │   ├── contact-details/
│   │   ├── notifications/        ← notification templates, config, service
│   │   ├── recent-payments/
│   │   └── spend-chart/
│   │
│   ├── store/                    ← Redux store
│   │   ├── index.ts              ← configureStore + typed hooks
│   │   └── navSlice.ts           ← navigation back-stack slice
│   │
│   ├── stubs/
│   │   └── react-native-maps.web.js   ← web stub (maps not supported on web)
│   │
│   ├── types/                    ← shared TypeScript types (alias: @data-types)
│   │   ├── chart/  date-range/  legal/  more/  nav/
│   │   ├── notifications/  product-tour/  profile/  track-spend/
│   │   └── index.ts
│   │
│   └── utils/                    ← pure utility functions
│       ├── format-locals/        ← formatINR, formatDate, formatLakh, etc.
│       ├── message-pool/
│       ├── tagline/
│       └── toast/
│
├── app.json                      ← Expo config (icons, splash, plugins)
├── babel.config.js               ← path aliases (@hooks, @screens, etc.)
├── metro.config.js               ← web stub resolver for react-native-maps
├── package.json
└── tsconfig.json
```

---

## Path Aliases

Defined in `babel.config.js` and `tsconfig.json`:

| Alias | Resolves to |
| --- | --- |
| `@hooks` | `src/hooks` |
| `@context` | `src/context` |
| `@components` | `src/components` |
| `@utils` | `src/utils` |
| `@store` | `src/store` |
| `@data-types` | `src/types` |
| `@animations` | `src/animations` |
| `@helpers` | `src/helpers` |
| `@assets` | `assets` |
| `@screens` | `src/screens` |
| `@shared` | `src/shared` |
| `@mock` | `src/mock` |

---

## Localisation

<div align="center">

| `en` | `hi` | `bn` | `mr` | `guj` | `ta` | `te` | `kn` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| English | Hindi | Bengali | Marathi | Gujarati | Tamil | Telugu | Kannada |

</div>

All strings live in `src/locales/*.json` and are resolved through `src/context/language`. `fallbackLng` is `en`, so a missing key renders in English instead of breaking the screen.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Web (uses Metro bundler)
npm run web
```

## Building

```bash
# Web export (with cache clear)
npx expo export --platform web --clear

# Android / iOS via EAS
npm run build:android
npm run build:ios
npm run build:all
```

---

## Contributing

```bash
# 1. Sync with main
git checkout main && git pull origin main

# 2. Branch
git checkout -b feature/<short-description>

# 3. Verify before committing
npm run typecheck
npm run lint

# 4. Commit using conventional commits
git commit -m "feat(invoices): add QR upload validation"

# 5. Push and open PR
git push origin feature/<short-description>
```

Commit types: `feat | fix | docs | style | refactor | test | chore`

PR checklist: typecheck passes, lint passes, screenshot for UI changes, 1 approval required, squash merge into `main`.

---

<div align="center">

Made with love by Rahul Goswami

<sub>Proprietary software · All rights reserved</sub>

</div>
