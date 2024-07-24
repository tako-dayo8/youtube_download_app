"use client";

import { useEffect } from 'react'

export default function Loader() {
  useEffect(() => {
    async function getLoader() {
      const { ring2 } = await import("ldrs")
      ring2.register()
    }
    getLoader()
  }, [])
  return (
    // Default values shown
    <l-ring-2
      size="69"
      stroke="6"
      stroke-length="0.25"
      bg-opacity="0.1"
      speed="0.8"
      color="#000000"
    ></l-ring-2>
  )
}