import { Nested } from '../../components';
const Home = () => import(/* webpackChunkName: 'repair' */ './home');
const Issue = () => import(/* webpackChunkName: 'repair' */ './issue');
const Choose = () => import(/* webpackChunkName: 'repair' */ './choose');
const Station = () => import(/* webpackChunkName: 'repair' */ './station');
const Express = () => import(/* webpackChunkName: 'repair' */ './express');
const Address = () => import(/* webpackChunkName: 'repair' */ './address');
const Channel = () => import(/* webpackChunkName: 'repair' */ './channel');
const Confirm = () => import(/* webpackChunkName: 'repair' */ './confirm');
const Success = () => import(/* webpackChunkName: 'repair' */ './success');
const Failure = () => import(/* webpackChunkName: 'repair' */ './failure');
const Orders = () => import(/* webpackChunkName: 'repair' */ './orders');
const Details = () => import(/* webpackChunkName: 'repair' */ './details');
const EquipmentFeedback = () => import(/* webpackChunkName: 'repair' */ './equipmentFeedback');

const routes = [
  { path: '', redirect: 'repair' },
  {
    path: 'repair',
    component: Nested,
    meta: { loginRequired: true },
    children: [
      { path: '', component: Home },
      { path: 'issue', component: Issue },
      { path: 'choose', component: Choose },
      { path: 'station', component: Station },
      { path: 'express', component: Express },
      { path: 'address', component: Address },
      { path: 'channel', component: Channel },
      { path: 'confirm', component: Confirm },
      { path: 'success', component: Success },
      { path: 'failure', component: Failure },
      { path: 'orders', component: Orders },
      { path: 'details/:id', component: Details },

      { path: 'equipmentFeedback/:ticketId', component: EquipmentFeedback },
    ],
  },
];

export default routes;
