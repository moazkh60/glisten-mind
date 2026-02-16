# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Running the App

> **Important:** This app uses native modules (`react-native-health` and `react-native-health-connect`) which require a **Development Build**. It will not run in the standard Expo Go app.

### Prerequisites

- **iOS**: Mac with Xcode installed.
- **Android**: Android Studio installed.

### First Time Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate native code (prebuild):
   ```bash
   npx expo prebuild
   ```

### Running the App

- **iOS**:
  ```bash
  npx expo run:ios
  ```

- **Android**:
  ```bash
  npx expo run:android
  ```

### Why Prebuild?

HealthKit and Health Connect require native permissions and code that isn't included in the standard Expo Go client. The `prebuild` command generates the `ios` and `android` directories with this native code.
