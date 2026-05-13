import Image from 'next/image'
import clsx from 'clsx'
import type { PropsWithClassName } from '@/shared/types'
import styles from './SocialLinks.module.scss'

const SOCIAL_LINKS = [
  {
    label: 'Telegram',
    href: 'https://t.me/ivann97n',
    icon: '/images/social-Icons/tg-icon.png',
  },
  {
    label: 'MAX',
    href: 'https://max.ru/u/f9LHodD0cOJ3bESpnMANQoyejFdeTcoGRFmNOyMIWRGnFX8VmxGipv3OHNA',
    icon: '/images/social-Icons/Max-icon.svg',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/79998589878',
    icon: '/images/social-Icons/whatsappIcon.png',
  },
] as const

type Props = PropsWithClassName & {
  onLinkClick?: () => void
}

export function SocialLinks({ className, onLinkClick }: Props) {
  return (
    <div className={clsx(styles.root, className)} role="group" aria-label="Социальные сети">
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          aria-label={`Написать в ${link.label}`}
          title={link.label}
          onClick={onLinkClick}
        >
          <Image
            src={link.icon}
            alt=""
            width={34}
            height={34}
            className={styles.icon}
            aria-hidden="true"
          />
        </a>
      ))}
    </div>
  )
}
