import { UserButton, useAuth } from "@clerk/react";
import { LogInIcon, ServerIcon, SmartphoneIcon } from "lucide-react";

import { hasCloudPublicConfig } from "../../cloud/publicConfig";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { MobileClientsUserProfilePage } from "./MobileClientsUserProfilePage";
import { PKFactoryConnectUserProfilePage } from "./PKFactoryConnectUserProfilePage";
import { usePKFactoryConnectAuthPrompt } from "./usePKFactoryConnectAuthPrompt";

export function PKFactoryConnectSidebarSignIn() {
  if (!hasCloudPublicConfig()) return null;

  return <ConfiguredPKFactoryConnectSidebarSignIn />;
}

export function PKFactoryConnectSidebarAvatar() {
  if (!hasCloudPublicConfig()) return null;

  return <ConfiguredPKFactoryConnectSidebarAvatar />;
}

function ConfiguredPKFactoryConnectSidebarAvatar() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || !isSignedIn) return null;

  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "size-7",
          userButtonTrigger: "rounded-lg p-1 hover:bg-sidebar-row-hover",
        },
      }}
    >
      <UserButton.UserProfilePage
        label="Mobile clients"
        labelIcon={<SmartphoneIcon className="size-4" />}
        url="mobile-clients"
      >
        <MobileClientsUserProfilePage />
      </UserButton.UserProfilePage>
      <UserButton.UserProfilePage
        label="PK Factory Connect"
        labelIcon={<ServerIcon className="size-4" />}
        url="pkfactory-connect"
      >
        <PKFactoryConnectUserProfilePage />
      </UserButton.UserProfilePage>
    </UserButton>
  );
}

function ConfiguredPKFactoryConnectSidebarSignIn() {
  const { isLoaded, isSignedIn } = useAuth();
  const { authPrompt, openAuthPrompt } = usePKFactoryConnectAuthPrompt();

  if (!isLoaded || isSignedIn) return null;

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={openAuthPrompt}>
            <LogInIcon />
            <span>Sign in to PK Factory Connect</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      {authPrompt}
    </>
  );
}
