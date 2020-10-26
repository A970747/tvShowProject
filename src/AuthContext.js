import React, { Component } from 'react'

const AuthContext = React.createContext()

class AuthProvider extends Component {
  // Context state
  state = {
    user: null,
  }

  // Method to update state
  setUser = (user) => {
    this.setState((prevState) => ({ user }))
  }

  render() {
    const { children } = this.props
    const { user } = this.state
    const setUser = this.setUser

    return (
      <AuthContext.Provider
        value={{
          user,
          setUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }
}

export default AuthContext

export { AuthProvider }