# Contributor Installation Guide

Welcome to the **Signifiya '26** mobile app repository! Follow these steps to set up the development environment and start contributing.

## 📋 Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: (LTS version recommended, v18+)
- **npm** or **yarn**
- **Expo Go App**: Install it on your [physical device](https://expo.dev/go) for testing.
- **Git**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AbhishekS04/signifiyaAppFinal.git
cd signifiyaAppFinal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following variables. (Refer to the team leads for the secret values).

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=your_database_url
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

### 4. Initialize Prisma (Database)

If you are working with the database features:

```bash
npx prisma generate
```

---

## 🛠️ Development Workflow

### Start the Development Server

```bash
npx expo start
```

- Press **`a`** for Android Emulator.
- Press **`i`** for iOS Simulator.
- Scan the **QR Code** with your Expo Go app to run on a physical device.

### Project Structure

- `/src/components`: UI components and sections.
- `/src/screens`: Main page layouts (Gallery, Events, Home, etc.).
- `/src/data`: Static data and configuration (EventsData, GalleryData).
- `/src/context`: React Context providers for Auth and Music.

---

## 📦 Building the App

We use **EAS (Expo Application Services)** for builds.

### To build a production-ready APK

```bash
eas build -p android --profile optimized-apk
```

### To build for local development testing

```bash
eas build -p android --profile development
```

---

## 🤝 Contribution Rules

1. **Performance First**: Always use `FlatList` for long lists and `React.memo` for expensive components.
2. **Design Fidelity**: Maintain the "Neubrutalist" 3D design system.
3. **Commit Messages**: Use clear, descriptive commit messages (e.g., `feat: added new gallery filter`).

Happy coding! 🚀
