class RandomArr{
  constructor(){};
  // 数组乱序算法
  // 遍历数组元素 将当前元素与随机抽取的一个剩余元素进行交换
  shuffle(arr){
    for (let i=arr.length-1; i>=0; i--) {
      let rIndex = Math.floor(Math.random()*(i+1));
      // 交换位置
      let temp = arr[rIndex];
      arr[rIndex] = arr[i];
      arr[i] = temp;
    }
    return arr;
  }
}

export const randomArray = new RandomArr(); 