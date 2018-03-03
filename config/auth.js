module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Authentication Guards
  |--------------------------------------------------------------------------
  |
  | supported driver: "Najs.SessionGuard", "Najs.TokenGuard"
  | supported provider: "Najs.GenericUser"
  |
  */
  guards: {
    web: {
      driver: 'Najs.SessionGuard',
      provider: 'Najs.GenericUser',
      default: true
    }
  },

  maxLoginAttempts: 5
}
