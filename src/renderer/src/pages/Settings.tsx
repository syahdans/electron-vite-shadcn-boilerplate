import { Button } from '@renderer/components/ui/button'

export default function App() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl">
          <Button>One</Button>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">
          <Button>Two</Button>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">
          <Button>Three</Button>
        </div>
      </div>
      <div className="bg-indigo-300 min-h-[100vh] flex-1 rounded-xl md:min-h-min">Settings</div>
    </div>
  )
}
