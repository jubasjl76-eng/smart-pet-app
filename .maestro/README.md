# Maestro E2E flows

Black-box UI flows for the app (hardening Phase 17). These drive a real build
on a simulator/emulator or a physical device — they are **not** part of the
jest unit run.

## Run locally

```bash
# once
curl -Ls https://get.maestro.mobile.dev | bash

# build + install a dev client, then:
npx expo run:ios          # or: npx expo run:android
maestro test .maestro/     # runs every flow in order
maestro test .maestro/10-tab-navigation.yaml   # one flow
```

`appId` in each flow is `com.marcofolgado76.smart-pet-app` — keep it in sync
with `app.json` (`ios.bundleIdentifier` / `android.package`).

## Flows

| File | Checks |
| --- | --- |
| `00-launch.yaml` | app boots to the Home tab; all four tabs present |
| `10-tab-navigation.yaml` | the bottom tabs switch screens |
| `20-settings-login-form.yaml` | Settings shows the sign-in form when logged out; the email field accepts input |

## CI (not wired yet)

Running these in CI needs an Android emulator (or macOS + iOS Simulator) plus a
build, which needs `EXPO_TOKEN` / EAS. Tracked in
`smart-pet-docs/OPERATOR-ACTIONS.md` (C3 / a Maestro Cloud token). The jest
suite (`npm test`) runs on every PR today via `.github/workflows/test.yml`.
