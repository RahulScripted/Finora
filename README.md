<div align="center">

<br/>

# 📱 Finora

### Your finances, in your pocket.

A secure, multilingual React Native app for **loans, invoices, repayments and documents**, built for customers who want everything in one tap.

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



## 🧱 Tech Stack

<div align="center">

| Layer                | Technology                                                           |
| -------------------- | -------------------------------------------------------------------- |
| **Framework**        | React Native 0.86 + Expo 57                                          |
| **Language**         | TypeScript (strict)                                                  |
| **Navigation**       | Expo Router + React Navigation (Stack + Bottom Tabs)                 |
| **State Management** | Redux Toolkit + React Query                                          |
| **Forms**            | React Hook Form + Zod                                                |
| **Localisation**     | i18next + react-i18next (8 languages)                                |
| **Animations**       | Reanimated + Animated API + Lottie                                   |
| **Product Tour**     | Native spotlight walkthrough (`useTour` + `useTourTargets`)          |
| **Auth**             | Biometric (`expo-local-authentication`) + MPIN                       |
| **Secure Storage**   | `expo-secure-store` (auth + refresh tokens)                          |
| **Error Reporting**  | Global report flow (`expo-mail-composer` + `react-native-view-shot`) |
| **Notifications**    | Expo Notifications                                                   |
| **Build & Release**  | EAS Build                                                            |

</div>

## 📁 Project Structure

<details open>
<summary><b>Click to expand / collapse the full directory tree</b></summary>

```
Customer-App/
├── app/                                   ← Expo Router routes
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── coin-preview.tsx
│   ├── [...unmatched].tsx
│   └── public/                            ← auth-free deep-link screens
│       ├── utils/
│       │   ├── PublicSuccessView.tsx
│       │   ├── PublicScreenShell.tsx
│       │   ├── PublicLinkErrorView.tsx
│       │   └── useColumnReveal.ts
│       ├── bankstatement/
│       ├── repay/
│       ├── itr/
│       ├── gst/
│       ├── ckyc/
│       ├── esign/
│       ├── emandate/
│       └── proposalletter/
│
├── src/
│   ├── animations/
│   ├── api-calls/
│   ├── components/
│   │   ├── product-tour/                  ← guided spotlight walkthrough
│   │   ├── report-problem/                ← screenshot countdown overlay
│   │   └── ...
│   ├── context/
│   │   ├── Auth/
│   │   ├── ErrorReport/                   ← global "Report a problem" flow
│   │   ├── language/                      ← i18next setup + resources
│   │   ├── Loading/
│   │   └── Theme/
│   ├── env/
│   │   └── index.ts                       ← all EXPO_PUBLIC_* keys, centralised
│   ├── helpers/
│   ├── hooks/
│   ├── locales/                           ← 8 translation files + README
│   ├── routes/
│   ├── screens/
│   ├── services/
│   ├── shared/
│   ├── store/
│   ├── types/                             ← shared TS types (alias: @data-types)
│   └── utils/
│       ├── format-locals/
│       └── message-pool/
│
├── assets/
│   ├── fonts/
│   ├── illustration/
│   ├── json/                              ← Lottie animations
│   └── svgs/
│
├── app.json
├── babel.config.js
├── package.json
├── tsconfig.json
└── README.md
```

</details>


## 🌍 Localisation

<div align="center">

| 🇬🇧 `en` | 🇮🇳 `hi` | 🇮🇳 `bn` | 🇮🇳 `mr` | 🇮🇳 `guj` | 🇮🇳 `ta` | 🇮🇳 `te` | 🇮🇳 `kn` |
| ------- | ------- | ------- | ------- | -------- | ------- | ------- | ------- |
| English | Hindi   | Bengali | Marathi | Gujarati | Tamil   | Telugu  | Kannada |

</div>

All strings live in `src/locales/*.json` and are resolved through `src/context/language`. `fallbackLng` is `en`, so a missing key renders in English instead of breaking the screen. See `src/locales/README.md` for how to add new strings.

---

## 🤝 Contributing

Contributions are warmly welcome. Please review the guidelines below before opening a PR.

### Workflow

```bash
# 1. Sync with the latest main
git checkout main
git pull origin main

# 2. Create a branch
git checkout -b feature/<short-description>
# or: git checkout -b fix/<short-description>

# 3. Make your changes, then verify locally
npm run typecheck
npm run lint

# 4. Commit using conventional commits
git add .
git commit -m "feat(invoices): add QR upload validation"

# 5. Push and open a Pull Request into main
git push origin feature/<short-description>
```

**Commit convention:** `feat | fix | docs | style | refactor | test | chore` → `type(scope): message`

### Checklist

| Step              | Requirement                                       |
| ----------------- | ------------------------------------------------- |
| ✅ Branch naming  | `feature/*`, `fix/*`, `chore/*`                   |
| ✅ Before PR      | `npm run typecheck` and `npm run lint` pass       |
| ✅ PR description | What changed, why, and screenshots for UI changes |
| ✅ Review         | At least 1 approval before merge                  |
| ✅ Merge strategy | Squash & merge into `main`                        |

---

<div align="center">

**Made with ❤️ by Rahul Goswami**

<sub>Proprietary software · All rights reserved</sub>

</div>