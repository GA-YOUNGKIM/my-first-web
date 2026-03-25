export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">김가영</h1>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">학교:</span> 한신대학교
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">전공:</span> 디지털영상문화콘텐츠학
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">취미:</span> 독서, 코딩, 등산
        </p>
      </div>
    </div>
  );
}
