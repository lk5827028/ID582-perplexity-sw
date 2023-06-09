import { getByText, render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { NavBar } from '.'
import { store } from '../../app/store'
import { getLoggedInUserData, getNavBarItems } from '../../spec/fixtures'
import * as user from '../../hooks/user'
import * as router from 'react-router'

let useParams: jest.SpyInstance
let useUser: jest.SpyInstance

const navItems = getNavBarItems()
const loggedInUser = getLoggedInUserData()

describe('NavBar', () => {
  beforeEach(() => {
    useUser = jest.spyOn(user, 'useUser').mockImplementation(() => loggedInUser)
  })

  afterEach(() => {
    expect(useParams).toBeCalled()
    expect(useUser).toBeCalled()
  })

  it('renders user data and navigation items', () => {
    useParams = jest.spyOn(router, 'useParams').mockImplementation(() => ({ page: 'home' }))
    render(
      <BrowserRouter>
        <Provider store={store}>
          <NavBar navItems={navItems} />
        </Provider>
      </BrowserRouter>
    )
    expect(getByText(document.body, loggedInUser.user?.username ?? '')).toBeInTheDocument()
    navItems.forEach((item) => {
      expect(getByText(document.body, item.display)).toBeInTheDocument()
      expect(document.querySelector(`svg[data-icon='${item.icon.iconName}']`)).toBeInTheDocument()
    })
  })

  it('highlights active page', () => {
    navItems.forEach((item) => {
      useParams = jest.spyOn(router, 'useParams').mockImplementation(() => ({ page: item.page }))
      render(
        <BrowserRouter>
          <Provider store={store}>
            <NavBar navItems={navItems} />
          </Provider>
        </BrowserRouter>
      )
      expect(document.querySelector(`a[href='/dashboard/${item.page}'] > div.bg-sky-600`)).toBeInTheDocument()
    })
  })
})
