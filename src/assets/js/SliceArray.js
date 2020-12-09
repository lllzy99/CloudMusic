// 按长度size截取数组
class SliceArray{
  constructor() {}

  sliceArr(array,size) {
    let result = [];
    for(let i=0; i<Math.ceil(array.length/size); i++){
      let start = i*size;
      let end = start + size;
      result.push(array.slice(start,end));
    }
    return result;
  }
}

export const sliceArray = new SliceArray(); 