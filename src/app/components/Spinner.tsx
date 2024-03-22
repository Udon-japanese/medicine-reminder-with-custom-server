import styles from '@styles/components/spinner.module.scss';

export default function Spinner({
  className = '',
  show = true,
}: {
  className?: string;
  show?: boolean;
}) {
  return show && <div className={`${className} ${styles.spinner}`} />;
}
