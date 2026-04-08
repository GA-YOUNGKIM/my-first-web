'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);
    
    // 백엔드가 없으므로 시뮬레이션
    setTimeout(() => {
      alert('저장되었습니다');
      router.push('/posts');
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-10">
        <Link
          href="/posts"
          className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          ← 목록으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4 tracking-tight">새 게시글 작성</h1>
        <p className="text-gray-500 mt-2">새로운 소식이나 생각을 공유해 보세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="여기에 내용을 작성하세요..."
            required
            rows={10}
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none resize-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-white transition-all shadow-lg shadow-blue-100 ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98]'
            }`}
          >
            {isSubmitting ? '저장 중...' : '게시글 저장하기'}
          </button>
          <Link
            href="/posts"
            className="px-8 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all active:scale-[0.98] text-center"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
