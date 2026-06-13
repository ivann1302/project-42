'use strict'

import('./static-server.mjs').catch((error) => {
  console.error('[static-node] Failed to start through Passenger')
  console.error(error)
  process.exit(1)
})
