'use client';
import React, { useRef, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AnswerSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from '@/context/ThemeProvider';
import { Button } from '../ui/button';
import Image from 'next/image';
import { createAnswer } from '@/lib/actions/answer.action';
import { usePathname } from 'next/navigation';
import { useToast } from '../ui/use-toast';

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

const Answer = ({ authorId, question, questionId }: Props) => {
  const editorRef = useRef(null);
  const pathname = usePathname();
  const { toast } = useToast();
  const { mode } = useTheme();
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isSubmittingAI, setIsSubmittingAI] = useState(false);
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: '',
    },
  });

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    if (!authorId) {
      toast({
        title: 'Please log in',
        description: 'You must be logged in to perform this action',
      });
      return;
    }
    setIsSubmiting(true);
    try {
      await createAnswer({
        content: values.answer,
        author: authorId,
        question: questionId,
        path: pathname,
      });
      form.reset();
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent('');
      }
      toast({
        title: 'AnswerPosted',
        description: 'You answer has been succesfully posted.',
      });
    } catch (error) {
    } finally {
      setIsSubmiting(false);
    }
  };

  const generateAIAnswer = async () => {
    if (!authorId) {
      toast({
        title: 'Please log in',
        description: 'You must be logged in to perform this action',
      });
      return;
    }
    setIsSubmittingAI(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        {
          method: 'POST',
          body: JSON.stringify({ question }),
        }
      );
      const aiAnswer = await response.json();
      const formattedAnswer = aiAnswer.reply.replace(/\n/g, '<br/>');
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formattedAnswer);
      }
      // toasrt
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmittingAI(false);
    }
  };
  return (
    <div className="">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your asnwer here
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 px-4 py-2.5 text-primary-500 shadow-none"
          onClick={generateAIAnswer}
        >
          {isSubmittingAI ? (
            <>Generating...</>
          ) : (
            <>
              <Image
                src="/assets/icons/stars.svg"
                height={12}
                width={12}
                alt="start"
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'codesample',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                      ],
                      toolbar:
                        'undo redo | ' +
                        'codesample | bold italic forecolor | alignleft aligncenter |' +
                        'alignright alignjustify | bullist numlist',
                      content_style:
                        'body { font-family:Inter; font-size:16px }',
                      skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                      content_css: mode === 'dark' ? 'dark' : 'light',
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmiting}
              className="primary-gradient w-fit text-white"
            >
              {isSubmiting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
