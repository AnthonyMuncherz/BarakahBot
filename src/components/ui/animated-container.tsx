import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { containerVariants } from "@/lib/animation-variants";

interface AnimatedContainerProps extends Omit<HTMLMotionProps<"div">, "children" | "variants"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedContainer = React.forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        transition={{
          delay,
          staggerChildren: 0.1,
          delayChildren: 0.2,
        }}
        className={cn("grid gap-4", className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedContainer.displayName = "AnimatedContainer";

export { AnimatedContainer }; 