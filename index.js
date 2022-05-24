import { Platform, Linking } from 'react-native'

const isString = (str) => Object.prototype.toString.call(str) === '[object String]'
const isBool = (bool) => Object.prototype.toString.call(bool) === '[object Boolean]'

const createError = (msg = '') => Promise.reject(new Error(msg))

const openLink = (url, skipCanOpen = false) => {
  if (skipCanOpen) {
    return Linking.openURL(url)
  }

  return Linking.canOpenURL(url).then(canOpen => {
    if (!canOpen) {
      return createError(`invalid URL provided: ${url}`)
    } else {
      return Linking.openURL(url)
    }
  })
}

const call = (args = {}) => {
  const settings = Object.assign({
    skipCanOpen: false,
    prompt: true
  }, args)

  if (!settings.number) { return createError('no number provided') }
  if (!isString(settings.number)) { return createError('number should be string') }
  if (!isBool(settings.prompt)) { return createError('prompt should be boolean') }
  if (!isBool(settings.skipCanOpen)) { return createError('skipCanOpen should be boolean') }

  const url = `${Platform.OS === 'ios' && settings.prompt ? 'telprompt:' : 'tel:'}${settings.number}`

  return openLink(url, settings.skipCanOpen)
}

export default call
