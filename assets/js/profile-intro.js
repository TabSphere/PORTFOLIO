/* Native controls remain usable if JavaScript is unavailable. */
(() => {
  const video = document.querySelector('#profile-intro-video');
  const play = document.querySelector('[data-profile-play]');
  const status = document.querySelector('#profile-video-status');
  if (!video || !play || !status) return;

  play.hidden = false;
  const announceFailure = () => {
    play.hidden = true;
    status.textContent = 'The video could not load. Use the download link below to watch it.';
  };
  play.addEventListener('click', async () => {
    status.textContent = '';
    try {
      await video.play();
      video.focus({ preventScroll: true });
    } catch {
      announceFailure();
    }
  });
  video.addEventListener('play', () => {
    play.hidden = true;
    status.textContent = '';
  });
  video.addEventListener('ended', () => {
    play.querySelector('span').textContent = 'Replay introduction';
    play.hidden = false;
  });
  video.addEventListener('error', announceFailure);
})();
