import userService from '../services/users'

const cookie = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))

const currentUser = {
  user: null
}

if (cookie) {
  userService.getUser(cookie.userId).then((userReceived) => {
    currentUser.user = userReceived
  })
}

export default currentUser
