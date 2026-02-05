#!/bin/bash
# Fix script for RNSPortfolioApp

echo "🚀 Starting project fix..."

# 1. Clean Node modules
echo "🧹 Cleaning node_modules..."
rm -rf node_modules
rm -rf package-lock.json
rm -rf yarn.lock

# 2. Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# 3. Fix iOS
echo "🍎 Fixing iOS..."
cd ios
rm -rf Pods
rm -rf Podfile.lock
rm -rf build
# Check if pod command exists
if command -v pod &> /dev/null; then
    echo "Installing Pods..."
    pod install --repo-update
else
    echo "⚠️ 'pod' command not found. Trying npx pod-install..."
    npx pod-install
fi
cd ..

# 4. Fix Android
echo "🤖 Fixing Android..."
cd android
# Check if gradlew exists and is executable
if [ -f "./gradlew" ]; then
    chmod +x ./gradlew
    ./gradlew clean
else
    echo "⚠️ ./gradlew not found in android directory."
fi
cd ..

echo "✅ Done! Please ensure you have the correct environment set up:"
echo "   - iOS: Xcode and CocoaPods installed"
echo "   - Android: Android Studio, SDK 36, and Java 17+ installed"
echo ""
echo "You can now run:"
echo "   npm run ios"
echo "   npm run android"
