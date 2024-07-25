  document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.w-slider');
    let autoplayTimeout;

    // Function to initialize and play video
    function initializeAndPlayVideo(video) {
      if (!video.src) {
        video.src = video.dataset.src;
      }
      video.play();
      video.style.opacity = 1;
      video.style.transition = 'opacity 0.8s'; // Ensure smooth transition
    }

    // Function to handle video end
    function handleVideoEnd(event) {
      const video = event.target;
      video.style.opacity = 0; // Fade out the video

      setTimeout(() => {
        const activeSlide = video.closest('.w-slide');
        const image = activeSlide.querySelector('.hero-slider-img');
        if (image) {
          image.style.opacity = 1; // Ensure the image is fully visible
        }
      }, 800); // Ensure the video fades out before displaying the image

      clearTimeout(autoplayTimeout);
      autoplayTimeout = setTimeout(() => {
        $('.w-slider-arrow-right').click();
      }, 1800); // Wait 2.6 seconds (0.8s for fade out + 1.8s for image display)
    }

    // Function to observe and load visible videos
    function observeVisibleVideos() {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          const video = entry.target;
          if (entry.isIntersecting) {
            initializeAndPlayVideo(video);
          } else {
            video.pause();
            video.currentTime = 0;
            video.style.opacity = 0;
          }
        });
      }, observerOptions);

      const videos = document.querySelectorAll('.hero-slider-video');
      videos.forEach(video => {
        observer.observe(video);
      });
    }

    // Function to start autoplay on video end
    function startAutoplayOnVideoEnd() {
      const videos = document.querySelectorAll('.hero-slider-video');
      videos.forEach(video => {
        video.removeEventListener('ended', handleVideoEnd); // Remove existing listener to avoid duplicates
        video.addEventListener('ended', handleVideoEnd); // Add listener for video end
      });
    }

    // Function to handle slide changes
    function handleSlideChange() {
      const activeSlide = document.querySelector('.w-slide[aria-hidden="false"]');
      const videos = document.querySelectorAll('.hero-slider-video');
      videos.forEach(video => {
        const slide = video.closest('.w-slide');
        if (slide !== activeSlide) {
          video.pause();
          video.currentTime = 0;
          video.style.opacity = 0;
        } else {
          initializeAndPlayVideo(video);
        }
      });
    }

    // Function to resume autoplay
    function resumeAutoplay() {
      clearTimeout(autoplayTimeout);
      const activeSlide = document.querySelector('.w-slide[aria-hidden="false"]');
      const video = activeSlide.querySelector('.hero-slider-video');
      if (video) {
        autoplayTimeout = setTimeout(() => {
          $('.w-slider-arrow-right').click();
        }, video.duration * 1000 + 1800); // Duration of video + 1.8s for image display
      }
    }

    // Function to attach slide change listeners
    function attachSlideChangeListener() {
      $(slider).on('swipe', function() {
        handleSlideChange();
        startAutoplayOnVideoEnd();
        resumeAutoplay();
      });

      $(slider).on('slide', function() {
        handleSlideChange();
        startAutoplayOnVideoEnd();
        resumeAutoplay();
      });

      $(slider).on('click', '.w-slider-arrow-left, .w-slider-arrow-right', function() {
        handleSlideChange();
        startAutoplayOnVideoEnd();
        resumeAutoplay();
      });

      $(slider).on('click', '.w-slider-dot', function() {
        handleSlideChange();
        startAutoplayOnVideoEnd();
        resumeAutoplay();
      });
    }

    observeVisibleVideos(); // Observe videos for lazy loading
    attachSlideChangeListener(); // Attach slide change listeners
    handleSlideChange(); // Initialize the first slide
    startAutoplayOnVideoEnd(); // Start autoplay on video end
  });
