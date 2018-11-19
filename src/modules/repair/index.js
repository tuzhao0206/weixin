const Home = () => import(/* webpackChunkName: 'repair' */ './home');
const EditEquipment = () => import(/* webpackChunkName: 'repair' */ './editEquipment');
const AddEquipment = () => import(/* webpackChunkName: 'repair' */ './addEquipment');

const routes = [
  { path: '', redirect: 'repair' },
  { path: 'repair', component: Home },
  { path: 'repair/choose', component: EditEquipment },
  { path: 'repair/addEquipment', component: AddEquipment },
];

export default routes;
