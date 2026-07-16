import Link from 'next/link';
import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type BaseProps = {
  children: ReactNode;
  className?: string;
};

type ButtonAsButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
};

type ButtonAsLinkProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export default function Button(props: ButtonProps) {
  const { children, className = '', href, ...rest } = props;
  
  const baseClasses = "w-full bg-[#2e7d32] hover:bg-[#1b5e20] active:bg-[#1b5e20] text-white font-semibold text-lg rounded-2xl py-4 transition-colors shadow-sm text-center block";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedClasses} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
