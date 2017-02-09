import { Platform, Linking } from 'react-native'

const isString = (str) => Object.prototype.toString.call(str) === '[object String]'
const isBool = (bool) => Object.prototype.toString.call(bool) === '[object Boolean]'

const launchLink = (url) => {
  Linking.canOpenURL(url).then(canOpen => {
    if (!canOpen) {
      console.error(`The URL is invalid: ${url}`)
      return false
    } else {
      Linking.openURL(url)
        .catch((err) => {
          console.error('openURL error', err)
          return false
        })
    }
  }).catch((err) => {
    console.error('The URL could not be opened', err)
    return false
  })

  return true
}

const call = (args = { prompt: true }) => {
  if (!args.number) { return console.error('Please provide a number to call') }
  if (!isString(args.number) || !isBool(args.prompt)) { return console.error('The provided arguments are not valid types') }

  const url = `${Platform.OS === 'ios' && args.prompt ? 'telprompt:' : 'tel:'}${args.number}`

  return launchLink(url)
}

export default call