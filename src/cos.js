const math = require("mathjs");
const fs = require("fs");

// cos類似度を計算する関数
const cos = (a, b) => {
  const aNorm = math.norm(a);
  const bNorm = math.norm(b);
  return math.dot(a, b) / (aNorm * bNorm);
};
const calcCosFromJson = (filepath) => {
  const input = fs.readFileSync(filepath, "utf8");
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
  // 類似度を計算
  const result = {};
  for (let i = 0; i < ary.length; i++) {
    const data = [];
    for (let j = 0; j < ary.length; j++) {
      if (i == j) continue;
      data.push(cos(normalize[ary[i][0]], normalize[ary[j][0]]));
    }
    result[ary[i][0]] = data;
  }

  // 平均値を計算
  const avg = {};
  for (let i = 0; i < ary.length; i++) {
    const data = result[ary[i][0]];
    const sum = data.reduce((a, b) => a + b);
    avg[ary[i][0]] = sum / data.length;
  }

  // 結果を出力
  console.log(`----${filepath}----`);
  console.log("----他ベクトルとの類似度----");
  for (const key of Object.keys(avg)) {
    const val = avg[key];
    console.log(`${key}: ${Math.round(val * 100, 2)}%`);
  }
};

// 実行
calcCosFromJson("./data/input.json");
calcCosFromJson("./data/input3.json");
