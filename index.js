import { Platform, Linking } from 'react-native'

const isString = (str) => Object.prototype.toString.call(str) === '[object String]'
const isBool = (bool) => Object.prototype.toString.call(bool) === '[object Boolean]'

const openLink = (url, cb) => {
  return Linking.canOpenURL(url).then(canOpen => {
    if (!canOpen) {
      return Promise.reject(new Error(`The URL is invalid: ${url}`))
    } else {
      return Linking.openURL(url).catch((err) => Promise.reject(err))
    }
  })
}

const call = (args) => {
  const settings = Object.assign({
    prompt: true
  }, args)

  if (!settings.number) { return Promise.reject(new Error('Please provide a number to call')) }
  if (!isString(settings.number) || !isBool(settings.prompt)) { return Promise.reject(new Error('The provided arguments are not valid types')) }

  const url = `${Platform.OS === 'ios' && settings.prompt ? 'telprompt:' : 'tel:'}${settings.number}`

  return openLink(url)
}

export default call
