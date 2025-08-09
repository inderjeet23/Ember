export default function ProgressBar({ value }: { value: number }){
  return (
    <div className="h-2 w-full bg-neutral-800 rounded-md">
      <div className="h-2 rounded-md bg-green-500" style={{ width: `${value}%` }} />
    </div>
  )
}
