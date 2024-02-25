export default function MedicineItem({
  name,
  time,
  freq,
  period,
}: {
  name: string;
  time: string;
  freq: string;
  period: string;
}) {
  return (
    <div>
      <h1>MedicineItem</h1>
      <div>{name}</div>
      <div>時間 {time}</div>
      <div>頻度 {freq}</div>
      <div>期間 {period}</div>
    </div>
  )
}