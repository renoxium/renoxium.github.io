'use client';

import { useRouter } from 'next/navigation';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { PAGE_PATH, type PageKey, useStage } from './StageContext';

type CommonProps = {
  to: PageKey;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
};

type AnchorProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick' | 'className' | 'style' | 'children'> & {
    as?: 'a';
  };

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'className' | 'style' | 'children'> & {
    as: 'button';
    type?: 'button' | 'submit';
  };

type Props = AnchorProps | ButtonProps;

// Drop-in nav primitive. Renders a real <a href> by default (so links are crawlable
// and middle-click / copy-link work) but intercepts left-click to drive Stage's
// goTo() with the click rect as origin. Falls back to <button> when `as="button"`
// for places where an anchor would be semantically wrong.
export const StageLink = forwardRef<HTMLAnchorElement | HTMLButtonElement, Props>(
  function StageLink(props, ref) {
    const stage = useStage();
    const router = useRouter();
    const href = PAGE_PATH[props.to];

    const handleClick = (
      e: ReactMouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    ) => {
      // Allow modified clicks (cmd/ctrl/middle-click) to behave normally
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      stage.goTo(props.to, { originRect: rect });
    };

    const prefetch = () => {
      try {
        router.prefetch(href);
      } catch {
        // ignored — prefetch is a hint
      }
    };

    if (props.as === 'button') {
      const { to, children, className, style, ariaLabel, type, ...rest } = props;
      void to;
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type={type ?? 'button'}
          className={className}
          style={style}
          aria-label={ariaLabel}
          onClick={handleClick}
          onMouseEnter={prefetch}
          onFocus={prefetch}
          {...rest}
        >
          {children}
        </button>
      );
    }

    const { to, children, className, style, ariaLabel, as, ...rest } = props as AnchorProps;
    void to;
    void as;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={className}
        style={style}
        aria-label={ariaLabel}
        onClick={handleClick}
        onMouseEnter={prefetch}
        onFocus={prefetch}
        {...rest}
      >
        {children}
      </a>
    );
  },
);
