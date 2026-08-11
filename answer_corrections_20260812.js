// Targeted technical answer corrections identified during manual review.
// Loaded after OCR/text cleanup and before app.js so shuffled choices keep stable option IDs.
(function () {
  'use strict';

  const data = window.QUIZ_DATA;
  const manual = window.MANUAL_SOLUTIONS || {};
  if (!data || !Array.isArray(data.questions)) return;

  function normalize(value) {
    return String(value || '').normalize('NFC').trim();
  }

  function findOptionByText(question, expectedText) {
    const target = normalize(expectedText).toLowerCase();
    return (question.options || []).find((option) => normalize(option.text).toLowerCase() === target);
  }

  // De04, source question 16, page 26/section shown in the quiz:
  // The source key marks the statement about upper-layer headers as FALSE, but that
  // statement describes normal encapsulation. The false statement is the one saying
  // frame data contains only upper-layer data, omitting the already-added upper-layer headers.
  const frameQuestion = data.questions.find((q) => q.id === 'De04-16-139');
  if (frameQuestion) {
    const corrected = findOptionByText(
      frameQuestion,
      'Dữ liệu của khung chỉ chứa dữ liệu của các tầng bên trên'
    );

    if (corrected) {
      frameQuestion.correct_option_id = corrected.id;
      frameQuestion.verification = 'corrected';
      frameQuestion.warning = 'Khóa đáp án nguồn của câu này đã được đính chính theo cơ chế đóng gói dữ liệu (encapsulation) ở tầng liên kết dữ liệu.';
      frameQuestion.explanation = 'Phát biểu sai là: “Dữ liệu của khung chỉ chứa dữ liệu của các tầng bên trên”. Khi đóng gói, payload của frame là PDU của tầng trên nên đã bao gồm các header do các tầng trên thêm vào; tầng liên kết dữ liệu tiếp tục thêm header và trailer của chính nó để tạo frame.';
    }

    const m = manual[frameQuestion.id];
    if (m) {
      m.knowledge = 'Encapsulation: mỗi tầng nhận PDU từ tầng trên, xem toàn bộ PDU đó là payload rồi thêm thông tin điều khiển của chính tầng mình. Vì vậy frame ở tầng liên kết dữ liệu gồm L2 header + payload (PDU tầng mạng, đã chứa các header tầng trên) + L2 trailer.';
      m.reasoning = 'Câu hỏi yêu cầu chọn phát biểu SAI. Phát biểu cho rằng dữ liệu của frame “chỉ chứa dữ liệu của các tầng bên trên” là thiếu các header đã được thêm trong quá trình đóng gói, nên đây là phát biểu sai.';
      m.summary = 'Frame = L2 header + PDU tầng trên + L2 trailer. PDU tầng trên đã chứa các header của những tầng phía trên.';
    }
  }

  // De04-27-184 ("Tín hiệu tương tự là?") keeps its existing key. The option
  // "biên độ thay đổi liên tục theo thời gian" is the intended/best answer in this
  // introductory question, although a rigorous definition is that an analog signal
  // can take a continuum of values rather than being defined by "must always change".
})();
