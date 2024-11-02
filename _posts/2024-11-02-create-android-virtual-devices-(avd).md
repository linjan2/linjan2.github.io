---
title: Create Android Virtual Devices (AVD)
categories:
---

# Create Android Virtual Devices (AVD)

The AVD Manager CLI tool [`avdmanager`](https://developer.android.com/tools/avdmanager) is included in the Android SDK command-line tools package.

The SDK manager tool [`sdkmanager`](https://developer.android.com/tools/sdkmanager) installs and updates packages. First download the latest version of "Command line tools only" .zip file from [https://developer.android.com/studio#command-line-tools-only](https://developer.android.com/studio#command-line-tools-only). Then use `sdkmanager` to reinstall `cmdline-tools` as a package in an appropriate location.

```sh
mkdir -p /path/to/sdk/

unzip commandlinetools-linux-11076708_latest.zip
cmdline-tools/bin/sdkmanager --sdk_root=/path/to/sdk 'cmdline-tools;latest'

export "PATH=${PATH}:/path/to/sdk/cmdline-tools/latest/bin"

sdkmanager --list_installed
```

Use `avdmanager` to create virtual device. A system image and the emulator must be installed first.

```sh
sdkmanager --list | grep system-images
# install the emulator, a system image (with play store), an SDK platform, and the platform tools
sdkmanager emulator 'system-images;android-35;google_apis_playstore;x86_64' 'platforms;android-35' platform-tools

# list device definitions (e.g. pixel_8)
avdmanager list device --compact

avdmanager create avd --name pixel8_api35 --package 'system-images;android-35;google_apis_playstore;x86_64' --device pixel_8
avdmanager create avd --name desktop_medium_api35 --package 'system-images;android-35;google_apis_playstore;x86_64' --device desktop_medium

# list available Andoid virtual devices
avdmanager list avd

# edit device settings
vim ~/.android/avd/desktop_medium_api35.avd/config.ini
  # PlayStore.enabled = yes
```

Start the Android device with [`emulator`](https://developer.android.com/studio/run/emulator-commandline).

```sh
export ANDROID_SDK_ROOT=/path/to/sdk
export "PATH=${PATH}:${ANDROID_SDK_ROOT}/emulator"

# show help
emulator -help-all
emulator -help-environment # help on environment variables

# list all created AVDs
emulator -list-avds
  # desktop_medium_api35
  # pixel8_api35

# start the emulator (close its window to exit)
emulator -avd desktop_medium_api35

# 
emulator -avd desktop_medium_api35 -wipe-data
```

Rename a virtual device.

```sh
avdmanager move avd --name desktop_medium_api35 --rename desktop_medium_api35_old
```

Delete a virtual device.

```sh
avdmanager delete avd --name pixel8_api35
```
