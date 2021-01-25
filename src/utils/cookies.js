import jsCookie from 'js-cookie'
import { jgCookie,cookieDomain } from '@/constants/index'

export function logOut(){
    console.log(jgCookie,cookieDomain);
    jsCookie.remove(jgCookie, { domain: cookieDomain });
}