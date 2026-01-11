# React Native Mobile App Setup Guide

## ✅ Setup Complete!

Your React Native mobile app has been successfully set up in `apps/mobile`. Here's what has been configured:

### 📁 Project Structure

```
apps/mobile/
├── src/
│   ├── api/
│   │   ├── apiClient.js      ✅ API client with auth interceptors
│   │   ├── auth.js           ✅ Authentication API calls
│   │   ├── products.js       ✅ Products API calls
│   │   └── categories.js     ✅ Categories API calls
│   ├── context/
│   │   └── AuthContext.js    ✅ Authentication state management
│   ├── navigation/
│   │   └── AppNavigator.js   ✅ Navigation setup (Auth + Main app)
│   └── screens/
│       ├── auth/
│       │   ├── LoginScreen.js           ✅ Login screen
│       │   ├── RegisterScreen.js        ✅ Registration screen
│       │   └── OTPVerificationScreen.js ✅ OTP verification
│       ├── home/
│       │   └── HomeScreen.js            ✅ Home dashboard
│       ├── products/
│       │   ├── ProductListScreen.js     ✅ Product listing
│       │   └── ProductDetailScreen.js   ✅ Product details
│       └── categories/
│           └── CategoryScreen.js        ✅ Categories listing
├── App.tsx                   ✅ Root component
└── package.json              ✅ Dependencies configured
```

## 🚀 Next Steps

### 1. Install iOS Dependencies (macOS only)

```bash
cd apps/mobile/ios
pod install
cd ../..
```

### 2. Update API URL

**Important:** Update the API URL in `apps/mobile/src/api/apiClient.js` based on your testing environment:

- **iOS Simulator:** `http://localhost:5050` (already set)
- **Android Emulator:** `http://10.0.2.2:5050`
- **Physical Device:** `http://YOUR_COMPUTER_IP:5050`

To find your computer's IP:
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

### 3. Ensure Backend is Running

Make sure your backend server is running on port 5050:
```bash
nx run backend:dev
```

### 4. Run the Mobile App

#### Using Nx (Recommended):
```bash
# Start Metro bundler
nx run mobile:start

# In a new terminal, run iOS
nx run mobile:ios

# Or run Android
nx run mobile:android
```

#### Using npm directly:
```bash
cd apps/mobile

# Start Metro bundler
npm start

# In a new terminal (keep Metro running), run:
npm run ios      # For iOS
npm run android  # For Android
```

## 📱 Testing

### iOS Simulator
- Requires macOS and Xcode
- Run: `nx run mobile:ios`
- The simulator will launch automatically

### Android Emulator
- Requires Android Studio
- Start an emulator from Android Studio first
- Run: `nx run mobile:android`

### Physical Device

**iOS:**
1. Connect iPhone via USB
2. Trust computer on iPhone
3. Select device in Xcode
4. Run: `nx run mobile:ios`

**Android:**
1. Enable Developer Options and USB Debugging on device
2. Connect device via USB
3. Run: `nx run mobile:android`

## ⚙️ Configuration

### iOS Configuration
- ✅ Already configured in `ios/ZeptoMobile/Info.plist`
- `NSAllowsLocalNetworking` is set to `true` for localhost access

### Android Configuration
- ✅ Already configured in `AndroidManifest.xml`
- `usesCleartextTraffic` is set to `true` for HTTP connections

## 🔐 Authentication Flow

1. **Login:** Users can login with email and password
2. **Register:** New users register → receive OTP → verify → account created
3. **OTP Login:** Alternative login flow using phone number + OTP

The app automatically:
- Stores JWT tokens in AsyncStorage
- Adds auth tokens to all API requests
- Redirects to login if token is invalid/expired
- Manages authentication state globally via AuthContext

## 📦 Installed Dependencies

- `@react-native-async-storage/async-storage` - Local storage
- `@react-navigation/native` - Navigation
- `@react-navigation/native-stack` - Stack navigation
- `@react-navigation/bottom-tabs` - Tab navigation
- `react-native-screens` - Native screens
- `axios` - HTTP client

## 🐛 Troubleshooting

### "Unable to resolve module"
```bash
cd apps/mobile
npm install
# For iOS
cd ios && pod install && cd ..
```

### "Network error" / Can't connect to backend
1. Check backend is running: `nx run backend:dev`
2. Update API URL in `src/api/apiClient.js` for your environment
3. For physical devices, ensure device and computer are on same network

### iOS Build Errors
```bash
cd apps/mobile/ios
pod install
cd ..
# Clean build
rm -rf ios/build
nx run mobile:ios
```

### Android Build Errors
```bash
cd apps/mobile/android
./gradlew clean
cd ..
nx run mobile:android
```

### Metro Bundler Port Already in Use
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
# Or use a different port
npm start -- --port 8082
```

## 📝 Notes

- The app uses JWT authentication tokens stored in AsyncStorage
- All API requests automatically include the auth token via interceptors
- Navigation automatically switches between Auth and Main app based on login status
- Product and Category APIs are already integrated and ready to use

## 🎯 Next Development Steps

1. **Styling:** Improve UI/UX with custom styles
2. **Cart Functionality:** Add shopping cart features
3. **Image Handling:** Implement image caching and optimization
4. **Error Handling:** Add better error messages and retry logic
5. **Loading States:** Enhance loading indicators
6. **Search:** Implement product search functionality
7. **Filters:** Add category and price filters
8. **Profile:** Add user profile editing

## 📚 Additional Resources

- [React Native Docs](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
