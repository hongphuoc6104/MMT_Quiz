// Load the validated manual solution source in a deterministic order, then start the app.
(function(){
  const scripts=[
    'question_structure_fixes.js',
    'manual_solutions/de01_a.js','manual_solutions/de01_b.js','manual_solutions/de01_ver2.js',
    'manual_solutions/de02_a.js','manual_solutions/de02_b.js','manual_solutions/de03_a.js','manual_solutions/de03_b.js',
    'manual_solutions/de04_ch1_a.js','manual_solutions/de04_ch1_b.js','manual_solutions/de04_ch1_c.js',
    'manual_solutions/de04_ch3_a.js','manual_solutions/de04_ch3_b.js','manual_solutions/de04_ch4.js',
    'manual_solutions/de04_ch5_a.js','manual_solutions/de04_ch5_b.js','manual_solutions/de04_ch6_a.js','manual_solutions/de04_ch6_b.js',
    'manual_solutions/de04_ch7_a.js','manual_solutions/de04_ch7_b.js','manual_solutions/de04_ch8_a.js','manual_solutions/de04_ch8_b.js',
    'manual_solutions/de07.js','manual_solutions/de08.js',
    'data_corrections.js','manual_to_static.js','app.js','learning_view.js','image-crops.js','ux.js','tthcm_layout.js'
  ];

  function load(src){
    return new Promise((resolve,reject)=>{
      const el=document.createElement('script');
      el.src=src;
      el.onload=resolve;
      el.onerror=()=>reject(new Error(`Không tải được ${src}`));
      document.body.appendChild(el);
    });
  }

  (async()=>{
    try{
      for(const src of scripts)await load(src);
    }catch(err){
      console.error(err);
      const main=document.querySelector('main')||document.body;
      main.innerHTML=`<div class="card"><h2>Không thể mở bộ đề</h2><p>${String(err.message||err)}</p><p>Hãy tải lại trang. Nếu lỗi còn lặp lại, kiểm tra file dữ liệu trong repository.</p></div>`;
    }
  })();
})();