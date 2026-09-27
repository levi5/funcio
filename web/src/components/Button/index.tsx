import styles from './styles.css'

type Variant = 'primary' | 'ghost' | 'run' | 'icon'

type Props = {
  variant?: Variant
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  href?: string
  target?: string
  title?: string
  className?: string
  testId?: string
}

export const Button = ({
  variant = 'ghost',
  children,
  onClick,
  disabled,
  href,
  target,
  title,
  className,
  testId
}: Props) => {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(' ')

  if (href !== undefined) {
    return (
      <a
        className={classes}
        href={href}
        target={target}
        rel={target ? 'noreferrer' : undefined}
        title={title}
        data-testid={testId}
      >
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} onClick={onClick} disabled={disabled} title={title} data-testid={testId}>
      {children}
    </button>
  )
}
