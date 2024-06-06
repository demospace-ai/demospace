"use client";

import { cn } from "@/utils/classnames";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React, { InputHTMLAttributes, MouseEvent, MouseEventHandler, Ref, forwardRef } from "react";

interface ButtonProps extends InputHTMLAttributes<HTMLButtonElement> {
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps & { ref?: Ref<HTMLButtonElement> }> = forwardRef<
  HTMLButtonElement,
  ButtonProps
>((props, ref) => {
  const { onClick, type = "button", className, children, ...remaining } = props;

  const buttonStyle = cn(
    "text-white bg-slate-900 hover:bg-slate-700",
    "py-1 px-4 cursor-pointer font-medium shadow-none rounded-md tracking-[1px] transition select-none",
    props.disabled && "text-slate-600 bg-slate-300 hover:bg-slate-300 cursor-not-allowed",
    props.className,
  );
  return (
    <button className={buttonStyle} type={type} ref={ref} onClick={props.onClick} {...remaining}>
      {props.children}
    </button>
  );
});

Button.displayName = "Button";

type LinkButtonProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export const LinkButton: React.FC<LinkButtonProps> = forwardRef<HTMLAnchorElement, LinkButtonProps>((props, ref) => {
  const { href, className, children, ...remaining } = props;

  const buttonStyle = cn(
    "flex items-center justify-center text-white bg-slate-900 hover:bg-slate-700 tracking-[1px] py-1 px-4 cursor-pointer font-bold shadow-none rounded-md transition select-none",
    props.className,
  );
  return (
    <a className={buttonStyle} ref={ref} href={props.href} {...remaining}>
      {props.children}
    </a>
  );
});

LinkButton.displayName = "LinkButton";

type FormButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export const FormButton: React.FC<FormButtonProps> = (props) => {
  const buttonStyle = cn(
    "text-white bg-slate-900 hover:bg-slate-700 py-1 px-4 cursor-pointer font-bold shadow-none rounded-md tracking-[1px] transition select-none",
    props.className,
  );
  return (
    <button className={buttonStyle} type="submit">
      {props.children}
    </button>
  );
};

export const BackButton: React.FC<InputHTMLAttributes<HTMLDivElement>> = (props) => {
  const router = useRouter();

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (props.onClick) {
      props.onClick(e);
    } else {
      router.back();
    }
  };

  return (
    <div
      className={cn("cursor-pointer select-none text-sm font-[500] hover:text-slate-600 w-fit", props.className)}
      onClick={onClick}
    >
      {String.fromCharCode(8592)} Back
    </div>
  );
};

type IconButtonProps = {
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
};
export const IconButton: React.FC<IconButtonProps> = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const { onClick, className, children, ...remaining } = props;
  const buttonStyle = cn(
    "font-semibold flex ",
    "py-1 px-4 cursor-pointer font-bold shadow-none rounded-md tracking-[1px] transition select-none",
    !props.disabled && "hover:bg-slate-100",
    props.disabled && "text-slate-400 cursor-not-allowed",
    props.className,
  );
  return (
    <button
      className={buttonStyle}
      type="button"
      ref={ref}
      disabled={props.disabled}
      onClick={props.onClick}
      {...remaining}
    >
      {props.icon}
      {props.children}
    </button>
  );
});

IconButton.displayName = "IconButton";

export const DeleteButton = (props: Omit<IconButtonProps, "icon">) => (
  <IconButton {...props} icon={<TrashIcon className="w-5 h-5" />} />
);
