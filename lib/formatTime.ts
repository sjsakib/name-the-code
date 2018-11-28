export default function(t: number) {
  return [Math.floor(t / 60), t % 60]
    .map(x => ('0' + x).slice(-2))
    .join(':');
}
