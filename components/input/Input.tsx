"use client";

import { Loading } from "@/components/loading/Loading";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { cn } from "@/utils/classnames";
import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { Combobox, ComboboxOption, Label, Listbox, Radio, RadioGroup, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { InformationCircleIcon, MinusCircleIcon, PlusCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import React, {
  Fragment,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string | number; // Need explicit value prop to display label correctly
  label?: string;
  tooltip?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { id, disabled, className, label, tooltip, value, onBlur, onFocus, ...other } = props;
  const [focused, setFocused] = useState<boolean>(false);
  const classes = [
    "flex border border-solid border-slate-300 bg-white rounded-md py-[6px] px-3 w-full box-border focus-within:border-slate-400 outline-none items-center",
    !disabled && "hover:border-slate-400 cursor-text",
    disabled && "bg-slate-50 select-none cursor-not-allowed",
    className,
  ];

  const inputRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => inputRef.current, []);

  const onKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === "Escape") {
      event.currentTarget.blur();
    }
  };

  const showLabel = focused || inputRef.current?.value || props.value || props.placeholder;

  return (
    <div
      className={cn(...classes)}
      onClick={() => {
        inputRef.current?.focus();
      }}
    >
      {props.icon && props.icon}
      <div className={cn("relative flex flex-col w-full", label && "mt-4 pb-0.5")}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "absolute -top-1.5 text-base text-slate-600 cursor-[inherit] select-none inline-block transition-all duration-150",
              showLabel && "-top-4 text-xs",
            )}
          >
            {label}
          </label>
        )}
        <input
          id={id}
          name={id}
          ref={inputRef}
          autoComplete={id}
          className={cn(
            "w-full outline-none ring-none disabled:bg-slate-50 disabled:select-none cursor-[inherit] hide-number-wheel text-base",
            props.label && "mt-0.5",
          )}
          onKeyDown={onKeydown}
          onBlur={(e) => {
            setFocused(false);
            onBlur && onBlur(e);
          }}
          onFocus={(e) => {
            setFocused(true);
            onFocus && onFocus(e);
          }}
          onWheel={(e) => e.currentTarget.blur()}
          disabled={disabled}
          {...other}
        />
      </div>
      {tooltip && (
        <Tooltip content={tooltip}>
          <InformationCircleIcon className="w-5 mr-2" />
        </Tooltip>
      )}
    </div>
  );
});

Input.displayName = "Input";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  tooltip?: string;
}

export const TextArea: React.FC<TextAreaProps> = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const { id, value, disabled, className, label, tooltip, onBlur, onFocus, ...other } = props;
  const [focused, setFocused] = useState<boolean>(false);
  const classes = [
    "flex border border-solid border-slate-300 bg-white rounded-md py-2.5 px-3 w-full box-border focus-within:border-slate-400 outline-none",
    !disabled && "hover:border-slate-400 cursor-text",
    disabled && "bg-slate-50 select-none cursor-not-allowed",
    className,
  ];

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(ref, () => textAreaRef.current, []);

  const onKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    if (event.key === "Escape") {
      event.currentTarget.blur();
    }
  };

  const showLabel = focused || textAreaRef.current?.value || props.value;

  return (
    <div
      className={cn(...classes)}
      onClick={() => {
        textAreaRef.current?.focus();
      }}
    >
      <div className={cn("relative flex flex-col w-full", label && "pt-3")}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "absolute -top-1 text-base text-slate-600 cursor-[inherit] select-none inline-block transition-all duration-150",
              showLabel && "-top-1 text-xs",
            )}
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          name={id}
          ref={textAreaRef}
          autoComplete={id}
          className="w-full h-full min-h-full outline-none text-base mt-1 disabled:bg-slate-50 disabled:select-none cursor-[inherit]"
          onKeyDown={onKeydown}
          value={value ? value : ""}
          onBlur={(e) => {
            setFocused(false);
            onBlur && onBlur(e);
          }}
          onFocus={(e) => {
            setFocused(true);
            onFocus && onFocus(e);
          }}
          disabled={disabled}
          {...other}
        />
      </div>
      {tooltip && (
        <Tooltip content={tooltip}>
          <InformationCircleIcon className="w-5 mr-4" />
        </Tooltip>
      )}
    </div>
  );
});

TextArea.displayName = "TextArea";

export type DropdownInputProps = {
  options: any[] | undefined;
  value: any;
  onChange: (...event: any[]) => void;
  getElementForDisplay?: (option: any) => string | React.ReactElement;
  loading?: boolean;
  noOptionsString?: string;
  className?: string;
  label?: string;
  dropdownHeight?: string;
  nullable?: boolean;
  valid?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  closeOnSelect?: boolean;
  wrapperClass?: string;
  placeholder?: ReactNode;
};

// TODO: use ref
export const DropdownInput: React.FC<DropdownInputProps> = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating<HTMLDivElement>({
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(4),
      shift(),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });
  const click = useClick(context, {
    keyboardHandlers: false,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const getElementForDisplay = props.getElementForDisplay ? props.getElementForDisplay : (value: any) => value;
  const showLabel = props.label !== undefined && (open || props.value !== undefined);

  return (
    <Listbox
      multiple={props.multiple}
      value={props.value}
      disabled={props.disabled}
      onChange={(e) => {
        !props.multiple && setOpen(false);
        props.onChange(e);
      }}
    >
      <div className={cn("relative flex", props.wrapperClass)}>
        <Transition
          as={Fragment}
          show={showLabel}
          enter="transition ease duration-200 transform"
          enterFrom="translate-y-4 opacity-10"
          enterTo="translate-y-0"
          leave="transition ease duration-200 transform"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-4 opacity-10"
        >
          <label
            htmlFor="name"
            className="absolute top-5 left-2 -mt-px inline-block bg-white px-1 text-xs text-slate-600 whitespace-nowrap"
          >
            {props.label}
          </label>
        </Transition>
        <Listbox.Button
          ref={refs.setReference}
          {...getReferenceProps()}
          className={cn(
            "flex py-3.5 px-3 rounded-md bg-white text-left border border-solid border-slate-300 transition duration-100 cursor-pointer items-center",
            !props.disabled && "hover:border-gray-400",
            props.disabled && "bg-slate-100 cursor-not-allowed",
            props.className,
            props.valid === false && "border-red-600",
          )}
        >
          <div
            className={cn(
              "inline-block w-[calc(100%-20px)] truncate leading-5 text-base overflow-none",
              showLabel && "mt-3 -mb-1",
            )}
          >
            {getElementForDisplay(props.value)}
          </div>
          <span className="pointer-events-none pr-2">
            <ChevronUpDownIcon className="inline float-right h-5 w-5 text-slate-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <FloatingPortal>
          <div className="relative z-[99]" ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
            <Transition
              as={Fragment}
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-100"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Listbox.Options
                className={cn(
                  "absolute z-20 mt-1 max-h-60 min-w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-slate-900 ring-opacity-5 focus:outline-none sm:text-sm gap-1 flex flex-col",
                  props.dropdownHeight,
                )}
              >
                <DropdownOptions
                  loading={props.loading ? props.loading : false}
                  options={props.options}
                  noOptionsString={props.noOptionsString ? props.noOptionsString : "No options!"}
                  getElementForDisplay={getElementForDisplay}
                />
              </Listbox.Options>
            </Transition>
          </div>
        </FloatingPortal>
      </div>
    </Listbox>
  );
});

DropdownInput.displayName = "DropdownInput";

type DropdownOptionsProps = {
  loading: boolean;
  options: any[] | undefined;
  noOptionsString: string;
  getElementForDisplay: (value: any) => string | React.ReactElement;
};

const DropdownOptions: React.FC<DropdownOptionsProps> = (props) => {
  if (props.loading) {
    return (
      <div className="p-2">
        <Loading className="m-auto block" />
      </div>
    );
  }

  if (props.options && props.options.length > 0) {
    return (
      <>
        {props.options!.map((option: any, index: number) => (
          <Listbox.Option
            key={index}
            value={option}
            className={({ active, selected }) =>
              `relative cursor-pointer select-none py-2.5 pl-4 pr-4 text-base text-slate-900 
              ${active && "bg-slate-100"}
              ${selected && "bg-slate-200"}`
            }
          >
            {({ selected }) => (
              <>
                <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                  {props.getElementForDisplay(option)}
                </span>
                {selected ? (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-600">
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                ) : null}
              </>
            )}
          </Listbox.Option>
        ))}
      </>
    );
  } else {
    return <div className="p-2 pl-4 select-none">{props.noOptionsString}</div>;
  }
};

export type ComboInputProps = {
  options: any[] | undefined;
  value: any;
  onChange: (...event: any[]) => void;
  getElementForDisplay?: (option: any) => string | React.ReactElement;
  loading?: boolean;
  placeholder: string;
  noOptionsString?: string;
  className?: string;
  allowCustom?: boolean;
  label?: string;
  dropdownHeight?: string;
  nullable?: boolean;
  valid?: boolean;
  disabled?: boolean;
};

// TODO: use ref
export const ComboInput: React.FC<ComboInputProps> = forwardRef((props, ref) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { refs, floatingStyles, context } = useFloating<HTMLDivElement>({
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(4),
      shift(),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });
  const click = useClick(context, {
    keyboardHandlers: false,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const getFilteredOptions = () => {
    if (query === "") {
      return props.options;
    }

    if (props.options) {
      return props.options.filter((option) => {
        const displayValue = props.getElementForDisplay ? props.getElementForDisplay(option) : option;
        if (typeof displayValue === "string") {
          return displayValue.toLowerCase().includes(query.toLowerCase());
        } else {
          return true; // TODO: figure out how to do this for elements
        }
      });
    }

    return [];
  };
  const filteredOptions = getFilteredOptions();
  const getElementForDisplay = props.getElementForDisplay ? props.getElementForDisplay : (value: any) => value;
  const showLabel = props.label !== undefined && (open || props.value !== undefined);

  // An undefined value will cause the input to be uncontrolled, so change to null
  const value = props.value === undefined ? null : props.value;

  return (
    <Combobox
      value={value}
      disabled={props.disabled}
      onChange={(e) => {
        setOpen(false);
        props.onChange(e);
      }}
    >
      <div className="relative flex">
        <Transition
          show={showLabel}
          enter="transition ease duration-200 transform"
          enterFrom="translate-y-4 opacity-10"
          enterTo="translate-y-0"
          leave="transition ease duration-200 transform"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-4 opacity-10"
        >
          <label
            htmlFor="name"
            className="absolute top-5 left-2 -mt-px inline-block bg-white px-1 text-xs text-slate-600 whitespace-nowrap"
          >
            {props.label}
          </label>
        </Transition>
        <div
          ref={refs.setReference}
          {...getReferenceProps()}
          className={cn(
            "flex rounded-md bg-white text-left border border-solid border-slate-300 focus-within:!border-gray-700 transition duration-100 cursor-pointer",
            !props.disabled && "hover:border-gray-400",
            props.disabled && "bg-slate-100 cursor-not-allowed",
            props.className,
            props.valid === false && "border-red-600",
          )}
        >
          <div className="py-3.5 px-3 flex flex-1">
            <Combobox.Input
              className={cn(
                "inline bg-transparent w-[calc(100%-20px)] border-none text-base leading-5 text-slate-900 outline-none text-ellipsis cursor-pointer focus:cursor-text transition-all duration-10",
                showLabel && "mt-3 -mb-1",
                props.disabled && "bg-slate-100 text-slate-400 cursor-not-allowed",
              )}
              onClick={(e) => open && e.stopPropagation()}
              displayValue={(value) => (value ? getElementForDisplay(value) : "")}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={props.placeholder}
            />
            <Combobox.Button className="inline-block h-full" ref={buttonRef}>
              <span className="pointer-events-none pr-2">
                <ChevronUpDownIcon className="inline float-right h-5 w-5 text-slate-400" aria-hidden="true" />
              </span>
            </Combobox.Button>
          </div>
        </div>
        <div className="relative z-10" ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            afterLeave={() => {
              setQuery("");
            }}
          >
            <Combobox.Options
              static
              className={cn(
                "absolute z-20 mt-1 min-w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-slate-900 ring-opacity-5 focus:outline-none sm:text-sm",
                props.dropdownHeight,
              )}
            >
              <ComboOptions
                loading={props.loading ? props.loading : false}
                options={filteredOptions}
                noOptionsString={props.noOptionsString ? props.noOptionsString : "No options!"}
                getElementForDisplay={getElementForDisplay}
                query={query}
                allowCustom={props.allowCustom}
              />
            </Combobox.Options>
          </Transition>
        </div>
      </div>
    </Combobox>
  );
});

ComboInput.displayName = "ComboInput";

type ComboOptionsProps = {
  loading: boolean;
  options: any[] | undefined;
  noOptionsString: string;
  getElementForDisplay: (value: any) => string | React.ReactElement;
  query: string;
  allowCustom?: boolean;
};

const ComboOptions: React.FC<ComboOptionsProps> = (props) => {
  if (props.loading) {
    return (
      <div className="p-2">
        <Loading className="m-auto block" />
      </div>
    );
  }

  if (props.options && props.options.length > 0) {
    return (
      <>
        {props.allowCustom && props.query.length > 0 && (
          <ComboboxOption
            value={props.query}
            className={({ active, selected }) =>
              `relative cursor-pointer select-none py-2.5 pl-4 pr-4 text-base text-slate-900 
            ${active && "bg-slate-100"}
            ${selected && "bg-slate-200"}`
            }
          >
            Custom: &quot;{props.query}&quot;
          </ComboboxOption>
        )}
        {props.options!.map((option: any, index: number) => (
          <ComboboxOption
            key={index}
            value={option}
            className={({ active, selected }) =>
              `relative cursor-pointer select-none py-2.5 pl-4 pr-4 text-base text-slate-900 
            ${active && "bg-slate-100"}
            ${selected && "bg-slate-200"}`
            }
          >
            {({ selected }) => (
              <>
                <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                  {props.getElementForDisplay(option)}
                </span>
                {selected ? (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-600">
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                ) : null}
              </>
            )}
          </ComboboxOption>
        ))}
      </>
    );
  } else {
    return (
      <>
        {props.allowCustom ? (
          props.allowCustom &&
          props.query.length > 0 && (
            <ComboboxOption
              value={props.query}
              className={({ active, selected }) =>
                `relative cursor-pointer select-none py-2.5 pl-4 pr-4 ${
                  active || selected ? "bg-slate-100 text-slate-900" : "text-slate-900"
                }`
              }
            >
              Custom: &quot;{props.query}&quot;
            </ComboboxOption>
          )
        ) : (
          <div className="p-2 pl-4 select-none">{props.noOptionsString}</div>
        )}
      </>
    );
  }
};

export type RadioInputProps = {
  options: any[] | undefined;
  value: any;
  onChange: (...event: any[]) => void;
  getElementForDisplay?: (option: any) => string | React.ReactElement;
  getElementForDetail?: (option: any) => string | React.ReactElement;
  className?: string;
  valid?: boolean;
  disabled?: boolean;
  noBullet?: boolean;
  useCheckmark?: boolean;
};

export const RadioInput = forwardRef<HTMLDivElement, RadioInputProps>((props, ref) => {
  if (!props.options) {
    return <Loading />;
  }

  return (
    <RadioGroup value={props.value} onChange={props.onChange}>
      <Label className="sr-only">Server size</Label>
      <div className="space-y-2">
        {props.options.map((option) => (
          <Radio
            key={option}
            value={option}
            className={({ checked }) =>
              `${checked ? "bg-slate-100" : "bg-white"}
              relative flex cursor-pointer rounded-lg px-3 sm:px-5 py-4 border border-solid border-slate-200 outline-none`
            }
          >
            {({ checked }) => (
              <>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    {props.noBullet || (
                      <span
                        className={cn(
                          checked ? "bg-slate-600 border-transparent" : "bg-white border-gray-300",
                          "mt-0.5 mr-3 sm:mr-5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center",
                        )}
                        aria-hidden="true"
                      >
                        <span className="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                    )}
                    <div className="text-sm">
                      <RadioGroup.Label as="p" className="font-semibold text-gray-900">
                        {props.getElementForDisplay ? props.getElementForDisplay(option) : option}
                      </RadioGroup.Label>
                      {props.getElementForDetail && (
                        <RadioGroup.Description as="span" className="text-gray-900">
                          {props.getElementForDetail(option)}
                        </RadioGroup.Description>
                      )}
                    </div>
                  </div>
                  {checked && props.useCheckmark && (
                    <div className="text-black">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </>
            )}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
});

RadioInput.displayName = "RadioInput";

export const GuestNumberInput: React.FC<{
  value: number;
  setValue: (value: number) => void;
  maxGuests?: number;
  className?: string;
}> = ({ value, setValue, maxGuests = 99, className }) => {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: open,
    onOpenChange: setOpen,
    middleware: [offset(10), shift()],
    whileElementsMounted: autoUpdate,
    placement: "bottom-end",
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={cn(
          "flex border border-solid border-gray-300 rounded-lg items-center cursor-pointer px-4",
          className,
        )}
      >
        <UserIcon className="w-5 mr-1" />
        <span className="flex flex-grow justify-center select-none">{value}</span>
      </button>
      <Transition
        show={open}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-97"
        leaveTo="transform opacity-0 scale-95"
      >
        <FloatingFocusManager context={context}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="bg-white rounded-lg p-5 border border-solid border-gray-200 w-56 shadow-md"
          >
            <div className="flex justify-between">
              <span className="whitespace-nowrap select-none">Adults</span>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setValue(Math.max(1, value - 1));
                  }}
                >
                  <MinusCircleIcon
                    className={cn(
                      "w-6 cursor-pointer stroke-gray-500 hover:stroke-black",
                      value === 1 && "!stroke-gray-300 cursor-not-allowed",
                    )}
                  />
                </button>
                <span className="flex w-3 justify-center select-none">{value}</span>
                <button
                  onClick={() => {
                    setValue(Math.min(maxGuests, value + 1));
                  }}
                >
                  <PlusCircleIcon
                    className={cn(
                      "w-6 cursor-pointer stroke-gray-500 hover:stroke-black",
                      value === maxGuests && "!stroke-gray-300 cursor-not-allowed",
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </FloatingFocusManager>
      </Transition>
    </>
  );
};
