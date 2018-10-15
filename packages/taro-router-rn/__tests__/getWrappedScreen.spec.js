import React from 'react'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import mockConsole from 'jest-mock-console'
import getWrappedScreen from '../src/getWrappedScreen'

class HomeScreen extends React.Component {
  static config = {
    navigationBarTitleText: '首页',
    navigationBarBackgroundColor: 'white',
    navigationBarTextStyle: 'black',
    enablePullDownRefresh: true
  }

  onPullDownRefresh () {}

  onReachBottom () {}

  onScroll () {}

  render () {
    return null
  }
}

const globalNavigationOptions = {
  backgroundColor: 'grey',
  enablePullDownRefresh: true,
  headerTintColor: 'blue',
  navigationStyle: 'custom',
  title: 'WeChat'
}

function getShallowWrapper () {
  let Taro = {}
  const WrappedScreen = getWrappedScreen(HomeScreen, Taro, globalNavigationOptions)
  return shallow(<WrappedScreen />)
}

describe('getWrappedScreen ', function () {
  let Taro = {}
  describe('render', function () {
    it('should render success without globalNavigationOptions', function () {
      const WrappedScreen = getWrappedScreen(HomeScreen, Taro)
      const wrapper = shallow(<WrappedScreen />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })

    it('should render success with globalNavigationOptions', function () {
      const wrapper = getShallowWrapper()
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })

  describe('globalNavigationOptions', function () {

  })

  describe('props pass correct', function () {
    it('should pass Taro throw props', function () {
      const wrapper = getShallowWrapper()
      const expected = ['Taro', 'enablePullDownRefresh', 'onPullDownRefresh', 'onReachBottom', 'onScroll']
      expect(Object.keys(wrapper.props())).toEqual(expect.arrayContaining(expected))
    })
  })

  describe('Taro Navigation API', function () {
    it('should API be mount in Taro', function () {
      let Taro = {}
      const expected = ['setNavigationBarTitle', 'setNavigationBarColor', 'showNavigationBarLoading', 'hideNavigationBarLoading']
      const WrappedScreen = getWrappedScreen(HomeScreen, Taro, globalNavigationOptions)
      shallow(<WrappedScreen />)
      expect(Object.keys(Taro)).toEqual(expected)
    })

    it('setNavigationBarTitle should console warn', function () {
      let Taro = {}
      console.warn = jest.fn()
      const WrappedScreen = getWrappedScreen(HomeScreen, Taro, globalNavigationOptions)
      shallow(<WrappedScreen />)
      Taro.setNavigationBarTitle()
      expect(console.warn.mock.calls[0][0]).toBe('Taro.setNavigationBarTitle 参数必须为 object')
      console.warn.mockRestore()
    })

    describe('Taro Navigation API be call', function () {
      let Taro = {}
      const mockCallback = jest.fn()
      const WrappedScreen = getWrappedScreen(HomeScreen, Taro, globalNavigationOptions)
      const wrapper = shallow(<WrappedScreen />)
      wrapper.setProps({navigation: {setParams: mockCallback}})

      afterEach(() => {
        mockCallback.mockClear()
      })

      it('should call setNavigationBarTitle', function () {
        Taro.setNavigationBarTitle({})
        expect(mockCallback.mock.calls.length).toBe(1)
      })

      it('should call setNavigationBarColor', function () {
        Taro.setNavigationBarColor({})
        expect(mockCallback.mock.calls.length).toBe(1)
      })

      it('should call showNavigationBarLoading', function () {
        Taro.showNavigationBarLoading()
        expect(mockCallback.mock.calls.length).toBe(1)
      })

      it('should call hideNavigationBarLoading', function () {
        Taro.hideNavigationBarLoading({})
        expect(mockCallback.mock.calls.length).toBe(1)
      })
    })
  })

  describe('Taro lifecycle', function () {
    it('should call componentDidShow ', function () {
      const mockCallback = jest.fn()
      HomeScreen.componentDidShow = mockCallback
      const WrappedScreen = getWrappedScreen(HomeScreen, Taro, globalNavigationOptions)
      shallow(<WrappedScreen />)
      expect(mockCallback.mock.calls.length).toBe(1)
    })

    it('should call componentDidHide ', function () {
      const mockCallback = jest.fn()
      HomeScreen.componentDidHide = mockCallback
      const WrappedScreen = getWrappedScreen(HomeScreen, Taro, globalNavigationOptions)
      shallow(<WrappedScreen />)
      expect(mockCallback.mock.calls.length).toBe(1)
    })
  })

  describe('Taro screenRef', function () {
    it('should screenRef current ref to Screen', function (done) {
      const wrapper = getShallowWrapper()
      expect(wrapper.instance().screenRef.current).toBeInstanceOf(HomeScreen)
    })

    it('should call getWrappedInstance when Screen has this func', function (done) {
      const mockCallback = jest.fn()
      HomeScreen.getWrappedInstance = mockCallback
      const WrappedScreen = getWrappedScreen(HomeScreen, Taro, globalNavigationOptions)
      const wrapper = shallow(<WrappedScreen />)
      wrapper.instance().getWrappedInstance()
      expect(mockCallback.mock.calls.length).toBe(1)
    })
  })
})
