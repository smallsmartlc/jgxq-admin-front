import { imgUrl } from '@/constants/index'

export function isEmpty(str){
    if(typeof str == "undefined" || str == null || str == ""){
        return true;
    }else{
        return false;
    }
}
export function url2img(str){
    if(str){return imgUrl + str;}
    else{
        var defaultimg = require('@/assets/default_image.png')
        return defaultimg; 
    } 
}
export function editor2Text(str){
    return str.replace(/<[^>]+>|&[^>]+;/g,"").replace(/<img.*?(?:>|\/>)/gi,"[图片]").trim();
}