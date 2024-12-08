import type { ClassValue } from "clsx";
import { cn } from "~/utils/tailwind-merge";

type Props = {
  className?: ClassValue;
};

export const WaterDropIcon = ({ className }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(className)}
      width={24}
      height={24}
    >
      <title>waterDrop</title>
      <path d="M5.63604 6.63288L12 0.268921L18.364 6.63288C21.8787 10.1476 21.8787 15.8461 18.364 19.3608C14.8492 22.8755 9.15076 22.8755 5.63604 19.3608C2.12132 15.8461 2.12132 10.1476 5.63604 6.63288H5.63604Z" />
    </svg>
  );
};
