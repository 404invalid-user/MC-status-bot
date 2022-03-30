module.exports = {
  bright(t) {
    return '\x1b[1m' + t + '\x1b[0m'
  },
  dim(t) {
    return '\x1b[2m' + t + '\x1b[0m'
  },
  u(t) {
    return '\x1b[4m' + t + '\x1b[0m'
  },
  blink(t) {
    return '\x1b[5m' + t + '\x1b[0m'
  },
  reverse(t) {
    return '\x1b[7m' + t + '\x1b[0m'
  },
  white(t) {
    return '\x1b[37m' + t + '\x1b[0m'
  },
  black(t) {
    return '\x1b[30m' + t + '\x1b[0m'
  },
  red(t) {
    return '\x1b[31m' + t + '\x1b[0m'
  },
  green(t) {
    return '\x1b[32m' + t + '\x1b[0m'
  },
  blue(t) {
    return '\x1b[34m' + t + '\x1b[0m'
  },
  cyan(t) {
    return '\x1b[36m' + t + '\x1b[0m'
  },
  magenta(t) {
    return '\x1b[35m' + t + '\x1b[0m'
  },
  yellow(t) {
    return '\x1b[33m' + t + '\x1b[0m'
  },
  background: {
    white(t) {
      return '\x1b[47m' + t + '\x1b[0m'
    },
    black(t) {
      return '\x1b[40m' + t + '\x1b[0m'
    },
    red(t) {
      return '\x1b[41m' + t + '\x1b[0m'
    },
    green(t) {
      return '\x1b[42m' + t + '\x1b[0m'
    },
    blue(t) {
      return '\x1b[44m' + t + '\x1b[0m'
    },
    magenta(t) {
      return '\x1b[45m' + t + '\x1b[0m'
    },
    yellow(t) {
      return '\x1b[43m' + t + '\x1b[0m'
    },
    cyan(t) {
      return '\x1b[46m' + t + '\x1b[0m'
    }
  }
}
