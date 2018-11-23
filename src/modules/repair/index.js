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
  { path: 'repair', component: Home },
  { path: 'repair/editEquipment', component: EditEquipment },
  { path: 'repair/addEquipment', component: AddEquipment },
  { path: 'repair/addLocation', component: AddLocation },
  { path: 'repair/addExpress', component: AddExpress },
  { path: 'repair/ticketList', component: TicketList },
  { path: 'repair/ticketDetail/:ticketId', component: TicketDetail },
  { path: 'repair/equipmentFeedback/:ticketId', component: EquipmentFeedback },
];

export default routes;
