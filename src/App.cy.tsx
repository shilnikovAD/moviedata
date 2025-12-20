import { mount } from '@cypress/react'
import App from './App'

describe('<App />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(<App />)
  })
})