'use client';
import * as React from 'react';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';

const VisuallyHidden = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <VisuallyHiddenPrimitive.Root>{children}</VisuallyHiddenPrimitive.Root>
);

export { VisuallyHidden };
