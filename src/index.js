const fs = require("fs");

const sumColumn = (arys) => {
  const keys = Object.keys(arys);
  const result = Array(arys[keys[0]].length).fill(0);

  for (const key of keys) {
    const ary = arys[key];
    for (let i = 0; i < ary.length; i++) {
      result[i] += ary[i];
    }
  }
  return result;
};

const input = fs.readFileSync("./data/input.json", "utf8");
const tagList = JSON.parse(fs.readFileSync("./data/tagList.json", "utf8"));

const ary = JSON.parse(input);

// tagは連番前提 (1-index)
const tagMax = tagList.length;

// データの整形
const normalize = {};
for (let i = 0; i < ary.length; i++) {
  const data = new Array(tagMax).fill(0);
  const a = ary[i][1];
  for (let j = 0; j < a.length; j++) {
    const val = a[j];
    if (val == 99) {
      // 99は0で処理する
      data[0] = 1;
    } else {
      data[val] = 1;
    }
  }
  normalize[ary[i][0]] = data;
}

// 合計・平均値
const sumArray = sumColumn(normalize);
const meanArray = sumArray.map((v) => v / ary.length);

// 分散を計算
const varianceArray = Array(tagMax).fill(0);
for (let i = 0; i < ary.length; i++) {
  for (let j = 0; j < tagMax; j++) {
    varianceArray[j] += (normalize[ary[i][0]][j] - meanArray[j]) ** 2;
  }
}

console.log(sumArray);
console.log(varianceArray);

//標準偏差
const standardDeviationArray = varianceArray.map((v) =>
  Math.sqrt(v / ary.length)
);
console.log(standardDeviationArray);
