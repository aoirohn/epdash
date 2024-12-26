import { Jimp, type JimpInstance, JimpMime } from "jimp";

type Color = { r: number; g: number; b: number };

const hexToRgb = (hex: string): Color => {
  const bigint = Number.parseInt(hex.replace("#", ""), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

// 最も近い色をパレットから探す
const findClosestColor = (color: Color, palette: Color[]): Color => {
  let closestColor = palette[0];
  let minDistance = Number.POSITIVE_INFINITY;

  for (const paletteColor of palette) {
    const distance =
      (color.r - paletteColor.r) ** 2 + (color.g - paletteColor.g) ** 2 + (color.b - paletteColor.b) ** 2;

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = paletteColor;
    }
  }

  return closestColor;
};

// Floyd-Steinberg法でディザリング
const floydSteinbergDithering = (image: any, palette: Color[]) => {
  const width = image.bitmap.width;
  const height = image.bitmap.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) * 4;

      // 現在のピクセルの色を取得
      const oldPixel = {
        r: image.bitmap.data[idx],
        g: image.bitmap.data[idx + 1],
        b: image.bitmap.data[idx + 2],
      };

      // 最も近い色をパレットから選択
      const newPixel = findClosestColor(oldPixel, palette);

      // エラーを計算
      const error = {
        r: oldPixel.r - newPixel.r,
        g: oldPixel.g - newPixel.g,
        b: oldPixel.b - newPixel.b,
      };

      // 現在のピクセルを更新
      image.bitmap.data[idx] = newPixel.r;
      image.bitmap.data[idx + 1] = newPixel.g;
      image.bitmap.data[idx + 2] = newPixel.b;

      // エラーを周囲のピクセルに分配
      const distributeError = (dx: number, dy: number, factor: number) => {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = (width * ny + nx) * 4;
          image.bitmap.data[nIdx] = Math.min(255, Math.max(0, image.bitmap.data[nIdx] + Math.round(error.r * factor)));
          image.bitmap.data[nIdx + 1] = Math.min(
            255,
            Math.max(0, image.bitmap.data[nIdx + 1] + Math.round(error.g * factor)),
          );
          image.bitmap.data[nIdx + 2] = Math.min(
            255,
            Math.max(0, image.bitmap.data[nIdx + 2] + Math.round(error.b * factor)),
          );
        }
      };

      distributeError(1, 0, 7 / 16); // 右
      distributeError(-1, 1, 3 / 16); // 左下
      distributeError(0, 1, 5 / 16); // 下
      distributeError(1, 1, 1 / 16); // 右下
    }
  }
};

// バッファから読み取り、バッファとして返す処理
export const ditherImageBuffer = async (inputBuffer: Buffer, paletteHex: string[]) => {
  try {
    const image = await Jimp.read(inputBuffer);

    // 画像を縦横それぞれ半分に縮小
    image.resize({ w: image.bitmap.width / 2, h: image.bitmap.height / 2 });

    // パレットをRGBに変換
    const palette = paletteHex.map(hexToRgb);

    // ディザリング処理
    floydSteinbergDithering(image, palette);

    // バッファとして出力（JPEG形式）
    const outputBuffer = await image.getBuffer(JimpMime.png);
    return outputBuffer;
  } catch (err) {
    console.error("Error processing image:", err);
    throw err;
  }
};
