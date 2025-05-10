import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to detect mobile devices
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Function to prevent default browser behaviors that might interfere with the game
export function preventDefaultBehaviors() {
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });
  
  document.addEventListener('wheel', (e) => {
    e.preventDefault();
  }, { passive: false });
}
