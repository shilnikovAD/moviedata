/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof import('@cypress/react').mount;
    }
  }
}

import { mount } from '@cypress/react'

Cypress.Commands.add('mount', mount)

export {}
