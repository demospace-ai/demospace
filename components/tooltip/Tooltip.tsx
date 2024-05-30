"use client";

import type { Placement } from "@floating-ui/react";
import {
  FloatingArrow,
  FloatingPortal,
  arrow,
  autoUpdate,
  offset,
  safePolygon,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from "@floating-ui/react";
import * as React from "react";
import { HTMLAttributes, createContext, forwardRef, useContext } from "react";

interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useTooltip({
  initialOpen = false,
  placement = "top",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const arrowRef = React.useRef<SVGSVGElement | null>(null);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: 10 }),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const context = data.context;

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
    handleClose: safePolygon(),
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return React.useMemo(
    () => ({
      setOpen,
      ...interactions,
      ...data,
      ...context,
      arrowRef,
    }),
    [setOpen, interactions, data, context],
  );
}

type ContextType = ReturnType<typeof useTooltip> | undefined;

const TooltipContext = createContext<ContextType>(undefined);

export const useTooltipContext = () => {
  const context = useContext(TooltipContext);

  if (context === undefined) {
    throw new Error("Tooltip components must be wrapped in <Tooltip />");
  }

  return context;
};

export function Tooltip({
  children,
  content,
  ...options
}: {
  children: React.ReactElement;
  content: React.ReactNode;
} & TooltipOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const tooltip = useTooltip(options);
  return (
    <TooltipContext.Provider value={tooltip}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </TooltipContext.Provider>
  );
}

interface TooltipTriggerProps extends React.HTMLProps<React.ReactElement> {
  children: React.ReactElement;
}

const TooltipTrigger = forwardRef<React.ReactElement, TooltipTriggerProps>(function TooltipTrigger(
  { children, ...props },
  propRef,
) {
  const context = useTooltipContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  return React.cloneElement(
    children,
    context.getReferenceProps({
      ref,
      ...props,
      ...children.props,
      "data-state": context.open ? "open" : "closed",
    }),
  );
});

const TooltipContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ children, ...props }, propRef) => {
  const context = useTooltipContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!context.open) return null;

  return (
    <FloatingPortal>
      <div
        ref={ref}
        style={{
          ...context.floatingStyles,
        }}
        className="bg-slate-600 text-white py-1 px-2 rounded-lg"
        {...context.getFloatingProps(props)}
      >
        {children}
        <FloatingArrow className="fill-slate-600" ref={context.arrowRef} context={context} />
      </div>
    </FloatingPortal>
  );
});

TooltipContent.displayName = "TooltipContent";
