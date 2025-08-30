import { Button } from '@renderer/components/ui/button'

function App(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <p className="bg-rose-200 p-2 m-2 rounded">
        Dolor cillum deserunt culpa in cillum enim culpa veniam.
      </p>
      <Button variant="default" size="lg">
        ShadCN Button
      </Button>
    </div>
  )
}

export default App
