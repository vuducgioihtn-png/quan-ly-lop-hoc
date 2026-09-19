import React, { useState } from 'react';
import { X, Volume2, CheckCircle, ArrowRight, Award, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Homework, HomeworkSubmission } from '../types';
import { playEnglishPronunciation } from '../utils/storage';

interface InteractiveHomeworkModalProps {
  homework: Homework | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitHomework: (submission: Omit<HomeworkSubmission, 'id'>) => void;
  studentId: string;
  studentName: string;
  englishName?: string;
  existingSubmission?: HomeworkSubmission;
}

export const InteractiveHomeworkModal: React.FC<InteractiveHomeworkModalProps> = ({
  homework,
  isOpen,
  onClose,
  onSubmitHomework,
  studentId,
  studentName,
  englishName,
  existingSubmission
}) => {
  if (!isOpen || !homework) return null;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(
    existingSubmission?.answers || {}
  );
  const [isDone, setIsDone] = useState(!!existingSubmission);

  const questions = homework.questions;
  const currentQ = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;

  const handleSelectOption = (option: string) => {
    if (existingSubmission) return; // Read-only if already submitted
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option
    }));
  };

  const handleFinish = () => {
    // Calculate preview score based on correct answers
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 10);
    const stars = calculatedScore >= 8 ? 5 : calculatedScore >= 5 ? 3 : 1;

    onSubmitHomework({
      homeworkId: homework.id,
      classId: homework.classId,
      className: homework.className,
      studentId,
      studentName,
      englishName,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      answers: selectedAnswers,
      score: calculatedScore,
      starsAwarded: stars,
      teacherFeedback:
        calculatedScore === 10
          ? '🌟 Xuất sắc tuyệt đối! Con làm đúng tất cả các câu!'
          : calculatedScore >= 8
          ? '🎉 Rất tốt! Con nắm bài rất vững, hãy tiếp tục phát huy nhé!'
          : '💪 Cố gắng thêm nhé con! Đọc kỹ câu hỏi để lần sau đạt điểm cao hơn.',
      feedbackSticker: calculatedScore >= 8 ? 'super-star' : 'good-effort',
      status: 'submitted'
    });

    setIsDone(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const allAnswered = questions.every((q) => !!selectedAnswers[q.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
              ✍️
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-md">
                {homework.unit}
              </span>
              <h3 className="text-base sm:text-lg font-black font-heading line-clamp-1">
                {homework.title}
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

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isDone || existingSubmission ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-4xl shadow-inner">
                ⭐
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-800 font-heading">
                  {existingSubmission?.status === 'graded' ? 'Bài Đã Được Chấm Điểm!' : 'Đã Nộp Bài Thành Công!'}
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  Chúc mừng {englishName || studentName} đã hoàn thành bài tập!
                </p>
              </div>

              {/* Score & Stars card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-5 max-w-sm mx-auto shadow-sm">
                <div className="flex items-center justify-around">
                  <div>
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Điểm Số</p>
                    <p className="text-3xl font-black text-amber-600">
                      {existingSubmission?.score ?? 10}/10
                    </p>
                  </div>
                  <div className="w-px h-12 bg-amber-200" />
                  <div>
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Sao Thưởng</p>
                    <p className="text-3xl font-black text-amber-600 flex items-center justify-center gap-1">
                      <span>+{existingSubmission?.starsAwarded ?? 5}</span>
                      <span className="text-2xl">⭐</span>
                    </p>
                  </div>
                </div>

                {existingSubmission?.teacherFeedback && (
                  <div className="mt-4 pt-3 border-t border-amber-200 text-left">
                    <p className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1">
                      <span>👩‍🏫 Lời nhận xét của Cô giáo:</span>
                    </p>
                    <p className="text-xs text-slate-700 italic bg-white/80 p-2.5 rounded-xl border border-amber-100">
                      "{existingSubmission.teacherFeedback}"
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Đóng Lại
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Question Stepper */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  Câu hỏi {currentIdx + 1} / {questions.length}
                </span>
                <div className="flex items-center gap-1.5">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      className={`w-7 h-7 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        currentIdx === i
                          ? 'bg-indigo-600 text-white scale-110 shadow-sm'
                          : selectedAnswers[questions[i].id]
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Question Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-base sm:text-lg font-extrabold text-slate-800 leading-snug">
                    {currentQ.question}
                  </p>
                  <button
                    type="button"
                    onClick={() => playEnglishPronunciation(currentQ.question)}
                    className="p-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-colors shrink-0 cursor-pointer"
                    title="Bấm để nghe phát âm tiếng Anh chuẩn"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                  Bé hãy chọn 1 đáp án chính xác nhất bên dưới:
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options?.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full text-left p-3.5 rounded-2xl font-bold text-sm sm:text-base border-2 transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-md ring-2 ring-indigo-200'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>

              {/* Bottom navigation */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Câu trước
                </button>

                {isLastQuestion ? (
                  <button
                    type="button"
                    disabled={!allAnswered}
                    onClick={handleFinish}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-black shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Nộp Bài & Nhận Sao ⭐</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Câu tiếp theo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
