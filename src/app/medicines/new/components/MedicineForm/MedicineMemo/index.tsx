import { ReactNode } from 'react';
import MemoInput from './MemoTextInput';

export default function MedicineMemo({ MemoImage }: { MemoImage: ReactNode }) {
  return (
    <div>
      {MemoImage}
      <MemoInput />
    </div>
  );
}
