<div align="center">
  <img width="80%" src="media/banner.png" alt="">
</div>

# react-native-phone-call
[![package version](https://img.shields.io/npm/v/react-native-phone-call.svg?style=flat-square)](https://npmjs.org/package/react-native-phone-call)
[![package downloads](https://img.shields.io/npm/dm/react-native-phone-call.svg?style=flat-square)](https://npmjs.org/package/react-native-phone-call)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![package license](https://img.shields.io/npm/l/react-native-phone-call.svg?style=flat-square)](https://npmjs.org/package/react-native-phone-call)
[![make a pull request](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Initiate a phone call in React Native.

- [react-native-phone-call](#react-native-phone-call)
  - [Background](#background)
    - [Running on Android](#running-on-android)
    - [Running on iOS simulator](#running-on-ios-simulator)
    - [Running on Android SDK 30+](#running-on-android-sdk-30)
    - [Limitations](#limitations)
  - [Install](#install)
  - [Usage](#usage)
    - [Example with phone and extension.](#example-with-phone-and-extension)
  - [API](#api)
  - [Contributing](#contributing)
  - [License](#license)

## Background

This is a small wrapper that allows you to initiate a phone call in React Native. 

### Running on Android

### Running on iOS simulator

When running on the iOS simulator, you will get a `the URL is invalid` error. This will work on an actual device. **The iOS simulator does not have access to the dialer app.**.

### Running on Android SDK 30+

Android SDK 30 introduced changes around how apps can query and interact with other apps. This means `Linking.canOpenURL` returns false for all links unless a `<queries>` element is added to `AndroidManifest.xml`. Adding the following intent to `android/app/src/main/AndroidManifest.xml` should resolve the issue:

```groovy
<queries>
      <intent>
        <action android:name="android.intent.action.DIAL" />
      </intent>
</queries>
```

### Limitations

This module only provides a simple wrapper around the Linking API and is thus limited in the functionality it can provide. If you are looking for additional functionality, such as being able to initiate a phone call without user confirmation, please use other packages like [react-native-immediate-phone-call](https://github.com/wumke/react-native-immediate-phone-call).
## Install

Install the package locally within you project folder with your package manager:

With `npm`:
```sh
npm install react-native-phone-call
```

With `yarn`:
```sh
yarn add react-native-phone-call
```

## Usage

To use the module, call the function with an object containing the number to call as a argument.

```js
import call from 'react-native-phone-call'

const args = {
  number: '9093900003', // String value with the number to call
  prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call 
  skipCanOpen: true // Skip the canOpenURL check
}

call(args).catch(console.error)
```

### Example with phone and extension.

Use commas to add time between pressing different digits. (ex. dial a number and wait to be connected and menu to start being read. Press a number for an extension. Even wait longer for another menus and press another number for another extension.)

```js
const args = {
  number: '9093900003,,,3,,,274', // Use commas to add time between digits.
  prompt: false
}

call(args).catch(console.error)
```
## API

For all configuration options, please see the [API docs](https://paka.dev/npm/react-native-phone-call).

## Contributing

Got an idea for a new feature? Found a bug? Contributions are welcome! Please [open up an issue](https://github.com/tiaanduplessis/react-native-phone-call/issues) or [make a pull request](https://makeapullrequest.com/).

## License

[MIT © Tiaan du Plessis](./LICENSE)


