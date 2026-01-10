# React Native Mobile App Setup Guide

## Prerequisites

### 1. Install Required Software

#### For macOS (you're on macOS):
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (v18 or higher recommended)
brew install node

# Install Watchman (for file watching)
brew install watchman

# Install CocoaPods (for iOS dependencies)
sudo gem install cocoapods

# Install Xcode from App Store (required for iOS development)
# After installation, open Xcode and accept license:
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch

# Install Android Studio from https://developer.android.com/studio
# After installation, configure Android SDK:
# - Open Android Studio
# - Go to Preferences > Appearance & Behavior > System Settings > Android SDK
# - Install Android SDK Platform 33 (or latest)
# - Install Android SDK Build-Tools
# - Install Android Emulator
```

#### Environment Variables Setup:
```bash
# Add to ~/.zshrc or ~/.bash_profile:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Reload shell:
source ~/.zshrc
```

### 2. Install React Native CLI
```bash
npm install -g react-native-cli
# OR use npx (recommended, no global install needed)
```

## Step-by-Step Setup

### Step 1: Create React Native Project

Navigate to your parent directory (outside zepto-backend):
```bash
cd ..
npx react-native@latest init ZeptoApp --version latest
cd ZeptoApp
```

**OR** use Expo (easier for beginners, but less native control):
```bash
npx create-expo-app ZeptoApp
cd ZeptoApp
```

### Step 2: Install Essential Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs

# Navigation dependencies
npm install react-native-screens react-native-safe-area-context

# For iOS only
cd ios && pod install && cd ..

# HTTP client for API calls
npm install axios

# Async storage for tokens/user data
npm install @react-native-async-storage/async-storage

# Form handling
npm install react-hook-form

# UI components (optional but recommended)
npm install react-native-vector-icons
# OR use a UI library:
npm install react-native-paper  # Material Design
# OR
npm install native-base  # Cross-platform components

# Environment variables
npm install react-native-config

# Image handling
npm install react-native-image-picker

# Date/time handling
npm install date-fns
```

### Step 3: Project Structure

Create this folder structure in your React Native app:
```
ZeptoApp/
├── src/
│   ├── api/
│   │   ├── apiClient.js          # Axios instance with interceptors
│   │   ├── auth.js                # Auth API calls
│   │   ├── products.js            # Product API calls
│   │   └── categories.js          # Category API calls
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Loading.js
│   │   │   └── Card.js
│   │   └── product/
│   │       └── ProductCard.js
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── OTPVerificationScreen.js
│   │   ├── home/
│   │   │   └── HomeScreen.js
│   │   ├── products/
│   │   │   ├── ProductListScreen.js
│   │   │   └── ProductDetailScreen.js
│   │   └── categories/
│   │       └── CategoryScreen.js
│   ├── navigation/
│   │   ├── AppNavigator.js        # Main navigation
│   │   └── AuthNavigator.js       # Auth flow navigation
│   ├── context/
│   │   ├── AuthContext.js         # Auth state management
│   │   └── AuthProvider.js
│   ├── utils/
│   │   ├── storage.js             # AsyncStorage helpers
│   │   └── constants.js            # App constants
│   └── hooks/
│       └── useAuth.js              # Custom auth hook
├── android/
├── ios/
├── App.js                          # Root component
└── package.json
```

### Step 4: Configure API Client

Create `src/api/apiClient.js`:
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this to your backend URL
// For iOS Simulator: http://localhost:5050
// For Android Emulator: http://10.0.2.2:5050
// For physical device: http://YOUR_COMPUTER_IP:5050
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5050'  // Development
  : 'https://your-production-api.com';  // Production

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      // Navigate to login (you'll need to handle this in your navigation)
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Step 5: iOS Configuration

#### Update Info.plist (for API calls):
Edit `ios/ZeptoApp/Info.plist`:
```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
  <!-- Or better, specify your domain -->
  <key>NSExceptionDomains</key>
  <dict>
    <key>localhost</key>
    <dict>
      <key>NSExceptionAllowsInsecureHTTPLoads</key>
      <true/>
    </dict>
  </dict>
</dict>
```

### Step 6: Android Configuration

#### Update AndroidManifest.xml:
Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<application
  ...
  android:usesCleartextTraffic="true">  <!-- For HTTP in dev -->
  ...
</application>
```

#### Update network_security_config.xml:
Create `android/app/src/main/res/xml/network_security_config.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>
```

Then reference it in AndroidManifest.xml:
```xml
<application
  android:networkSecurityConfig="@xml/network_security_config"
  ...>
```

### Step 7: Running the App

#### iOS:
```bash
# Start Metro bundler
npm start

# In another terminal, run iOS app
npm run ios
# OR
npx react-native run-ios

# For specific simulator:
npx react-native run-ios --simulator="iPhone 15 Pro"
```

#### Android:
```bash
# Start Android emulator first (from Android Studio)
# OR use command line:
emulator -avd Pixel_5_API_33

# Start Metro bundler
npm start

# In another terminal, run Android app
npm run android
# OR
npx react-native run-android
```

### Step 8: Development Tips

#### For Physical Device Testing:

**iOS:**
1. Connect iPhone via USB
2. Trust computer on iPhone
3. Open Xcode > Window > Devices and Simulators
4. Select your device
5. Run: `npx react-native run-ios --device`

**Android:**
1. Enable Developer Options on Android device
2. Enable USB Debugging
3. Connect via USB
4. Run: `npx react-native run-android`

**Network Configuration for Physical Devices:**
- Find your computer's IP: `ifconfig | grep "inet "`
- Update API_BASE_URL in apiClient.js to use your IP (e.g., `http://192.168.1.100:5050`)
- Ensure both devices are on same WiFi network

### Step 9: Debugging

#### React Native Debugger:
```bash
npm install -g react-native-debugger
```

#### Flipper (Built-in):
- Comes with React Native
- Access via: `npx react-native start` then press `j` for debugger

#### Console Logs:
```javascript
// Use console.log (visible in Metro bundler)
console.log('Debug info:', data);

// For production, use a logging library
```

### Step 10: Building for Production

#### iOS:
```bash
cd ios
pod install
cd ..

# Build for App Store
npx react-native run-ios --configuration Release

# Or use Xcode:
# 1. Open ios/ZeptoApp.xcworkspace in Xcode
# 2. Select "Any iOS Device" as target
# 3. Product > Archive
```

#### Android:
```bash
# Generate signed APK
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk

# For AAB (Google Play):
./gradlew bundleRelease
```

## Quick Start Checklist

- [ ] Install Node.js, Xcode, Android Studio
- [ ] Set up environment variables
- [ ] Create React Native project
- [ ] Install dependencies
- [ ] Set up project structure
- [ ] Configure API client
- [ ] Update iOS Info.plist
- [ ] Update Android manifest
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on physical devices

## Common Issues & Solutions

1. **Metro bundler port already in use:**
   ```bash
   lsof -ti:8081 | xargs kill -9
   ```

2. **iOS build fails:**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android build fails:**
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

4. **Network request fails:**
   - Check API URL (use IP for physical devices)
   - Verify backend is running
   - Check firewall settings

5. **"Unable to resolve module":**
   ```bash
   rm -rf node_modules
   npm install
   # For iOS:
   cd ios && pod install && cd ..
   ```

## Next Steps

1. Implement authentication flow
2. Create product listing screens
3. Add category navigation
4. Implement cart functionality
5. Add user profile
6. Set up push notifications
7. Add analytics
8. Implement error boundaries
9. Add loading states
10. Set up CI/CD

## Recommended Libraries

- **State Management:** Redux Toolkit or Zustand
- **Forms:** React Hook Form
- **UI:** React Native Paper or NativeBase
- **Icons:** React Native Vector Icons
- **Images:** React Native Fast Image
- **Animations:** React Native Reanimated
- **Maps:** React Native Maps
- **Notifications:** React Native Firebase
- **Analytics:** React Native Firebase Analytics




