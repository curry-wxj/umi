import request from '@/utils/request';
// import axios from 'axios';

// export async function login() {
//   let a = null;
//   await axios.get('/proxy808/users').then(data=> {
//     a = data
//   });
//   return a;
// }
// export async function login() {
//   return request('/proxy808/home');
// }
export async function login(params) {
  return request('/api/login', {
    method: 'POST',
    body: params,
  });
}

export async function logout(params) {
  return request('/api/logout', {
    method: 'POST',
    body: params,
  });
}