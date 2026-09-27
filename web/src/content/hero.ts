export const heroExample = `import Funcio from 'funcio'

const parse = (text) =>
  Funcio._Either.try.sync(() => JSON.parse(text))

// Parse, then reach into the result: no null checks, no try/catch.
Funcio._pipe(
  '{"user":{"name":"Alice","email":null}}',
  parse,
  (either) => either.getOrElse({}),
  (json) => Funcio._Maybe.of(json.user),
  (user) => Funcio._Maybe.of(user.email),
  (email) => email.getOrElse('no email')
)`
