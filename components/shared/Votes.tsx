'use client';
import { donwvoteAnswer, upvoteAnswer } from '@/lib/actions/answer.action';
import {
  donwvoteQuestion,
  upvoteQuestion,
} from '@/lib/actions/question.action';
import { toggleSaveQuestion } from '@/lib/actions/user.action';
import { formatAndDivideNumber } from '@/lib/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasupVoted: boolean;
  downVotes: number;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downVotes,
  hasdownVoted,
  hasSaved,
}: Props) => {
  console.log(upvotes);
  const path = usePathname();

  const handleSave = async () => {
    if (!userId) return;
    await toggleSaveQuestion({ path, questionId: itemId, userId });
  };

  const handleVote = async (typeofVote: 'upvote' | 'downvote') => {
    if (!userId) {
      return;
    }
    if (typeofVote === 'upvote') {
      if (type === 'question') {
        await upvoteQuestion({
          hasdownVoted,
          hasupVoted,
          path,
          questionId: itemId,
          userId,
        });
      } else {
        await upvoteAnswer({
          hasdownVoted,
          hasupVoted,
          path,
          answerId: itemId,
          userId,
        });
      }
    } else {
      if (type === 'question') {
        await donwvoteQuestion({
          hasdownVoted,
          hasupVoted,
          path,
          questionId: itemId,
          userId,
        });
      } else {
        await donwvoteAnswer({
          hasdownVoted,
          hasupVoted,
          path,
          answerId: itemId,
          userId,
        });
      }
    }
  };
  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasupVoted
                ? '/assets/icons/upvoted.svg'
                : '/assets/icons/upvote.svg'
            }
            height={18}
            width={18}
            alt="upvote"
            onClick={() => handleVote('upvote')}
          />
        </div>
        <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1 ">
          <p className="subtle-medium text-dark400_light900">
            {formatAndDivideNumber(upvotes)}
          </p>
        </div>
      </div>
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasdownVoted
                ? '/assets/icons/downvoted.svg'
                : '/assets/icons/downvote.svg'
            }
            height={18}
            width={18}
            alt="downvote"
            onClick={() => handleVote('downvote')}
          />
        </div>
        <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1 ">
          <p className="subtle-medium text-dark400_light900">
            {formatAndDivideNumber(downVotes)}
          </p>
        </div>
      </div>
      {type === 'question' && (
        <Image
          src={
            hasSaved
              ? '/assets/icons/star-filled.svg'
              : '/assets/icons/star-red.svg'
          }
          height={18}
          width={18}
          alt="start"
          onClick={() => handleSave()}
        />
      )}
    </div>
  );
};

export default Votes;
