import NameAndLogo from "@/assets/name-and-logo.svg";
import { Button } from "@/components/button/Button";
import {
  Cog6ToothIcon,
  FolderIcon,
  HomeIcon,
  NewspaperIcon,
  PlayCircleIcon,
  PresentationChartBarIcon,
  SquaresPlusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

export const NavBar: React.FC<{}> = () => {
  return (
    <nav className="flex flex-col justify-between w-56 min-w-56 h-full min-h-screen px-4 py-6 border-r border-solid border-slate-200 bg-slate-50">
      <div className="flex flex-col gap-6">
        <Image src={NameAndLogo} alt="Demospace name and logo" width={191} height={27.17} />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <NavItem destination="/">
              <HomeIcon className="h-full" />
              <span className="text-sm">Home</span>
            </NavItem>
            <NavItem destination="/assets">
              <PresentationChartBarIcon className="h-full" />
              <span className="text-sm">Assets</span>
            </NavItem>
            <NavItem destination="/scripts">
              <NewspaperIcon className="h-full" />
              <span className="text-sm">Scripts</span>
            </NavItem>
            <NavItem destination="/knowledge">
              <FolderIcon className="h-full" />
              <span className="text-sm">Knowledge</span>
            </NavItem>
            <NavItem destination="/preview">
              <PlayCircleIcon className="h-full" />
              <span className="text-sm">Preview</span>
            </NavItem>
          </div>
          <div className="w-full border-b border-solid border-slate-200" />
          <div className="flex flex-col gap-1">
            <NavItem destination="/invite">
              <UserPlusIcon className="h-full" />
              <span className="text-sm">Invite Team</span>
            </NavItem>
            <NavItem destination="/integrations">
              <SquaresPlusIcon className="h-full" />
              <span className="text-sm">Integrations</span>
            </NavItem>
            <NavItem destination="/settings">
              <Cog6ToothIcon className="h-full" />
              <span className="text-sm">Settings</span>
            </NavItem>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <Button className="flex gap-2 h-9 items-center justify-center p-2">
          <SparklesIcon className="h-full" />
          Upgrade
        </Button>
      </div>
    </nav>
  );
};

export const NavItem: React.FC<{ destination: string; children: React.ReactNode }> = ({ destination, children }) => {
  return (
    <Link
      href={destination}
      className="flex items-center w-full h-8 max-h-8 px-2 py-1.5 gap-2 rounded text-slate-800 hover:bg-slate-200"
    >
      {children}
    </Link>
  );
};
