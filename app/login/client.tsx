"use client";

import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
};

export const SubmitButton: React.FC<Props> = ({
  children,
  pendingText,
  ...props
}) => {
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (
    <button {...props} type="submit" aria-disabled={pending}>
      {isPending ? pendingText : children}
    </button>
  );
};
