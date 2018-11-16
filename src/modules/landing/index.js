const Home = () => import(/* webpackChunkName: 'landing' */ './home');

const routes = [{ path: '/', component: Home }];

export default routes;
