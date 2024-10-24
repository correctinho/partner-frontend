'use client'

import { ReactNode } from "react";

interface PrivateLayoutProps {
  children: ReactNode
}


export default function PrivateLayout({ children }: PrivateLayoutProps) {

  return <>
    {children}
  </>
}
