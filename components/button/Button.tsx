"use client";

import { cn } from "@/utils/classnames";
import { Button as HeadlessButton } from "@headlessui/react";
import { useRouter } from "next/navigation";
import React, { InputHTMLAttributes, MouseEvent, MouseEventHandler, Ref, forwardRef } from "react";

interface ButtonProps extends InputHTMLAttributes<HTMLButtonElement> {
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  type?: "button" | "submit" | "reset";
  secondary?: boolean;
}

export const Button: React.FC<ButtonProps & { ref?: Ref<HTMLButtonElement> }> = forwardRef<
  HTMLButtonElement,
  ButtonProps
>((props, ref) => {
  const { onClick, type = "button", className, children, secondary, ...remaining } = props;

  const buttonStyle = cn(
    secondary
      ? "border border-solid border-slate-200 hover:bg-slate-100"
      : "bg-slate-900 hover:bg-slate-700 text-white",
    "flex items-center justify-center gap-[6px] py-2 px-5 cursor-pointer text-sm font-medium shadow-none rounded-md transition select-none",
    "data-[disabled]:text-slate-600 data-[disabled]:bg-slate-300 data-[disabled]:hover:bg-slate-300 data-[disabled]:cursor-not-allowed",
    props.className,
  );
  return (
    <HeadlessButton className={buttonStyle} type={type} ref={ref} onClick={props.onClick} {...remaining}>
      {props.children}
    </HeadlessButton>
  );
});

Button.displayName = "Button";

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
