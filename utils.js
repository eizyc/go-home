const mean = arr => {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total / arr.length;
};

const median = arr => {
  const { length } = arr;
  arr.sort((a, b) => Number(a) - Number(b));
  
  if (length % 2 === 0) {
    return (arr[length / 2 - 1] + arr[length / 2]) / 2;
  }
  
  return arr[(length - 1) / 2];
};

const mode = arr => {
  const mode = {};
  let max = 0, count = 0;

  for(let i = 0; i < arr.length; i++) {
    const item = arr[i];
    
    if(mode[item]) {
      mode[item]++;
    } else {
      mode[item] = 1;
    }
    
    if(count < mode[item]) {
      max = item;
      count = mode[item];
    }
  }
   
  return max;
};

const range = arr => {
  arr.sort((a, b) => Number(a) - Number(b));
  
  return [arr[0], arr[arr.length - 1]];
};

module.exports = {
  mean,
  median,
  mode,
  range
}