import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { cardVariants, getResponsiveCardVariants } from "@/lib/animation-variants";

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "children" | "variants"> {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  className?: string;
  useCustomVariants?: boolean;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, direction = 'up', delay = 0, className, useCustomVariants = false, ...props }, ref) => {
    const variants = useCustomVariants ? getResponsiveCardVariants(direction) : cardVariants;

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        whileTap="tap"
        variants={variants}
        transition={{
          delay,
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.5,
        }}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

export { AnimatedCard }; 