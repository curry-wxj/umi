import RenderAuthorized from '@/component/Authorized';
import { getLocalStorage } from './localStorage';

let Authorized = RenderAuthorized(getLocalStorage()); // eslint-disable-line

const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getLocalStorage());  // 改变 CURRENT为  getAuthority() ---- admin
};

export { reloadAuthorized };
export default Authorized;
