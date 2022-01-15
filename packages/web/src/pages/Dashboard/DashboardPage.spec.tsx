import { getByText, render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../app/store'
import * as router from 'react-router'
import * as user from '../../hooks/user'
import * as news from '../../hooks/news'
import DashboardPage from './DashboardPage'
import { BrowserRouter } from 'react-router-dom'
import { getUseNewsData } from '../../spec/fixtures'

let useParams: jest.SpyInstance
let useUser: jest.SpyInstance
let useNews: jest.SpyInstance

describe('Dashboard page', () => {
  beforeEach(() => {
    useUser = jest.spyOn(user, 'useUser').mockImplementation(() => (
      {
        loading: false,
        user: {
          id: 0,
          username: 'TestUser',
          password: 'TestPassword',
          email: 'Test@Test.com'
        }
      }
    ))
  })

  describe('Home page', () => {
    beforeEach(() => {
      useParams = jest.spyOn(router, 'useParams').mockImplementation(() => ({ page: 'home' }))
    })
    it('renders home page', () => {
      useNews = jest.spyOn(news, 'useNews').mockImplementation(() => getUseNewsData())
      render(
        <BrowserRouter>
          <Provider store={store}>
            <DashboardPage />
          </Provider>
        </BrowserRouter>
      )
      expect(useParams).toBeCalled()
      expect(useUser).toBeCalled()
      expect(getByText(document.body, /5 minutes ago/i)).toBeInTheDocument()
      expect(getByText(document.body, /Hello and welcome to the website, this is just a test./i)).toBeInTheDocument()
    })

    it('should show spinner when loading', () => {

    })
  })
})
