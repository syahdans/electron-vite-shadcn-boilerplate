import { AppSidebar } from '@renderer/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@renderer/components/ui/breadcrumb'
import { Button } from '@renderer/components/ui/button'
import { Separator } from '@renderer/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@renderer/components/ui/sidebar'

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <Button variant="default" size="lg">
                Go to Settings
              </Button>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <Button variant="destructive" size="lg">
                Go to Employee
              </Button>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <Button variant="outline" size="lg">
                Go to Other
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
