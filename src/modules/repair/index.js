import { Nested } from '../../components';
const Home = () => import(/* webpackChunkName: 'repair' */ './home');
const Issue = () => import(/* webpackChunkName: 'repair' */ './issue');
const Choose = () => import(/* webpackChunkName: 'repair' */ './choose');
const Station = () => import(/* webpackChunkName: 'repair' */ './station');
const Express = () => import(/* webpackChunkName: 'repair' */ './express');
const Orders = () => import(/* webpackChunkName: 'repair' */ './orders');
const TicketDetail = () => import(/* webpackChunkName: 'repair' */ './ticketDetail');
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
      { path: 'orders', component: Orders },
      { path: 'ticketDetail/:ticketId', component: TicketDetail },
      { path: 'equipmentFeedback/:ticketId', component: EquipmentFeedback },
    ],
  },
];

export default routes;
