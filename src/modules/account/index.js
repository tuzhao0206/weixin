const Login = () => import(/* webpackChunkName: 'account' */ './login');
const Weixin = () => import(/* webpackChunkName: 'account' */ './weixin');

const routes = [{ path: 'login', component: Login }, { path: 'weixin', component: Weixin }];

export default routes;
