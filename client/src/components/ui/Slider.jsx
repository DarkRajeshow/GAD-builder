"use client";

import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import PropTypes from "prop-types";
import { cn } from "../../utility/utils";

const Slider = React.forwardRef(
    ({ className, ...props }, ref) => (
        <SliderPrimitive.Root
            ref={ref}
            className={cn(
                "relative flex w-full touch-none select-none items-center font-medium",
                className
            )}
            {...props}
        >
            <SliderPrimitive.Track className="cursor-pointer relative h-[2px] w-full font-medium grow overflow-hidden rounded-full bg-dark/20" >
                <SliderPrimitive.Range className="absolute h-full bg-dark font-medium" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="cursor-grab block h-4 w-1 border border-dark/50 bg-dark shadow focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 font-medium" />
        </SliderPrimitive.Root>
    )
);

Slider.displayName = SliderPrimitive.Root.displayName;

Slider.propTypes = {
    className: PropTypes.string,
    props: PropTypes.object,
};

export { Slider };
