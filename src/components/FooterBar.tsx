import React, { ReactNode } from 'react'
import { containerMaxW } from '../config'
import JustboilLogo from './JustboilLogo'

type Props = {
  children: ReactNode
}

export default function FooterBar({ children }: Props) {
  const year = new Date().getFullYear()

  return (
    <footer className={`py-2 px-6 bg-surface-900 text-white/60 ${containerMaxW}`}>
      <div className="block md:flex items-center justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0 text-xs">
          <b className="text-white/80">
            &copy;{year},{` `}
            <a href="https://justboil.me/" rel="noreferrer" target="_blank" className="hover:text-white transition-colors">
              JustBoil.me
            </a>
            .
          </b>
          {` `}
          {children}
        </div>
        <div className="md:py-2">
          <a href="https://justboil.me" rel="noreferrer" target="_blank">
            <JustboilLogo className="w-auto h-6 md:h-5 mx-auto opacity-70" />
          </a>
        </div>
      </div>
    </footer>
  )
}
