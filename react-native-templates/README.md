# React Native Starter Templates

These are starter template files for your React Native mobile app. Follow these steps to use them:

## Quick Setup Steps

1. **Create your React Native project** (outside the backend folder):
   ```bash
   cd ..
   npx react-native@latest init ZeptoApp
   cd ZeptoApp
   ```

2. **Install dependencies**:
   ```bash
   npm install @react-native-async-storage/async-storage @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context axios
   ```

3. **For iOS, install pods**:
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Copy template files to your project**:
   - Copy `apiClient.js` → `src/api/apiClient.js`
   - Copy `authAPI.js` → `src/api/auth.js`
   - Copy `productsAPI.js` → `src/api/products.js`
   - Copy `categoriesAPI.js` → `src/api/categories.js`
   - Copy `AuthContext.js` → `src/context/AuthContext.js`
   - Copy `AppNavigator.js` → `src/navigation/AppNavigator.js`
   - Copy `LoginScreen.js` → `src/screens/auth/LoginScreen.js`
   - Copy `App.js.example` → `App.js` (replace existing)

5. **Create missing screen files** (you'll need to create these):
   - `src/screens/auth/RegisterScreen.js`
   - `src/screens/auth/OTPVerificationScreen.js`
   - `src/screens/home/HomeScreen.js`
   - `src/screens/products/ProductListScreen.js`
   - `src/screens/products/ProductDetailScreen.js`
   - `src/screens/categories/CategoryScreen.js`

6. **Update API URL in `apiClient.js`**:
   - For iOS Simulator: `http://localhost:5050`
   - For Android Emulator: `http://10.0.2.2:5050`
   - For physical device: `http://YOUR_COMPUTER_IP:5050`

7. **Configure iOS** (update `ios/ZeptoApp/Info.plist`):
   - Add network security config for HTTP (see main guide)

8. **Configure Android** (update `AndroidManifest.xml`):
   - Add `android:usesCleartextTraffic="true"` (see main guide)

9. **Run the app**:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## File Structure After Setup

```
ZeptoApp/
├── src/
│   ├── api/
│   │   ├── apiClient.js          ✅ From templates
│   │   ├── auth.js                ✅ From templates
│   │   ├── products.js            ✅ From templates
│   │   └── categories.js          ✅ From templates
│   ├── context/
│   │   └── AuthContext.js         ✅ From templates
│   ├── navigation/
│   │   └── AppNavigator.js        ✅ From templates
│   └── screens/
│       ├── auth/
│       │   ├── LoginScreen.js     ✅ From templates
│       │   ├── RegisterScreen.js  ⚠️  Create this
│       │   └── OTPVerificationScreen.js ⚠️  Create this
│       ├── home/
│       │   └── HomeScreen.js      ⚠️  Create this
│       ├── products/
│       │   ├── ProductListScreen.js ⚠️  Create this
│       │   └── ProductDetailScreen.js ⚠️  Create this
│       └── categories/
│           └── CategoryScreen.js  ⚠️  Create this
├── App.js                          ✅ From templates
└── package.json
```

## Important Notes

- **Update API URLs**: Make sure to update the `API_BASE_URL` in `apiClient.js` based on your testing environment
- **Backend must be running**: Your backend server should be running on port 5050
- **CORS**: Your backend already has CORS enabled, which is good for mobile apps
- **Authentication**: The templates use JWT tokens stored in AsyncStorage
- **Navigation**: Uses React Navigation v6 with stack and tab navigators

## Next Steps

1. Create the missing screen components
2. Style your screens to match your brand
3. Add error handling and loading states
4. Implement product listing and details
5. Add cart functionality
6. Test on both iOS and Android devices

## Troubleshooting

- **"Unable to resolve module"**: Run `npm install` and for iOS: `cd ios && pod install`
- **Network errors**: Check API URL and ensure backend is running
- **Build errors**: Clean build folders:
  - iOS: `cd ios && xcodebuild clean && cd ..`
  - Android: `cd android && ./gradlew clean && cd ..`




