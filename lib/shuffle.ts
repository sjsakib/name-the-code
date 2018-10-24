// Shuffle using the Fisher–Yates algorithm, Destructive
export default function shuffle<T>(arr: Array<T>) {
  let n: number = arr.length;
  while (n) {
    let r: number = Math.floor(Math.random() * n--);
    [arr[r], arr[n]] = [arr[n], arr[r]];
  }
  return arr;
}
