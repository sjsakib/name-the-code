// Shuffle using the Fisher–Yates algorithm, Destructive
export default function shuffle(arr) {
  let n = arr.length;
  while (n) {
    let r = Math.floor(Math.random() * n--);
    [arr[r], arr[n]] = [arr[n], arr[r]];
  }
  return arr;
}
