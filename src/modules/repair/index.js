const Home = () => import(/* webpackChunkName: 'repair' */ './home');
const EditEquipment = () => import(/* webpackChunkName: 'repair' */ './editEquipment');
const AddEquipment = () => import(/* webpackChunkName: 'repair' */ './addEquipment');
const AddLocation = () => import(/* webpackChunkName: 'repair' */ './addLocation');
const AddExpress = () => import(/* webpackChunkName: 'repair' */ './addExpress');

const routes = [
  { path: '', redirect: 'repair' },
  { path: 'repair', component: Home },
  { path: 'repair/editEquipment', component: EditEquipment },
  { path: 'repair/addEquipment', component: AddEquipment },
  { path: 'repair/addLocation', component: AddLocation },
  { path: 'repair/addExpress', component: AddExpress },
];

export default routes;
