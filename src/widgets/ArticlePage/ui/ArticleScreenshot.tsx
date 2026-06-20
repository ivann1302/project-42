'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import type { ArticleImage } from '@/entities/Article'
import styles from './ArticleScreenshot.module.scss'

type Props = {
  image: ArticleImage
}

const SCREENSHOT_WIDTH = 1678
const SCREENSHOT_HEIGHT = 937

export function ArticleScreenshot({ image }: Props) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [close, open])

  return (
    <>
      <figure className={styles.figure}>
        <button className={styles.trigger} type="button" onClick={() => setOpen(true)}>
          <Image
            className={styles.image}
            src={image.src}
            alt={image.alt}
            width={SCREENSHOT_WIDTH}
            height={SCREENSHOT_HEIGHT}
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 880px, 1280px"
          />
        </button>
        {image.caption ? <figcaption className={styles.caption}>{image.caption}</figcaption> : null}
      </figure>

      {open ? (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          onClick={close}
        >
          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <button className={styles.close} type="button" onClick={close}>
              Закрыть
            </button>
            <Image
              className={styles.modalImage}
              src={image.src}
              alt={image.alt}
              width={SCREENSHOT_WIDTH}
              height={SCREENSHOT_HEIGHT}
              sizes="96vw"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
