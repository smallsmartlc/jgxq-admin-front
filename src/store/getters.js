const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  roleName: state => state.user.roleName,
  name: state => state.user.name
}
export default getters
