import React, { useState } from 'react';
import { X, Volume2, Download, FileText, Sparkles, ChevronLeft, ChevronRight, Music, Film, Layers } from 'lucide-react';
import { StudyMaterial } from '../types';
import { playEnglishPronunciation } from '../utils/storage';

interface MaterialViewerModalProps {
  material: StudyMaterial | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MaterialViewerModal: React.FC<MaterialViewerModalProps> = ({
  material,
  isOpen,
  onClose
}) => {
  if (!isOpen || !material) return null;

  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const hasFlashcards = material.vocabItems && material.vocabItems.length > 0;
  const currentCard = hasFlashcards ? material.vocabItems![activeCardIdx] : null;

  const handleNextCard = () => {
    setIsFlipped(false);
    setActiveCardIdx((prev) => (prev + 1) % material.vocabItems!.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setActiveCardIdx((prev) => (prev - 1 + material.vocabItems!.length) % material.vocabItems!.length);
  };

  const simulatePlayAudio = () => {
    setIsPlayingAudio(true);
    playEnglishPronunciation(material.title + '. Welcome to our English lesson! Listen and repeat after me.');
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-green-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
              {material.type === 'flashcard' && '🗂️'}
              {material.type === 'audio' && '🎧'}
              {material.type === 'pdf' && '📄'}
              {material.type === 'video' && '🎬'}
              {material.type === 'worksheet' && '✏️'}
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-md">
                Khối Lớp {material.grade} • {material.unit}
              </span>
              <h3 className="text-base sm:text-lg font-black font-heading line-clamp-1">
                {material.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
            {material.description}
          </p>

          {/* Flashcard viewer mode */}
          {hasFlashcards && currentCard && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>
                  Thẻ từ vựng {activeCardIdx + 1} / {material.vocabItems!.length}
                </span>
                <span className="text-teal-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Bấm thẻ để xem nghĩa tiếng Việt
                </span>
              </div>

              {/* Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative h-60 w-full rounded-3xl border-2 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center cursor-pointer select-none shadow-md ${
                  isFlipped
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300'
                    : 'bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-300'
                }`}
              >
                {!isFlipped ? (
                  <div className="space-y-2">
                    <div className="text-6xl animate-bounce">{currentCard.icon}</div>
                    <div className="text-3xl font-black text-slate-800 font-heading">
                      {currentCard.en}
                    </div>
                    <div className="text-sm font-semibold text-teal-700">
                      {currentCard.phonetic}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playEnglishPronunciation(currentCard.en);
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-teal-700 text-xs font-bold shadow-xs hover:bg-teal-100 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                      Nghe phát âm chuẩn
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 animate-in fade-in">
                    <div className="text-5xl">{currentCard.icon}</div>
                    <div className="text-xs uppercase font-bold text-amber-600 tracking-wider">
                      Nghĩa Tiếng Việt
                    </div>
                    <div className="text-2xl font-black text-amber-900 font-heading">
                      {currentCard.vi}
                    </div>
                    <div className="text-sm text-slate-600 italic">
                      Tiếng Anh: <span className="font-bold text-slate-800">{currentCard.en}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrevCard}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Từ trước
                </button>

                <button
                  type="button"
                  onClick={() => playEnglishPronunciation(currentCard.en)}
                  className="p-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all active:scale-95 cursor-pointer"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleNextCard}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  Từ tiếp theo
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Audio player mode */}
          {material.type === 'audio' && (
            <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-3xl text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-md">
                <Music className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-base">
                  Bản Thu Âm Bài Nghe Chuẩn Bản Xứ
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Định dạng: MP3 • Thời lượng: 02:45 • Giọng đọc: US English Native
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={simulatePlayAudio}
                  className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  <span>{isPlayingAudio ? 'Đang phát âm thanh...' : 'Bấm Nghe Ngay'}</span>
                </button>
              </div>

              <div className="text-left bg-white p-3 rounded-xl border border-indigo-100 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-indigo-900">💡 Hướng dẫn bé luyện nghe:</p>
                <p>1. Nghe lần 1 để nắm nội dung tổng quát.</p>
                <p>2. Nghe lần 2 và nhắc lại theo từng câu (Shadowing).</p>
                <p>3. Ghi nhớ các từ vựng mới trong bài.</p>
              </div>
            </div>
          )}

          {/* PDF / Worksheet preview */}
          {(material.type === 'pdf' || material.type === 'worksheet' || material.type === 'video') && (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
                {material.type === 'video' ? <Film className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-base">
                  Tài Liệu Đã Được Tối Ưu Cho Học Sinh Lớp {material.grade}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Kích thước: {material.fileSize || '2.5 MB'} • Lượt tải: {material.downloadCount} lượt
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    alert(`Đang tải tài liệu "${material.title}" về máy của bạn...`);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File PDF Về Máy</span>
                </button>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="mt-5 pt-3 border-t border-slate-200 flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-500">Chủ đề:</span>
            {material.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
