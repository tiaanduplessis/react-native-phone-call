import call from 'react-native-phone-call'

const result: Promise<void> = call({ number: '1234567890' })
call({ number: '1234567890', prompt: false })
call({ number: '1234567890', skipCanOpen: true })
call({ number: '1234567890', prompt: true, skipCanOpen: false })
result.then(() => {})

// @ts-expect-error A number is required.
call()
// @ts-expect-error An options object must include a number.
call({})
// @ts-expect-error Phone numbers must be strings.
call({ number: 1234567890 })
// @ts-expect-error Prompt must be a boolean.
call({ number: '1234567890', prompt: 'yes' })
// @ts-expect-error SkipCanOpen must be a boolean.
call({ number: '1234567890', skipCanOpen: 'yes' })
// @ts-expect-error The result does not contain a string.
const stringResult: Promise<string> = call({ number: '1234567890' })
