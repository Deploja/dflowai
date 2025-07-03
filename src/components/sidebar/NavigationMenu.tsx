import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, ChevronRight, FileText } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  menuItems,
  organisationSubItems,
  candidatesSubItems,
  cvSubItems,
} from "./menuConfig";

export function NavigationMenu() {
  const location = useLocation();
  const [isOrganisationOpen, setIsOrganisationOpen] = useState(
    location.pathname === "/organisation" ||
      location.pathname.startsWith("/organisation")
  );
  const [isCandidatesOpen, setIsCandidatesOpen] = useState(
    location.pathname === "/consultants" ||
      location.pathname === "/candidates-list"
  );
  const [isCVOpen, setIsCVOpen] = useState(
    location.pathname.startsWith("/cv/")
  );

  useEffect(() => {
    if (
      location.pathname === "/organisation" ||
      location.pathname.startsWith("/organisation")
    ) {
      setIsOrganisationOpen(true);
    }
    if (
      location.pathname === "/consultants" ||
      location.pathname === "/candidates-list"
    ) {
      setIsCandidatesOpen(true);
    }
    if (location.pathname.startsWith("/cv/")) {
      setIsCVOpen(true);
    }
  }, [location.pathname]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link to={item.url}>
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}

          {/* CV Collapsible Menu */}
          <SidebarMenuItem>
            <Collapsible open={isCVOpen} onOpenChange={setIsCVOpen}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={location.pathname.startsWith("/cv/")}
                >
                  <FileText className="h-4 w-4" />
                  <span>CV</span>
                  <ChevronRight
                    className={`h-4 w-4 ml-auto transition-transform ${
                      isCVOpen ? "rotate-90" : ""
                    }`}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {cvSubItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = location.pathname === subItem.url;
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={isSubActive}>
                          <Link to={subItem.url}>
                            <SubIcon className="h-4 w-4" />
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>

          {/* Candidates Collapsible Menu */}
          <SidebarMenuItem>
            <Collapsible
              open={isCandidatesOpen}
              onOpenChange={setIsCandidatesOpen}
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={
                    location.pathname === "/consultants" ||
                    location.pathname === "/candidates-list"
                  }
                >
                  <Users className="h-4 w-4" />
                  <span>Candidates</span>
                  <ChevronRight
                    className={`h-4 w-4 ml-auto transition-transform ${
                      isCandidatesOpen ? "rotate-90" : ""
                    }`}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {candidatesSubItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = location.pathname === subItem.url;
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={isSubActive}>
                          <Link to={subItem.url}>
                            <SubIcon className="h-4 w-4" />
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>

          {/* Organisation Collapsible Menu */}
          <SidebarMenuItem>
            <Collapsible
              open={isOrganisationOpen}
              onOpenChange={setIsOrganisationOpen}
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={location.pathname === "/organisation"}
                >
                  <Users className="h-4 w-4" />
                  <span>Organisation</span>
                  <ChevronRight
                    className={`h-4 w-4 ml-auto transition-transform ${
                      isOrganisationOpen ? "rotate-90" : ""
                    }`}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {organisationSubItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive =
                      location.pathname === "/organisation" &&
                      (location.search.includes(
                        `tab=${subItem.title.toLowerCase()}`
                      ) ||
                        (subItem.title === "Employees" && !location.search));
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={isSubActive}>
                          <Link to={subItem.url}>
                            <SubIcon className="h-4 w-4" />
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
          <SidebarTrigger />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
