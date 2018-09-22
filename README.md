<div align="center">
  <img width="80%" src="media/banner.png" alt="react-native-phone">
</div>
<br>
<div align="center">
  <strong>Initiate a phone call in React Native</strong>
</div>
<br>
<div align="center">
    <a href="https://github.com/feross/standard">
      <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard" />
    </a>
    <a href="https://travis-ci.org/tiaanduplessis/react-native-phone-call">
      <img src="https://img.shields.io/travis/tiaanduplessis/react-native-phone-call/master.svg?style=flat-square" alt="Travis build" />
    </a>
    <a href="https://github.com/RichardLitt/standard-readme)">
      <img src="https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square" alt="Standard Readme" />
    </a>
    <a href="https://badge.fury.io/gh/tiaanduplessis%2Freact-native-phone-call">
      <img src="https://badge.fury.io/gh/tiaanduplessis%2Freact-native-phone-call.svg?style=flat-square" alt="GitHub version" />
   </a>
  <a href="https://greenkeeper.io/">
      <img src="https://badges.greenkeeper.io/tiaanduplessis/react-native-phone-call.svg" alt="Greenkeeper" />
   </a>
  </div>
</div>

<h2>Table of Contents</h2>
<details>
  <summary>Table of Contents</summary>
  <li><a href="#introduction">Introduction</a></li>
  <li><a href="#install">Install</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#limitations">Limitations</a></li>
  <li><a href="#contribute">Contribute</a></li>
  <li><a href="#license">License</a></li>
</details>


## Introduction

This is a small module that allows you to initiate a phone call in React Native. 

### **NOTE**

When running on the iOS simulator, you will get a `the URL is invalid` error. This will work on a actual device. **The iOS simulator does not support phone call feature**.

## Install

**Install with npm**

```sh
$ npm install --save react-native-phone-call
```

**Install with yarn**

```sh
$ yarn add react-native-phone-call
```

## Usage

To use the module, call the function with an object containing the number to call as a argument.

```js
import call from 'react-native-phone-call'

const args = {
  number: '9093900003', // String value with the number to call
  prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
}

call(args).catch(console.error)
```

Example with phone and extension.
Use commas to add time between pressing different digits. (ex. dial a number and wait to be connected and menu to start being read. Press a number for an extension. Even wait longer for another menus and press another number for another extension.)

```js
const args = {
  number: '9093900003,,,3,,,274', // Use commas to add time between digits.
  prompt: false
}

call(args).catch(console.error)
```

## Limitations

This module only provides a simple wrapper around the Linking API and is thus limited in the functionality it can provide. If you are looking for additional functionality, such as being able to initiate a phone call without user confirmation, please use other packages like [react-native-immediate-phone-call](https://github.com/wumke/react-native-immediate-phone-call).

## Contributing

All Contributions are welcome! Please open up an issue if you would like to help out. :smile:

## License

Licensed under the [MIT License](https://tiaan.mit-license.org/).

Icon made by <a href="http://www.flaticon.com/authors/madebyoliver" title="Madebyoliver">Madebyoliver</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>


