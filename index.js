import { Platform, Linking } from 'react-native'

const isString = (str) => Object.prototype.toString.call(str) === '[object String]'
const isBool = (bool) => Object.prototype.toString.call(bool) === '[object Boolean]'

const createError = (msg = '') => Promise.reject(new Error(msg))

const openLink = (url, cb) => {
  return Linking.canOpenURL(url).then(canOpen => {
    if (!canOpen) {
      return createError(`invalid URL provided: ${url}`)
    } else {
      return Linking.openURL(url).catch((err) => Promise.reject(err))
    }
  })
}

const call = (args = {}) => {
  const settings = Object.assign({
    prompt: true
  }, args)

  if (!settings.number) { return createError('no number provided') }
  if (!isString(settings.number)) { return createError('number should be string') }
  if (!isBool(settings.prompt)) { return createError('prompt should be bool') }

  const url = `${Platform.OS === 'ios' && settings.prompt ? 'telprompt:' : 'tel:'}${settings.number}`

  return openLink(url)
}

export default call
