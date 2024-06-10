"use client";

import NextLink, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

export const Link: React.FC<LinkProps & { children?: React.ReactNode; className?: string }> = (props) => {
  const pathname = usePathname();
  const { children, ...other } = props;
  const active = pathname === other.href;
  return (
    <NextLink data-link-active={active} {...other}>
      {children}
    </NextLink>
  );
};
