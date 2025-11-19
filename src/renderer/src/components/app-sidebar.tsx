import * as React from 'react'
import { GalleryVerticalEnd } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@renderer/components/ui/sidebar'
import { Link, useRouterState } from '@tanstack/react-router'

const data = {
  navMain: [
    {
      title: 'HR',
      url: '#',
      items: [
        // {
        //   title: 'Employee',
        //   url: '/employee'
        //   // isActive: true
        // },
        {
          title: 'NFC',
          url: '/nfc'
        },
        {
          title: 'Pengaturan',
          url: '/settings'
        }
      ]
    }
    // {
    //   title: 'Documentation',
    //   url: '#',
    //   items: [
    //     {
    //       title: 'Instruction',
    //       url: '#'
    //       // isActive: true
    //     },
    //     {
    //       title: 'NFC devices',
    //       url: '#'
    //       // isActive: true
    //     }
    //   ]
    // }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">HR Talent</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((section) => (
              <SidebarMenuItem key={section.title}>
                <SidebarMenuButton asChild>
                  <Link to={section.url} className="font-medium">
                    {section.title}
                  </Link>
                </SidebarMenuButton>
                {section.items?.length ? (
                  <SidebarMenuSub>
                    {section.items.map((sub) => (
                      <SidebarMenuSubItem key={sub.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === sub.url || pathname.startsWith(sub.url + '/')}
                        >
                          <Link to={sub.url}>{sub.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
