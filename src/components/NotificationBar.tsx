import { mdiClose } from '@mdi/js'
import React, { ReactNode, useState } from 'react'
import { ColorKey } from '../interfaces'
import { colorsBgLight, colorsOutline } from '../colors'
import Button from './Button'
import Icon from './Icon'

type Props = {
  color: ColorKey
  icon?: string
  outline?: boolean
  children: ReactNode
  button?: ReactNode
}

const NotificationBar = ({ outline = false, children, ...props }: Props) => {
  const componentColorClass = outline ? colorsOutline[props.color] : colorsBgLight[props.color]

  const [isDismissed, setIsDismissed] = useState(false)

  const dismiss = (e: React.MouseEvent) => {
    e.preventDefault()

    setIsDismissed(true)
  }

  if (isDismissed) {
    return null
  }

  return (
    <div
      className={`px-3 py-4 md:py-3 mb-4 last:mb-0 border rounded-xl transition-colors duration-150 shadow-card ${componentColorClass}`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
          {props.icon && (
            <Icon path={props.icon} w="w-8 md:w-5" h="h-8 md:h-5" size="20" className="md:mr-2" />
          )}
          <span className="text-center md:text-left md:py-1 text-xs">{children}</span>
        </div>
        {props.button}
        {!props.button && (
          <Button icon={mdiClose} color="white" onClick={dismiss} small roundedFull />
        )}
      </div>
    </div>
  )
}

export default NotificationBar
