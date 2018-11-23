import { Nested } from '../../components';
const Home = () => import(/* webpackChunkName: 'repair' */ './home');
const EditEquipment = () => import(/* webpackChunkName: 'repair' */ './editEquipment');
const AddEquipment = () => import(/* webpackChunkName: 'repair' */ './addEquipment');
const AddLocation = () => import(/* webpackChunkName: 'repair' */ './addLocation');
const AddExpress = () => import(/* webpackChunkName: 'repair' */ './addExpress');
const TicketList = () => import(/* webpackChunkName: 'repair' */ './ticketList');
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
      { path: 'editEquipment', component: EditEquipment },
      { path: 'addEquipment', component: AddEquipment },
      { path: 'addLocation', component: AddLocation },
      { path: 'addExpress', component: AddExpress },
      { path: 'ticketList', component: TicketList },
      { path: 'ticketDetail/:ticketId', component: TicketDetail },
      { path: 'equipmentFeedback/:ticketId', component: EquipmentFeedback },
    ],
  },
];

export default routes;
