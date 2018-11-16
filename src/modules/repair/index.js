const Home = () => import(/* webpackChunkName: 'repair' */ './home');
const Choose = () => import(/* webpackChunkName: 'repair' */ './choose');

const routes = [{ path: 'repair', component: Home }, { path: 'repair/choose', component: Choose }];

export default routes;
