'use client'

import { CSSProperties, useEffect, useRef } from 'react'

type AdSlotProps = {
  slot: string
  className?: string
  style?: CSSProperties
  format?: 'auto' | 'fluid' | string
  layout?: string
  responsive?: boolean
}

export default function AdSlot({
  slot,
  className,
  style,
  format = 'auto',
  layout,
  responsive = true,
}: AdSlotProps) {
  const enabled = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ADSENSE_ENABLED === '1'
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''
  const pushedRef = useRef(false)

  useEffect(() => {
    if (!enabled || !client || !slot) return
    // Avoid double push on re-render/navigations
    if (pushedRef.current) return
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushedRef.current = true
    } catch (e) {
      // noop in dev
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[AdSlot] push error', e)
      }
    }
  }, [enabled, client, slot])

  if (!enabled || !client || !slot) return null

  return (
    <ins
      className={`adsbygoogle ${className || ''}`}
      style={{ display: 'block', ...(style || {}) }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
      {...(layout ? { 'data-ad-layout': layout } : {})}
    />
  )
}

