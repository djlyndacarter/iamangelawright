/* Netlify Forms: submit in place and show the same messages the old site showed. */
(function(){
 function notice(text){var n=document.createElement('div');n.style.cssText='position:fixed;z-index:999999;right:20px;bottom:20px;padding:18px;background:#123e26;color:white;box-shadow:0 5px 25px #000';n.textContent=text;document.body.appendChild(n);setTimeout(function(){n.remove()},12000);}
 function send(form){return fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()}).then(function(r){if(!r.ok)throw new Error(r.status);});}
 document.addEventListener('submit',function(e){
  var form=e.target;if(!form.matches('form[data-netlify]'))return;
  e.preventDefault();
  var btn=form.querySelector('[type=submit]');if(btn)btn.disabled=true;
  var feedback=form.querySelector('#aw-form-feedback');
  send(form).then(function(){
   form.reset();
   if(feedback){feedback.textContent='Thank you. Your inquiry has been received.';feedback.style.color='#36ce7f';}
   else{document.querySelector('#aw-modal-backdrop .aw-modal-close')?.click();notice('Your request was received. Angela’s team will follow up.');}
  }).catch(function(){
   var msg='We could not send your request. Please try again or email iamangelawright@gmail.com.';
   if(feedback){feedback.textContent=msg;feedback.style.color='#ffadad';}else notice(msg);
  }).finally(function(){if(btn)btn.disabled=false;});
 });
})();
