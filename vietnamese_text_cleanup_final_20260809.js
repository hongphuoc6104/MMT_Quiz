// Final exact cleanup for the last two genuinely broken OCR records found by the 314-question audit.
(function () {
  'use strict';
  const data = window.QUIZ_DATA;
  if (!data || !Array.isArray(data.questions)) return;
  const byId = new Map(data.questions.map(q => [q.id, q]));

  const qSignal = byId.get('De02-20-63');
  if (qSignal) {
    qSignal.question = 'Một tín hiệu được truyền từ điểm A đến điểm B. Hãy xác định độ suy giảm của tín hiệu này. (PDF nguồn bị thiếu các giá trị công suất tại A/B.)';
  }

  const qCollision = byId.get('De04-5-198');
  if (qCollision) {
    qCollision.question = 'Cho sơ đồ mạng như hình, bạn hãy cho biết có bao nhiêu miền đụng độ (Collision Domain)?';
    const optionD = qCollision.options?.find(o => o.id === 'd');
    if (optionD) optionD.text = '4';
    // Do not change correct_option_id: the audited correct answer remains option c = 6.
  }
})();
