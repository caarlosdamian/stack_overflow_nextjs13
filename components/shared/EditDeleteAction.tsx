'use client';
import { deleteAnswer } from '@/lib/actions/answer.action';
import { deleteQuestion } from '@/lib/actions/question.action';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  type: 'Answer' | 'Question';
  itemId: string;
}

const EditDeleteAction = ({ itemId, type }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    if (type === 'Answer') {
      await deleteAnswer({ answerId: itemId, path: pathname });
    } else {
      await deleteQuestion({
        questionId: itemId,
        path: pathname,
      });
    }
  };

  const handleEdit = () => {
    router.push(`/question/edit/${itemId}`);
  };
  return (
    <div className="flex items-center gap-3">
      {type === 'Question' && (
        <Image
          src={`/assets/icons/edit.svg`}
          alt="edit icon"
          height={14}
          width={14}
          className="cursor-pointer"
          onClick={handleEdit}
        />
      )}
      <Image
        src={`/assets/icons/trash.svg`}
        alt="delete icon"
        height={14}
        width={14}
        onClick={handleDelete}
        className="cursor-pointer"
      />
    </div>
  );
};

export default EditDeleteAction;
